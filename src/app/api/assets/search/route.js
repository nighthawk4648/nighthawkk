import { NextResponse } from "next/server";
import slugify from "@/utils/slugify";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || searchParams.get("search") || "";
  const sanitizedQuery = query.trim();

  // If query < 2 chars, return empty sets
  if (!sanitizedQuery || sanitizedQuery.length < 2) {
    return NextResponse.json(
      { success: true, data: { asset: [], category: [], subCategory: [] } },
      { status: 200 }
    );
  }

  try {
    const backendBaseUrl =
      process.env.API_URL_INTERNAL ||
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
      "https://api.sketchshaper.com/api";

    const res = await fetch(
      `${backendBaseUrl}/search?search=${encodeURIComponent(sanitizedQuery)}`,
      {
        signal: AbortSignal.timeout(6000),
        headers: { Accept: "application/json" },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      throw new Error(`Upstream search responded with HTTP ${res.status}`);
    }

    const payload = await res.json();
    const rawAssets = payload?.data?.asset || [];
    const rawCategories = payload?.data?.category || [];
    const rawSubCategories = payload?.data?.subCategory || [];

    // Project assets: max 20
    const asset = rawAssets.slice(0, 20).map((item) => {
      const catName = item?.sub_category?.category?.name || "models";
      const subCatName = item?.sub_category?.name || "assets";
      return {
        id: item.id,
        name: item.name,
        slug: `/${slugify(catName)}/${slugify(subCatName)}/${slugify(item.name)}-${item.id}`,
        cover: item.cover || null,
        access_type: item.access_type || "free",
        categoryName: catName,
        subCategoryName: subCatName,
      };
    });

    // Project categories: max 5
    const category = rawCategories.slice(0, 5).map((item) => ({
      id: item.id,
      name: item.name,
      slug: `/${slugify(item.name)}-${item.id}`,
    }));

    // Known category fallbacks
    const KNOWN_CATEGORIES = new Map([
      [3, "Sketchup 3D models"],
      [4, "Textures"],
      [5, "Sketchup plugins"],
    ]);

    // Map categories for ID/name lookup
    const catLookup = new Map(rawCategories.map((c) => [c.id, c.name]));

    // Project subCategories: max 5
    const subCategory = rawSubCategories.slice(0, 5).map((item) => {
      const catId = item?.category?.id || item?.category_id || 3;
      const catName =
        item?.category?.name ||
        catLookup.get(catId) ||
        KNOWN_CATEGORIES.get(Number(catId)) ||
        "Sketchup 3D models";
      const catSlug = catId ? `${slugify(catName)}-${catId}` : slugify(catName);
      const subCatSlug = `${slugify(item.name)}-${item.id}`;

      return {
        id: item.id,
        name: item.name,
        category_id: catId,
        category_name: catName,
        slug: `/${catSlug}/${subCatSlug}`,
      };
    });

    return NextResponse.json(
      { success: true, data: { asset, category, subCategory } },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("Asset search route error:", error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Search failed",
        data: { asset: [], category: [], subCategory: [] },
      },
      { status: 500 }
    );
  }
}


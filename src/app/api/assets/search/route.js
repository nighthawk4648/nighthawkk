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
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`Upstream search responded with HTTP ${res.status}`);
    }

    const payload = await res.json();
    const rawAssets = payload?.data?.asset || [];
    const rawCategories = payload?.data?.category || [];
    const rawSubCategories = payload?.data?.subCategory || [];

    const qLower = sanitizedQuery.toLowerCase();
    const qTokens = qLower.split(/\s+/).filter((t) => t.length >= 2);

    // 1. Strict relevance filter for assets: match Name, Subcategory, or Category (ignore description)
    const filteredAssets = rawAssets.filter((item) => {
      const assetName = (item?.name || "").toLowerCase();
      const subName = (item?.sub_category?.name || "").toLowerCase();
      const catName = (item?.sub_category?.category?.name || "").toLowerCase();

      return (
        assetName.includes(qLower) ||
        subName.includes(qLower) ||
        catName.includes(qLower) ||
        (qTokens.length > 0 &&
          qTokens.some(
            (t) =>
              assetName.includes(t) ||
              subName.includes(t) ||
              catName.includes(t)
          ))
      );
    });

    // Sort assets: direct name match first, then subcategory/category match
    filteredAssets.sort((a, b) => {
      const aName = (a?.name || "").toLowerCase();
      const bName = (b?.name || "").toLowerCase();
      const aSub = (a?.sub_category?.name || "").toLowerCase();
      const bSub = (b?.sub_category?.name || "").toLowerCase();

      const aScore = aName.includes(qLower) ? 3 : aSub.includes(qLower) ? 2 : 1;
      const bScore = bName.includes(qLower) ? 3 : bSub.includes(qLower) ? 2 : 1;
      return bScore - aScore;
    });

    // Project assets: max 20
    const asset = filteredAssets.slice(0, 20).map((item) => {
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

    // 2. Strict relevance filter for categories: name must contain query
    const filteredCategories = rawCategories.filter((cat) => {
      const catName = (cat?.name || "").toLowerCase();
      return (
        catName.includes(qLower) ||
        (qTokens.length > 0 && qTokens.some((t) => catName.includes(t)))
      );
    });

    // Project categories: max 5
    const category = filteredCategories.slice(0, 5).map((item) => ({
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

    // 3. Strict relevance filter for subcategories: name or parent category must contain query
    const filteredSubCategories = rawSubCategories.filter((sub) => {
      const subName = (sub?.name || "").toLowerCase();
      const catName = (sub?.category?.name || "").toLowerCase();
      return (
        subName.includes(qLower) ||
        catName.includes(qLower) ||
        (qTokens.length > 0 && qTokens.some((t) => subName.includes(t)))
      );
    });

    // Sort subcategories: direct match first
    filteredSubCategories.sort((a, b) => {
      const aName = (a?.name || "").toLowerCase();
      const bName = (b?.name || "").toLowerCase();
      const aExact = aName === qLower || aName.startsWith(qLower);
      const bExact = bName === qLower || bName.startsWith(qLower);
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return aName.localeCompare(bName);
    });

    // Project subCategories: max 5
    const subCategory = filteredSubCategories.slice(0, 5).map((item) => {
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


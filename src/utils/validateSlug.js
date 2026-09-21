import getData from "@/utils/getData";
import slugify from "@/utils/slugify";

/**
 * Shared URL slug validation functions.
 * Ensures only the ONE correct URL renders a page — all others get 404.
 */

const isValidRouteParam = (param) => {
  if (typeof param !== "string") return false;

  const trimmed = param.trim();
  if (!trimmed) return false;
  if (trimmed.includes("/") || trimmed.includes("\\")) return false;
  if (trimmed.includes(".")) return false;

  return true;
};

// ─── Category page: /category-slug-{id} ────────────────────────────
export async function validateCategory(categoryParam) {
  if (!isValidRouteParam(categoryParam)) return null;

  const categoryId = categoryParam?.split("-").slice(-1)?.[0];
  if (!categoryId) return null;

  const categoryData = await getData(`categories/${categoryId}`);
  if (!categoryData?.data) return null;

  const expectedSlug = `${slugify(categoryData.data.name)}-${categoryData.data.id}`;
  if (categoryParam !== expectedSlug) return null;

  return categoryData;
}

// ─── SubCategory page: /category-slug-{id}/subcategory-slug-{id} ───
export async function validateSubCategory(categoryParam, subCategoryParam) {
  if (!isValidRouteParam(categoryParam) || !isValidRouteParam(subCategoryParam))
    return null;

  const categoryData = await validateCategory(categoryParam);
  if (!categoryData) return null;

  const subCategoryId = subCategoryParam?.split("-").slice(-1)?.[0];
  if (!subCategoryId) return null;

  const subCategoryData = await getData(`sub-categories/${subCategoryId}`);
  if (!subCategoryData?.data) return null;

  const expectedSlug = `${slugify(subCategoryData.data.name)}-${subCategoryData.data.id}`;
  if (subCategoryParam !== expectedSlug) return null;

  return { categoryData, subCategoryData };
}

// ─── Asset page: /category-slug/subcategory-slug/asset-slug-{id} ───
// Tolerant validation: accepts pure slugs (category/subcategory) and ID-suffixed slugs
export async function validateAsset(
  categoryParam,
  subCategoryParam,
  assetParam,
) {
  if (
    !isValidRouteParam(categoryParam) ||
    !isValidRouteParam(subCategoryParam) ||
    !isValidRouteParam(assetParam)
  )
    return null;

  const assetId = assetParam?.split("-").slice(-1)?.[0];
  if (!assetId || isNaN(Number(assetId))) return null;

  // Fetch asset fresh from database (no stale cache delay)
  const assetData = await getData(`assets/${assetId}`, { cache: "no-store" });
  if (!assetData?.data) return null;

  // Validate asset slug
  const expectedAssetSlug = `${slugify(assetData.data.name)}-${assetData.data.id}`;
  if (assetParam !== expectedAssetSlug) return null;

  // Retrieve subcategory and category directly from the asset relation (single DB lookup)
  let subCategory = assetData.data.sub_category;
  let category = subCategory?.category;

  // Fallback only if parent category was not returned
  if (!category && assetData.data.sub_category_id) {
    const subCategoryData = await getData(
      `sub-categories/${assetData.data.sub_category_id}`,
      { cache: "no-store" },
    );
    if (subCategoryData?.data) {
      subCategory = subCategoryData.data;
      category = subCategoryData.data.category;
    }
  }

  // Validate subcategory slug (accepts pure slug or slug with ID)
  if (subCategory) {
    const expectedSubSlug = slugify(subCategory.name);
    const expectedSubSlugWithId = `${expectedSubSlug}-${subCategory.id}`;
    if (
      subCategoryParam !== expectedSubSlug &&
      subCategoryParam !== expectedSubSlugWithId
    ) {
      return null;
    }
  }

  // Validate category slug (accepts pure slug or slug with ID)
  if (category) {
    const expectedCatSlug = slugify(category.name);
    const expectedCatSlugWithId = `${expectedCatSlug}-${category.id}`;
    if (
      categoryParam !== expectedCatSlug &&
      categoryParam !== expectedCatSlugWithId
    ) {
      return null;
    }
  }

  return assetData;
}

// ─── Not-found metadata helper ─────────────────────────────────────
export const notFoundMeta = {
  title: "Page Not Found",
  description: "This page does not exist.",
  robots: { index: false, follow: false },
};

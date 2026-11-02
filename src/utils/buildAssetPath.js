import slugify from "./slugify.js";

/**
 * Builds the canonical 3-tier asset path:
 * /[category-slug]/[subcategory-slug]/[asset-slug]-[id]
 *
 * Guarantees:
 * - Every slug falls back to slugify(name)
 * - Any slugify result that is empty falls back to 'category', 'subcategory', or 'asset'
 * - Trailing numeric ID is always anchored at the end: -${id}
 */
export function buildAssetPath(asset, options = {}) {
  if (!asset || typeof asset !== "object") return "/";

  const rawId = asset.id ?? options.id;
  const assetId =
    rawId !== undefined && rawId !== null ? String(rawId).trim() : "";
  if (!assetId) return "/";

  // 1. Category Slug
  const catSlugCandidate =
    asset.sub_category?.category?.slug ||
    asset.category_slug ||
    asset.categorySlug ||
    options.categorySlug;
  const catNameCandidate =
    asset.sub_category?.category?.name ||
    asset.category_name ||
    asset.categoryName ||
    options.categoryName ||
    "";
  const catSlug = (
    catSlugCandidate ||
    slugify(catNameCandidate) ||
    "category"
  ).trim();

  // 2. SubCategory Slug
  const subCatSlugCandidate =
    asset.sub_category?.slug ||
    asset.sub_category_slug ||
    asset.subCategorySlug ||
    options.subCategorySlug;
  const subCatNameCandidate =
    asset.sub_category?.name ||
    asset.sub_category_name ||
    asset.subCategoryName ||
    options.subCategoryName ||
    "";
  const subCatSlug = (
    subCatSlugCandidate ||
    slugify(subCatNameCandidate) ||
    "subcategory"
  ).trim();

  // 3. Asset Slug
  const assetSlugCandidate = asset.slug || options.slug;
  const assetNameCandidate = asset.name || options.name || "";
  const assetSlug = (
    assetSlugCandidate ||
    slugify(assetNameCandidate) ||
    "asset"
  ).trim();

  return `/${catSlug}/${subCatSlug}/${assetSlug}-${assetId}`;
}

export default buildAssetPath;


import getData from '@/utils/getData';
import slugify from '@/utils/slugify';

/**
 * Shared URL slug validation functions.
 * Ensures only the ONE correct URL renders a page — all others get 404.
 */

// ─── Category page: /category-slug-{id} ────────────────────────────
export async function validateCategory(categoryParam) {
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
    // First validate the category segment
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
// Note: Asset URLs use PURE slugs for category/subcategory (no IDs),
//       and slug-{id} for the asset name only.
export async function validateAsset(categoryParam, subCategoryParam, assetParam) {
    const assetId = assetParam?.split("-").slice(-1)?.[0];
    if (!assetId) return null;

    // Fetch asset
    const assetData = await getData(`assets/${assetId}`);
    if (!assetData?.data) return null;

    // Validate asset slug
    const expectedAssetSlug = `${slugify(assetData.data.name)}-${assetData.data.id}`;
    if (assetParam !== expectedAssetSlug) return null;

    // Fetch subcategory to get parent category info
    const subCategoryData = await getData(`sub-categories/${assetData.data.sub_category_id}`);
    if (!subCategoryData?.data) return null;

    // Validate subcategory slug (pure slug, no ID)
    const expectedSubCategorySlug = slugify(subCategoryData.data.name);
    if (subCategoryParam !== expectedSubCategorySlug) return null;

    // Validate category slug (pure slug, no ID)
    const expectedCategorySlug = slugify(subCategoryData.data.category?.name);
    if (categoryParam !== expectedCategorySlug) return null;

    return assetData;
}

// ─── Not-found metadata helper ─────────────────────────────────────
export const notFoundMeta = {
    title: 'Page Not Found',
    description: 'This page does not exist.',
    robots: { index: false, follow: false },
};

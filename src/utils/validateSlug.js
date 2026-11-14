import { cache } from "react";
import getData from "./getData.js";
import slugify from "./slugify.js";
import buildAssetPath from "./buildAssetPath.js";

/**
 * Shared URL slug validation functions.
 * Ensures only the ONE correct URL renders a page — all others redirect or get 404.
 * Wrapped in React cache() so generateMetadata and Page share the exact
 * same in-memory promise within a single request cycle.
 */

export const safeDecode = (val) => {
  if (typeof val !== "string") return null;
  try {
    return decodeURIComponent(val);
  } catch {
    return null; // Malformed percent-encoding -> produce 404, not 500
  }
};

const isValidRouteParam = (param) => {
  if (typeof param !== "string") return false;

  const trimmed = param.trim();
  if (!trimmed) return false;
  if (trimmed.includes("/") || trimmed.includes("\\")) return false;
  if (trimmed.includes(".")) return false;

  return true;
};

// ─── Category page: /category-slug-{id} ────────────────────────────
export const validateCategory = cache(async (categoryParam) => {
  const decoded = safeDecode(categoryParam);
  if (!decoded || !isValidRouteParam(decoded)) return null;

  const idMatch = decoded.match(/-(\d+)$/);
  if (!idMatch) return null;
  const categoryId = idMatch[1];

  const categoryData = await getData(`categories/${categoryId}`, {
    tags: ["categories", `category-${categoryId}`],
    revalidate: 300,
  });
  if (!categoryData?.data) return null;

  const catSlug = (
    categoryData.data.slug ||
    slugify(categoryData.data.name) ||
    "category"
  ).trim();
  const expectedSlug = `${catSlug}-${categoryData.data.id}`;
  if (decoded !== expectedSlug) return null;

  return categoryData;
});

// A sub-category only lives under its own category (guards /textures-4/chairs-24)
export const belongsToCategory = (subCategory, category) =>
  Number(subCategory?.category_id) === Number(category?.id);

// ─── SubCategory page: /category-slug-{id}/subcategory-slug-{id} ───
export const validateSubCategory = cache(async (categoryParam, subCategoryParam) => {
  const decodedCat = safeDecode(categoryParam);
  const decodedSub = safeDecode(subCategoryParam);
  if (!decodedCat || !decodedSub || !isValidRouteParam(decodedCat) || !isValidRouteParam(decodedSub))
    return null;

  const categoryData = await validateCategory(decodedCat);
  if (!categoryData) return null;

  const subIdMatch = decodedSub.match(/-(\d+)$/);
  if (!subIdMatch) return null;
  const subCategoryId = subIdMatch[1];

  const subCategoryData = await getData(`sub-categories/${subCategoryId}`, {
    tags: ["sub-categories", `subcategory-${subCategoryId}`],
    revalidate: 300,
  });
  if (!subCategoryData?.data) return null;
  if (!belongsToCategory(subCategoryData.data, categoryData.data)) return null;

  const subSlug = (
    subCategoryData.data.slug ||
    slugify(subCategoryData.data.name) ||
    "subcategory"
  ).trim();
  const expectedSlug = `${subSlug}-${subCategoryData.data.id}`;
  if (decodedSub !== expectedSlug) return null;

  return { categoryData, subCategoryData };
});

// ─── Asset page: /category-slug/subcategory-slug/asset-slug-{id} ───
// Self-healing: if ID exists, segment mismatches redirect to canonical path
export const validateAsset = cache(async (
  categoryParam,
  subCategoryParam,
  assetParam,
) => {
  const decodedCat = safeDecode(categoryParam);
  const decodedSub = safeDecode(subCategoryParam);
  const decodedAsset = safeDecode(assetParam);

  if (
    !decodedCat ||
    !decodedSub ||
    !decodedAsset ||
    !isValidRouteParam(decodedCat) ||
    !isValidRouteParam(decodedSub) ||
    !isValidRouteParam(decodedAsset)
  ) {
    return null; // Malformed encoding or invalid path param -> 404
  }

  // Extract ID as the last hyphen-delimited numeric digits (-(\d+)$)
  const idMatch = decodedAsset.match(/-(\d+)$/);
  if (!idMatch) return null; // No trailing numeric ID -> 404
  const assetId = idMatch[1];

  // Tagged caching with 5-minute TTL: deduplicates across metadata & page
  const assetData = await getData(`assets/${assetId}`, {
    tags: ["assets", `asset-${assetId}`],
    revalidate: 300,
  });
  if (!assetData?.data) return null; // Nonexistent or deleted asset -> 404

  const asset = assetData.data;

  // Compute canonical 3-tier URL path using the shared builder
  const canonicalPath = buildAssetPath(asset);
  const canonicalParts = canonicalPath.slice(1).split("/");
  const canonicalCat = canonicalParts[0];
  const canonicalSub = canonicalParts[1];
  const canonicalAsset = canonicalParts[2];

  // Case-sensitive segment-by-segment comparison
  const isMatch =
    decodedCat === canonicalCat &&
    decodedSub === canonicalSub &&
    decodedAsset === canonicalAsset;

  if (!isMatch) {
    return {
      redirectUrl: canonicalPath,
      data: asset,
      asset,
    };
  }

  return assetData;
});

// ─── Not-found metadata helper ─────────────────────────────────────
export const notFoundMeta = {
  title: "Page Not Found",
  description: "This page does not exist.",
  robots: { index: false, follow: false },
};

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import slugify from "@/utils/slugify";
import { getOptimizedImageUrl } from "@/utils/cloudinary";

export default function NewAssets({ categories = [] }) {
  const getOriginalImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
    return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE || ""}${imagePath}`;
  };

  // Flatten live backend assets across categories
  // Skip any asset with a missing category or subcategory name. No fallbacks.
  const allBackendAssets = React.useMemo(() => {
    return (
      categories?.flatMap((category) => {
        if (!category?.name) return [];
        return (
          category?.sub_categories?.flatMap((subCategory) => {
            if (!subCategory?.name) return [];
            return (subCategory?.assets || [])
              .filter((asset) => asset && asset.id && asset.name)
              .map((asset) => ({
                ...asset,
                categoryName: category.name,
                subCategoryName: subCategory.name,
              }));
          }) || []
        );
      }) || []
    );
  }, [categories]);

  // Total count of all assets across categories for the browse count
  const totalAssetsCount = React.useMemo(() => {
    return (
      categories?.reduce(
        (acc, cat) =>
          acc +
          (cat?.sub_categories?.reduce(
            (subAcc, sub) => subAcc + (sub?.assets?.length || 0),
            0,
          ) || 0),
        0,
      ) || allBackendAssets.length
    );
  }, [categories, allBackendAssets]);

  // Sort newest first and display 18 assets (clean 6-col showcase: 18 divides evenly by 2, 3, and 6)
  const displayAssets = React.useMemo(() => {
    return [...allBackendAssets]
      .sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0))
      .slice(0, 18);
  }, [allBackendAssets]);

  if (displayAssets.length === 0) {
    return null;
  }

  return (
    <section
      id="assets"
      className="py-14 sm:py-20 w-full px-4 md:px-[0.5in] bg-transparent"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight-h2 text-fg font-sans">
            Latest assets
          </h2>
        </div>

        {/* Browse Catalog Link */}
        <Link
          href="/sketchup-3d-models-3"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono text-action hover:text-action-hover transition-colors group self-start sm:self-auto"
        >
          <span>Browse all {totalAssetsCount.toLocaleString()} assets</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
      </div>

      {/* 6-Column Architectural Showcase Grid with generous spacing between items and lines */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-x-5 sm:gap-x-7 lg:gap-x-8 gap-y-10 sm:gap-y-12 lg:gap-y-16 w-full">
        {displayAssets.map((asset) => (
          <Link
            key={asset.id}
            href={`/${slugify(asset.categoryName)}/${slugify(
              asset.subCategoryName,
            )}/${slugify(asset.name)}-${asset.id}`}
            className="group flex flex-col p-2 rounded-xl bg-transparent transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
            aria-label={asset.name}
          >
            {/* Completely transparent 1:1 frame letting background grid and color show through */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-transparent border border-transparent flex items-center justify-center">
              {asset.cover ? (
                <Image
                  src={getOptimizedImageUrl(getOriginalImageUrl(asset.cover))}
                  alt={asset.cover_alt?.trim() || asset.name}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33.3vw, 16.6vw"
                  className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-108 drop-shadow-[0_6px_16px_rgba(0,0,0,0.6)]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-fg-secondary/40 font-mono text-[10px]">
                  .SKP
                </div>
              )}

              {/* Free / PRO Access Badge */}
              <div className="absolute top-2 right-2 z-10">
                {asset.access_type === "paid" ? (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#E8C96A] text-canvas shadow-sm">
                    PRO
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono text-fg-secondary bg-surface/80 border border-line backdrop-blur-xs">
                    FREE
                  </span>
                )}
              </div>
            </div>

            {/* Model Metadata Below Thumbnail */}
            <div className="mt-3.5 px-0.5 flex flex-col min-w-0">
              <span className="text-[10px] font-mono text-fg-secondary truncate uppercase tracking-wider">
                {asset.subCategoryName || asset.categoryName}
              </span>
              <h3
                className="text-xs sm:text-sm font-medium text-fg truncate group-hover:text-action transition-colors font-sans mt-0.5"
                title={asset.name}
              >
                {asset.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

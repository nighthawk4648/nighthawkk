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

  // Split into two balanced sets for mobile dual-direction marquee
  const { row1Assets, row2Assets } = React.useMemo(() => {
    const half = Math.ceil(displayAssets.length / 2);
    return {
      row1Assets: displayAssets.slice(0, half),
      row2Assets: displayAssets.slice(half),
    };
  }, [displayAssets]);

  // Ensure each marquee row repeats enough items to span wider than mobile screen before looping
  const repeatToMinimum = (arr, min = 5) => {
    if (!arr || arr.length === 0) return [];
    let res = arr;
    while (res.length < min) {
      res = [...res, ...arr];
    }
    return [...res, ...res];
  };

  const marqueeRow1 = React.useMemo(() => repeatToMinimum(row1Assets), [row1Assets]);
  const marqueeRow2 = React.useMemo(
    () => repeatToMinimum(row2Assets.length > 0 ? row2Assets : row1Assets),
    [row2Assets, row1Assets],
  );

  if (displayAssets.length === 0) {
    return null;
  }

  // Compact Marquee Card for mobile counter-scrolling rows
  const renderMarqueeCard = (asset, key) => (
    <Link
      key={key}
      href={`/${slugify(asset.categoryName)}/${slugify(
        asset.subCategoryName,
      )}/${slugify(asset.name)}-${asset.id}`}
      className="w-[142px] flex-shrink-0 flex flex-col p-2 rounded-xl bg-surface/50 border border-line hover:border-action/40 transition-all select-none group shadow-sm"
      aria-label={asset.name}
    >
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-canvas/60 border border-line/40 flex items-center justify-center">
        {asset.cover ? (
          <Image
            src={getOptimizedImageUrl(getOriginalImageUrl(asset.cover))}
            alt={asset.cover_alt?.trim() || asset.name}
            fill
            loading="lazy"
            sizes="142px"
            className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-105 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-fg-secondary/40 font-mono text-[10px]">
            .SKP
          </div>
        )}

        {/* Free / PRO Access Badge */}
        <div className="absolute top-1.5 right-1.5 z-10">
          {asset.access_type === "paid" ? (
            <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-[#E8C96A] text-canvas shadow-xs">
              PRO
            </span>
          ) : (
            <span className="px-1.5 py-0.2 rounded text-[8px] font-mono text-fg-secondary bg-surface/80 border border-line backdrop-blur-xs">
              FREE
            </span>
          )}
        </div>
      </div>

      <div className="mt-2 px-0.5 flex flex-col min-w-0">
        <span className="text-[9px] font-mono text-fg-secondary truncate uppercase tracking-wider">
          {asset.subCategoryName || asset.categoryName}
        </span>
        <h3
          className="text-xs font-medium text-fg truncate group-hover:text-action transition-colors font-sans mt-0.5"
          title={asset.name}
        >
          {asset.name}
        </h3>
      </div>
    </Link>
  );

  return (
    <section
      id="assets"
      className="py-8 sm:py-20 w-full px-4 md:px-[0.5in] bg-transparent overflow-hidden"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-3xl font-semibold tracking-tight text-fg font-sans">
            Latest assets
          </h2>
        </div>

        {/* Browse Catalog Link (Desktop / Tablet) */}
        <Link
          href="/sketchup-3d-models-3"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono text-action hover:text-action-hover transition-colors group"
        >
          <span>Browse all {totalAssetsCount.toLocaleString()} assets</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
      </div>

      {/* Mobile-Only Dual-Row Counter-Scrolling Marquee */}
      <div className="sm:hidden relative w-full overflow-hidden -mx-4 py-1">
        {/* Soft edge gradient fades */}
        <div className="absolute left-0 inset-y-0 w-8 bg-gradient-to-r from-canvas via-canvas/70 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-8 bg-gradient-to-l from-canvas via-canvas/70 to-transparent z-10 pointer-events-none" />

        {/* Row 1: Leftward continuous glide */}
        <div className="flex w-max animate-marquee-left pause-hover gap-2.5 mb-2.5 pl-4">
          {marqueeRow1.map((asset, idx) =>
            renderMarqueeCard(asset, `row1-${asset.id}-${idx}`),
          )}
        </div>

        {/* Row 2: Rightward continuous glide */}
        <div className="flex w-max animate-marquee-right pause-hover gap-2.5 pl-4">
          {marqueeRow2.map((asset, idx) =>
            renderMarqueeCard(asset, `row2-${asset.id}-${idx}`),
          )}
        </div>

        {/* Mobile Bottom Browse CTA */}
        <div className="mt-5 px-4 flex justify-center">
          <Link
            href="/sketchup-3d-models-3"
            className="w-full max-w-xs inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold bg-action/10 hover:bg-action text-action hover:text-canvas border border-action/30 transition-all font-mono"
          >
            <span>Browse all {totalAssetsCount.toLocaleString()} assets</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* 6-Column Architectural Showcase Grid (Desktop and Tablet) */}
      <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-x-5 sm:gap-x-7 lg:gap-x-8 gap-y-10 sm:gap-y-12 lg:gap-y-16 w-full">
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

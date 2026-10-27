"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import slugify from "@/utils/slugify";
import { getOptimizedImageUrl } from "@/utils/cloudinary";

export default function Features({ categories = [] }) {
  const getOriginalImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
  };

  // Sort categories by id to match original production order
  const sortedCategories = React.useMemo(() => {
    if (!categories || categories.length === 0) return [];
    return [...categories].sort((a, b) => a.id - b.id);
  }, [categories]);

  if (sortedCategories.length === 0) {
    return null;
  }

  return (
    <section
      id="categories"
      className="py-6 sm:py-16 px-4 md:px-[0.5in] w-full text-fg"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4 sm:mb-8">
        <h2 className="text-lg sm:text-2xl lg:text-3xl font-semibold tracking-tight text-fg font-sans">
          Categories
        </h2>
        {/* Mobile Swipe Hint */}
        <div className="flex items-center gap-1 text-[11px] font-mono text-fg-secondary lg:hidden">
          <span>Swipe</span>
          <svg
            className="w-3 h-3 text-action animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>
      </div>

      {/* Categories Layout: Compact Mobile Horizontal Snap Carousel -> Desktop 3-Pillar Grid */}
      <div className="flex lg:grid lg:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8 items-stretch w-full overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-4 px-4 sm:mx-0 sm:px-0 pb-2">
        {sortedCategories.slice(0, 3).map((category) => {
          const imageUrl = category.image
            ? getOptimizedImageUrl(getOriginalImageUrl(category.image))
            : "/assets/homepage/secondSection/features.png";

          return (
            <Link
              key={category.id}
              href={`/${slugify(category.name)}-${category.id}`}
              className="w-[170px] xs:w-[180px] sm:w-auto sm:flex-1 flex-shrink-0 snap-start flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-2 sm:gap-5 lg:gap-6 p-3 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl lg:rounded-[22px] bg-surface/75 border border-line hover:border-action/50 transition-all duration-300 shadow-sm group cursor-pointer"
            >
              {/* Spherical Preview Orb (Scaled to 56px on mobile) */}
              <div className="relative w-14 h-14 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden flex-shrink-0 border border-line-strong shadow-inner bg-canvas group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={imageUrl}
                  alt={category.name || "Category preview"}
                  fill
                  sizes="(max-width: 640px) 56px, (max-width: 1024px) 96px, 128px"
                  className="object-cover"
                />
                <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)] pointer-events-none" />
              </div>

              {/* Content Container */}
              <div className="min-w-0 flex-1 flex flex-col justify-between self-stretch py-0 sm:py-1">
                <div>
                  <h3 className="text-sm sm:text-lg lg:text-xl font-semibold sm:font-bold text-fg font-sans group-hover:text-action transition-colors truncate">
                    {category.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-fg-secondary mt-0.5 sm:mt-1.5 leading-snug line-clamp-1 sm:line-clamp-2">
                    {category.short_description ||
                      "Browse curated models and materials for SketchUp."}
                  </p>
                </div>

                {/* Mobile Inline Link Text */}
                <div className="mt-2 sm:hidden flex items-center justify-center gap-1 text-[11px] font-mono font-medium text-action group-hover:translate-x-0.5 transition-transform">
                  <span>Browse</span>
                  <span aria-hidden="true">&rarr;</span>
                </div>

                {/* Desktop Action Button */}
                <div className="hidden sm:block mt-4 pt-1">
                  <span className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all bg-action hover:bg-action-hover active:bg-action-pressed text-canvas group-hover:scale-105">
                    <span>Browse {category.name}</span>
                    <span className="ml-1.5" aria-hidden="true">
                      &rarr;
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}


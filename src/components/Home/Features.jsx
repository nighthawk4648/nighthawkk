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
      className="py-12 sm:py-16 px-4 md:px-[0.5in] w-full text-fg"
    >
      {/* Header Row */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight-h2 text-fg font-sans">
          Categories
        </h2>
      </div>

      {/* 3-Column Row: Clean responsive grid using real database content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch w-full">
        {sortedCategories.slice(0, 3).map((category, index) => {
          const imageUrl = category.image
            ? getOptimizedImageUrl(getOriginalImageUrl(category.image))
            : "/assets/homepage/secondSection/features.png";

          const buttonStyle =
            "bg-action hover:bg-action-hover active:bg-action-pressed text-canvas";

          return (
            <div
              key={category.id}
              className="h-full flex items-center gap-4 sm:gap-5 lg:gap-6 p-5 sm:p-6 rounded-[22px] bg-surface/75 border border-line hover:border-line-strong transition-all duration-300 shadow-md group"
            >
              {/* Left: Spherical Preview Orb using real database image */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden flex-shrink-0 border border-line-strong shadow-inner bg-canvas group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={imageUrl}
                  alt={category.name || "Category preview"}
                  fill
                  sizes="(max-width: 1024px) 112px, 128px"
                  className="object-cover"
                />
                <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)] pointer-events-none" />
              </div>

              {/* Right: Content Flex Container with real database fields */}
              <div className="min-w-0 flex-1 flex flex-col justify-between self-stretch py-1">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-fg font-sans group-hover:text-action transition-colors truncate">
                    {category.name}
                  </h3>
                  <p className="text-xs text-fg-secondary mt-1.5 leading-relaxed line-clamp-2">
                    {category.short_description ||
                      "Browse curated models and materials for SketchUp."}
                  </p>
                </div>

                {/* Real Route Action Button */}
                <div className="mt-4 pt-1">
                  <Link
                    href={`/${slugify(category.name)}-${category.id}`}
                    className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all hover:scale-105 ${buttonStyle}`}
                  >
                    <span>Browse {category.name}</span>
                    <span className="ml-1.5" aria-hidden="true">
                      &rarr;
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}


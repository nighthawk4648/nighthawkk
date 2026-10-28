"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/utils/swrFetcher";
import { getOptimizedImageUrl } from "@/utils/cloudinary";
import slugify from "@/utils/slugify";
import {
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiChevronRight,
  FiChevronLeft,
  FiPackage,
  FiFilter,
  FiX,
  FiBox,
} from "react-icons/fi";
import { sanitizeHtml } from "@/utils/sanitizeHtml";
import InFeedAd from "@/components/Shared/GoogleAdsense/InFeedAd";
import ResponsiveBannerAd from "@/components/Shared/GoogleAdsense/ResponsiveBannerAd";
import CatalogGridAd from "@/components/Shared/GoogleAdsense/CatalogGridAd";
import { formatAssetSize } from "@/utils/formatAssetSize";

export default function CatalogLayout({
  activeCategoryId = null,
  activeSubCategoryId = null,
  initialCategoryData = null,
  initialSubCategoryData = null,
  serverAssets = null,
  page = 1,
  totalPages: serverTotalPages = null,
  totalCount: serverTotalCount = null,
  activeFilters = { search: "", access: "all", sort: "newest" },
  basePath = "",
}) {
  const router = useRouter();
  const searchInputRef = useRef(null);
  const catalogTopRef = useRef(null);

  // Pagination Configuration (21 models + 3 in-grid ads = 24 total cards)
  const ITEMS_PER_PAGE = 21;

  const isServerDriven = serverAssets !== null;

  // States
  const [searchInputValue, setSearchInputValue] = useState(
    activeFilters.search || "",
  );
  const [expandedCategories, setExpandedCategories] = useState({});
  const [mounted, setMounted] = useState(false);
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);
  const [isLongDescription, setIsLongDescription] = useState(false);
  const descriptionRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsOverviewExpanded(false);
  }, [activeCategoryId, activeSubCategoryId]);

  useEffect(() => {
    setSearchInputValue(activeFilters.search || "");
  }, [activeFilters.search]);

  // Keyboard shortcut: Press / to focus catalog search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch all categories for sidebar tree
  const { data: allCategoriesData } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/categories`,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  const categories = useMemo(() => {
    const list =
      allCategoriesData?.data ||
      (initialCategoryData?.data ? [initialCategoryData.data] : []);
    return [...list].sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));
  }, [allCategoriesData, initialCategoryData]);

  // Total count of all assets across all categories and subcategories
  const totalCatalogAssetsCount = useMemo(() => {
    return categories.reduce(
      (total, cat) =>
        total +
        (cat.sub_categories?.reduce(
          (sum, s) => sum + (s.assets?.length || 0),
          0,
        ) || 0),
      0,
    );
  }, [categories]);

  // Automatically expand active category
  useEffect(() => {
    if (activeCategoryId) {
      setExpandedCategories((prev) => ({
        ...prev,
        [Number(activeCategoryId)]: true,
      }));
    }
  }, [activeCategoryId]);

  const toggleCategoryExpand = (catId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const getOriginalImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
      return imagePath;
    return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE || ""}${imagePath}`;
  };

  // Aggregate assets based on page scope (fallback when serverAssets is null)
  const rawAssets = useMemo(() => {
    if (isServerDriven) return [];

    if (activeSubCategoryId && initialSubCategoryData?.data?.assets) {
      const catName = initialCategoryData?.data?.name || "Sketchup 3D models";
      const subName = initialSubCategoryData?.data?.name || "Models";
      return (initialSubCategoryData.data.assets || []).map((a) => ({
        ...a,
        category_name: catName,
        sub_category_name: subName,
      }));
    }

    if (activeCategoryId && initialCategoryData?.data?.sub_categories) {
      const catName = initialCategoryData.data.name;
      return (initialCategoryData.data.sub_categories || []).flatMap((sub) =>
        (sub?.assets || []).map((a) => ({
          ...a,
          category_name: catName,
          sub_category_name: sub.name,
        })),
      );
    }

    // Otherwise, flatten all categories
    return (categories || []).flatMap((cat) =>
      (cat?.sub_categories || []).flatMap((sub) =>
        (sub?.assets || []).map((a) => ({
          ...a,
          category_name: cat.name,
          sub_category_name: sub.name,
        })),
      ),
    );
  }, [
    isServerDriven,
    activeCategoryId,
    activeSubCategoryId,
    initialCategoryData,
    initialSubCategoryData,
    categories,
  ]);

  // Display derivations: models to render, active page, total pages, and total count
  const displayAssets = isServerDriven
    ? serverAssets || []
    : rawAssets.slice(0, ITEMS_PER_PAGE);
  const displayPage = page || 1;
  const displayTotalPages = isServerDriven
    ? (serverTotalPages ?? 0)
    : Math.max(0, Math.ceil(rawAssets.length / ITEMS_PER_PAGE));
  const displayTotalCount = isServerDriven
    ? (serverTotalCount ?? displayAssets.length)
    : rawAssets.length;

  const hasActiveFilters = Boolean(
    (activeFilters.search && activeFilters.search.trim()) ||
    (activeFilters.access && activeFilters.access !== "all") ||
    (activeFilters.sort && activeFilters.sort !== "newest"),
  );

  // Current active labels for breadcrumbs
  const currentCategory = useMemo(() => {
    return (
      categories.find((c) => Number(c.id) === Number(activeCategoryId)) ||
      initialCategoryData?.data
    );
  }, [categories, activeCategoryId, initialCategoryData]);

  const currentSubCategory = useMemo(() => {
    if (!currentCategory?.sub_categories) return initialSubCategoryData?.data;
    return (
      currentCategory.sub_categories.find(
        (s) => Number(s.id) === Number(activeSubCategoryId),
      ) || initialSubCategoryData?.data
    );
  }, [currentCategory, activeSubCategoryId, initialSubCategoryData]);

  // Active admin panel description (Category or SubCategory short_description)
  const activeDescription = useMemo(() => {
    if (activeSubCategoryId && currentSubCategory?.short_description) {
      return currentSubCategory.short_description;
    }
    if (activeCategoryId && currentCategory?.short_description) {
      return currentCategory.short_description;
    }
    return null;
  }, [
    activeSubCategoryId,
    currentSubCategory,
    activeCategoryId,
    currentCategory,
  ]);

  // Measure description element height to conditionally enable mobile see more toggle
  useEffect(() => {
    if (descriptionRef.current) {
      setIsLongDescription(descriptionRef.current.scrollHeight > 160);
    }
  }, [activeDescription]);

  // Build full query string for pagination links and filter navigations
  const buildUrl = (targetPage, filterOverrides = {}) => {
    const currentSearch =
      filterOverrides.search !== undefined
        ? filterOverrides.search
        : activeFilters.search || "";

    const currentAccess =
      filterOverrides.access !== undefined
        ? filterOverrides.access
        : activeFilters.access || "all";

    const currentSort =
      filterOverrides.sort !== undefined
        ? filterOverrides.sort
        : activeFilters.sort || "newest";

    const queryParams = new URLSearchParams();

    if (currentSearch && currentSearch.trim()) {
      queryParams.set("search", currentSearch.trim());
    }
    if (currentAccess && currentAccess !== "all") {
      queryParams.set("access", currentAccess);
    }
    if (currentSort && currentSort !== "newest") {
      queryParams.set("sort", currentSort);
    }

    // Page 1 links to bare URL (omit ?page=1)
    if (targetPage && targetPage > 1) {
      queryParams.set("page", String(targetPage));
    }

    const qs = queryParams.toString();
    const base =
      basePath ||
      (typeof window !== "undefined" ? window.location.pathname : "");

    return qs ? `${base}?${qs}` : base || "/";
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault?.();
    const trimmed = searchInputValue.trim();
    router.push(buildUrl(1, { search: trimmed }));
  };

  const handleClearSearch = () => {
    setSearchInputValue("");
    router.push(buildUrl(1, { search: "" }));
  };

  const handleAccessChange = (e) => {
    router.push(buildUrl(1, { access: e.target.value }));
  };

  const handleSortChange = (e) => {
    router.push(buildUrl(1, { sort: e.target.value }));
  };

  const handleResetFilters = () => {
    const base =
      basePath ||
      (typeof window !== "undefined" ? window.location.pathname : "/");
    router.push(base);
  };

  // Pre-calculated non-colliding ad placement patterns:
  // Each pattern places ads far apart across 3 distinct zones (Box 1: assets 2-5, Box 2: assets 9-13, Box 3: assets 16-20).
  // Guaranteed mathematically that no two consecutive ads ever land in the same column
  // across 2-col (mobile), 3-col (tablet), 4-col (desktop), or 5-col (wide) layouts.
  const AD_PLACEMENT_PATTERNS = useMemo(
    () => [
      [2, 12, 18], // Pattern 1: Spaced 10 and 6 assets apart (Desktop cols: 3, 2, 1)
      [4, 10, 16], // Pattern 2: Spaced 6 and 6 assets apart (Desktop cols: 1, 0, 3)
      [5, 11, 17], // Pattern 3: Spaced 6 and 6 assets apart (Desktop cols: 2, 1, 0)
      [3, 9, 19], // Pattern 4: Spaced 6 and 10 assets apart (Desktop cols: 0, 3, 2)
      [4, 10, 18], // Pattern 5: Spaced 6 and 8 assets apart (Desktop cols: 1, 0, 3)
      [3, 13, 19], // Pattern 6: Spaced 10 and 6 assets apart (Desktop cols: 0, 3, 2)
    ],
    [],
  );

  // Organic, non-overlapping staggered in-grid ad positions shuffled per page
  const adIndices = useMemo(() => {
    const count = displayAssets.length;
    if (count < 6) return new Set();

    // Select deterministic pattern for current page (shuffles across pages 1, 2, 3...)
    const pageNum = Number(displayPage) || 1;
    const patternIndex = Math.abs(pageNum - 1) % AD_PLACEMENT_PATTERNS.length;
    const pattern = AD_PLACEMENT_PATTERNS[patternIndex];

    const indices = [];
    for (let i = 0; i < pattern.length; i++) {
      const targetIndex = pattern[i];
      // Only include if there are enough assets and it won't be placed after the very last asset
      if (targetIndex < count - 1) {
        indices.push(targetIndex);
      }
    }

    return new Set(indices);
  }, [displayPage, displayAssets.length, AD_PLACEMENT_PATTERNS]);

  const renderPaginationPills = () => {
    if (displayTotalPages <= 1) return null;

    const pills = [];
    const maxVisible = 7;

    if (displayTotalPages <= maxVisible) {
      for (let i = 1; i <= displayTotalPages; i++) {
        pills.push(i);
      }
    } else {
      if (displayPage <= 4) {
        pills.push(1, 2, 3, 4, 5, "...", displayTotalPages);
      } else if (displayPage >= displayTotalPages - 3) {
        pills.push(
          1,
          "...",
          displayTotalPages - 4,
          displayTotalPages - 3,
          displayTotalPages - 2,
          displayTotalPages - 1,
          displayTotalPages,
        );
      } else {
        pills.push(
          1,
          "...",
          displayPage - 1,
          displayPage,
          displayPage + 1,
          "...",
          displayTotalPages,
        );
      }
    }

    return pills.map((pill, idx) => {
      if (pill === "...") {
        return (
          <span
            key={`ellipsis-${idx}`}
            className="px-2 py-1 text-xs font-mono text-fg-secondary/50 select-none"
          >
            ...
          </span>
        );
      }

      const isCurrent = pill === displayPage;
      return (
        <a
          key={pill}
          href={buildUrl(pill)}
          className={`min-w-[34px] h-8 px-2.5 rounded-lg text-xs font-mono font-medium transition-all inline-flex items-center justify-center cursor-pointer ${
            isCurrent
              ? "bg-action text-black font-bold shadow-md shadow-action/25 border border-action"
              : "bg-canvas/60 text-fg-secondary hover:text-fg hover:bg-white/10 border border-white/10"
          }`}
          aria-label={`Page ${pill}`}
          aria-current={isCurrent ? "page" : undefined}
        >
          {pill}
        </a>
      );
    });
  };

  // Category Tree Accordion (Shared by desktop sidebar and mobile bottom sheet)
  const renderCategoryTree = (onItemClick = null) => (
    <div className="space-y-1">
      {/* All Assets Row */}
      <Link
        href="/sketchup-3d-models-3"
        onClick={() => onItemClick?.()}
        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
          !activeCategoryId && !activeSubCategoryId
            ? "bg-white/10 text-fg font-semibold shadow-inner"
            : "text-fg-secondary hover:text-fg hover:bg-white/[0.04]"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-md bg-action-tintBg border border-action-tintLine flex items-center justify-center text-xs font-mono text-action shrink-0 shadow-sm">
            ★
          </div>
          <span className="truncate font-sans font-medium">All Assets</span>
        </div>
        <span className="text-xs font-mono text-fg-secondary shrink-0 ml-1">
          {totalCatalogAssetsCount}
        </span>
      </Link>

      {/* Dynamic Categories */}
      {categories.map((cat) => {
        const isCatActive = Number(cat.id) === Number(activeCategoryId);
        const isExpanded = !!expandedCategories[cat.id];
        const subCount = cat.sub_categories?.length || 0;
        const assetCount =
          cat.sub_categories?.reduce(
            (sum, s) => sum + (s.assets?.length || 0),
            0,
          ) || 0;

        return (
          <div key={cat.id} className="space-y-0.5">
            <div
              className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-sm transition-all group ${
                isCatActive && !activeSubCategoryId
                  ? "bg-white/10 text-fg font-semibold shadow-inner"
                  : "text-fg-secondary hover:text-fg hover:bg-white/[0.04]"
              }`}
            >
              <Link
                href={`/${slugify(cat.name)}-${cat.id}`}
                onClick={() => onItemClick?.()}
                className="flex items-center gap-2.5 min-w-0 flex-1"
              >
                <div className="w-7 h-7 rounded-md overflow-hidden bg-canvas/60 border border-white/10 shrink-0 relative flex items-center justify-center shadow-sm">
                  {cat.image ? (
                    <Image
                      src={getOptimizedImageUrl(getOriginalImageUrl(cat.image))}
                      alt={cat.name}
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-[10px] font-mono text-fg-secondary/60">
                      3D
                    </span>
                  )}
                </div>
                <span className="truncate font-sans font-medium">
                  {cat.name}
                </span>
              </Link>

              <div className="flex items-center gap-1.5 shrink-0 ml-1">
                <span className="text-xs font-mono text-fg-secondary">
                  {assetCount}
                </span>
                {subCount > 0 && (
                  <button
                    type="button"
                    onClick={(e) => toggleCategoryExpand(cat.id, e)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer text-fg-secondary"
                    aria-label="Toggle subcategories"
                  >
                    {isExpanded ? (
                      <FiChevronDown className="w-4 h-4" />
                    ) : (
                      <FiChevronRight className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Subcategories Accordion Indent */}
            {isExpanded && subCount > 0 && (
              <div className="ml-8 pl-3 border-l border-white/10 space-y-1 pt-1 pb-1.5">
                {cat.sub_categories.map((sub) => {
                  const isSubActive =
                    Number(sub.id) === Number(activeSubCategoryId);
                  const subAssetCount = sub.assets?.length || 0;

                  return (
                    <Link
                      key={sub.id}
                      href={`/${slugify(cat.name)}-${cat.id}/${slugify(sub.name)}-${sub.id}`}
                      onClick={() => onItemClick?.()}
                      className={`flex items-center justify-between py-1.5 px-2.5 rounded-md text-xs transition-all ${
                        isSubActive
                          ? "bg-action-tintBg text-action font-semibold shadow-sm"
                          : "text-fg-secondary hover:text-fg hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-5 h-5 rounded overflow-hidden bg-canvas/60 border border-white/10 shrink-0 relative flex items-center justify-center shadow-sm">
                          {sub.image ? (
                            <Image
                              src={getOptimizedImageUrl(
                                getOriginalImageUrl(sub.image),
                              )}
                              alt={sub.name}
                              fill
                              sizes="20px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-[8px] font-mono text-fg-secondary/50">
                              3D
                            </span>
                          )}
                        </div>
                        <span className="truncate font-sans">{sub.name}</span>
                      </div>
                      <span className="text-[10px] font-mono ml-1 text-fg-secondary/80 shrink-0">
                        {subAssetCount}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  // Desktop Sidebar Content
  const sidebarContent = (
    <div className="space-y-4">
      {/* Category Tree Box */}
      <div className="rounded-xl p-3 border border-white/[0.08] bg-surface/40 backdrop-blur-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
          <span className="text-xs font-mono tracking-wider uppercase text-fg-secondary font-semibold">
            Categories
          </span>
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-[11px] font-mono text-action hover:underline cursor-pointer"
          >
            Reset
          </button>
        </div>

        {renderCategoryTree()}
      </div>

      {/* Sidebar In-Feed AdSense */}
      <InFeedAd className="mt-4" />
    </div>
  );

  return (
    <div className="w-full min-h-screen text-fg font-sans pt-8 sm:pt-10 pb-16 relative bg-transparent">
      {/* Centered Master Container (fluid gutters matching navbar) */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-[0.5in] relative z-10">
        {/* 2-Column Asymmetric Split: Sticky Sidebar (Left) + Main Catalog (Right) */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* LEFT COLUMN: Sticky Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-64 xl:w-72 lg:sticky lg:top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-1 shrink-0">
            {sidebarContent}
          </aside>

          {/* RIGHT COLUMN: Main Catalog Area */}
          <main ref={catalogTopRef} className="flex-1 min-w-0 space-y-4 w-full">
            {/* Header Row: Title + Responsive Leaderboard Banner (Option A) */}
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 sm:gap-4 pb-1">
              <div className="shrink-0">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-fg font-sans">
                  {currentSubCategory
                    ? `${currentSubCategory.name} 3D Models`
                    : currentCategory
                      ? `${currentCategory.name} 3D Models`
                      : "Sketchshaper 3D Models"}
                </h1>
              </div>

              {/* Header Horizontal Banner Ad */}
              <div className="w-full xl:max-w-[760px] 2xl:max-w-[980px]">
                <ResponsiveBannerAd />
              </div>
            </div>

            {/* MOBILE DEDICATED CONTROL SUITE (< lg) */}
            <div className="lg:hidden space-y-3 w-full">
              {/* 1. Mobile Minimalist Clean Search Bar (44px, zero iOS auto-zoom) */}
              <form
                onSubmit={handleSearchSubmit}
                className="relative w-full h-11"
              >
                <button
                  type="submit"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-secondary/70 hover:text-action transition-colors cursor-pointer p-0.5"
                  aria-label="Submit search"
                >
                  <FiSearch className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  placeholder={
                    currentSubCategory
                      ? `Search in ${currentSubCategory.name}...`
                      : currentCategory
                        ? `Search in ${currentCategory.name}...`
                        : "Search 3D models..."
                  }
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                  className="w-full h-full bg-surface/40 backdrop-blur-md border border-white/10 hover:border-white/20 focus:border-action/60 focus:ring-1 focus:ring-action/25 rounded-xl pl-10 pr-9 text-base sm:text-xs text-fg placeholder:text-fg-secondary/50 font-sans focus:outline-none transition-all shadow-inner"
                />
                {searchInputValue && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-fg-secondary hover:text-fg hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* 2. Stacked Category Bricks (Masonry flow, all visible at a glance) */}
              <div className="flex flex-wrap gap-2 pt-0.5">
                {/* "All Models" Brick */}
                <Link
                  href="/sketchup-3d-models-3"
                  className={`min-h-[36px] py-2 px-3 rounded-xl text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
                    !activeCategoryId && !activeSubCategoryId
                      ? "bg-action text-black font-semibold shadow-md shadow-action/25 border border-action"
                      : "bg-surface/50 border border-white/10 text-fg-secondary hover:text-fg hover:bg-surface-raised"
                  }`}
                >
                  <span className="text-action shrink-0 font-bold">★</span>
                  <span className="font-sans font-medium">All Models</span>
                  <span className="text-[10px] opacity-75">
                    ({totalCatalogAssetsCount})
                  </span>
                </Link>

                {/* Dynamic Category Bricks */}
                {categories.map((cat) => {
                  const isCatActive =
                    Number(cat.id) === Number(activeCategoryId);
                  const count =
                    cat.sub_categories?.reduce(
                      (sum, s) => sum + (s.assets?.length || 0),
                      0,
                    ) || 0;

                  return (
                    <Link
                      key={cat.id}
                      href={`/${slugify(cat.name)}-${cat.id}`}
                      className={`min-h-[36px] py-2 px-3 rounded-xl text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
                        isCatActive
                          ? "bg-action text-black font-semibold shadow-md shadow-action/25 border border-action"
                          : "bg-surface/50 border border-white/10 text-fg-secondary hover:text-fg hover:bg-surface-raised"
                      }`}
                    >
                      {cat.image ? (
                        <div className="w-4 h-4 rounded-full overflow-hidden relative shrink-0 border border-white/10">
                          <Image
                            src={getOptimizedImageUrl(
                              getOriginalImageUrl(cat.image),
                            )}
                            alt={cat.name}
                            fill
                            sizes="16px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-white/10 text-[9px] flex items-center justify-center font-mono">
                          3D
                        </span>
                      )}
                      <span className="font-sans font-medium">{cat.name}</span>
                      <span className="text-[10px] opacity-75">({count})</span>
                    </Link>
                  );
                })}
              </div>

              {/* 3. Stacked Subcategory Bricks (when active category has subcategories) */}
              {currentCategory?.sub_categories?.length > 0 && (
                <div className="p-3 rounded-2xl bg-surface/30 border border-white/[0.08] space-y-2 mt-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-fg-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-action" />
                    <span className="uppercase tracking-wider font-semibold text-fg">
                      {currentCategory.name} Subcategories:
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {/* "All" in current category */}
                    <Link
                      href={`/${slugify(currentCategory.name)}-${currentCategory.id}`}
                      className={`min-h-[32px] py-1.5 px-3 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                        !activeSubCategoryId
                          ? "bg-action text-black font-semibold shadow-xs border border-action"
                          : "bg-surface/50 border border-white/10 text-fg-secondary hover:text-fg"
                      }`}
                    >
                      <span>All {currentCategory.name}</span>
                    </Link>

                    {currentCategory.sub_categories.map((sub) => {
                      const isSubActive =
                        Number(sub.id) === Number(activeSubCategoryId);
                      const subCount = sub.assets?.length || 0;

                      return (
                        <Link
                          key={sub.id}
                          href={`/${slugify(currentCategory.name)}-${currentCategory.id}/${slugify(sub.name)}-${sub.id}`}
                          className={`min-h-[32px] py-1.5 px-2.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                            isSubActive
                              ? "bg-action text-black font-semibold shadow-xs border border-action"
                              : "bg-surface/50 border border-white/10 text-fg-secondary hover:text-fg"
                          }`}
                        >
                          <span className="font-sans">{sub.name}</span>
                          <span className="text-[10px] opacity-75">
                            ({subCount})
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Mobile In-Feed AdSense Card (Full mobile width >= 250px) */}
              <div className="pt-1">
                <InFeedAd />
              </div>

              {/* 5. Mobile Access & Sort Controls (Clean 50/50 Split - Zero Overflow) */}
              <div className="grid grid-cols-2 gap-2.5 pt-1 w-full">
                {/* Access Dropdown Pill */}
                <div className="relative flex items-center justify-between h-10 px-3 rounded-xl bg-surface/40 backdrop-blur-md border border-white/10 hover:border-white/20 focus-within:border-action/60 transition-all shadow-xs group">
                  <span className="text-[11px] font-mono text-fg-secondary font-semibold uppercase tracking-wider shrink-0">
                    Access:
                  </span>
                  <select
                    value={activeFilters.access || "all"}
                    onChange={handleAccessChange}
                    className="bg-transparent text-fg text-xs font-mono font-medium focus:outline-none cursor-pointer pl-1 truncate text-right flex-1 appearance-none pr-3"
                  >
                    <option value="all" className="bg-[#111317] text-fg">
                      All
                    </option>
                    <option value="free" className="bg-[#111317] text-fg">
                      Free
                    </option>
                    <option value="paid" className="bg-[#111317] text-fg">
                      PRO
                    </option>
                  </select>
                  <FiChevronDown className="w-3.5 h-3.5 text-fg-secondary/60 group-hover:text-fg pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 shrink-0" />
                </div>

                {/* Sort Dropdown Pill */}
                <div className="relative flex items-center justify-between h-10 px-3 rounded-xl bg-surface/40 backdrop-blur-md border border-white/10 hover:border-white/20 focus-within:border-action/60 transition-all shadow-xs group">
                  <span className="text-[11px] font-mono text-fg-secondary font-semibold uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                    <span className="text-action text-xs">⇅</span>
                    <span>Sort:</span>
                  </span>
                  <select
                    value={activeFilters.sort || "newest"}
                    onChange={handleSortChange}
                    className="bg-transparent text-fg text-xs font-mono font-medium focus:outline-none cursor-pointer pl-1 truncate text-right flex-1 appearance-none pr-3"
                  >
                    <option value="newest" className="bg-[#111317] text-fg">
                      Newest
                    </option>
                    <option value="popular" className="bg-[#111317] text-fg">
                      Popular
                    </option>
                    <option value="lowpoly" className="bg-[#111317] text-fg">
                      Low Poly
                    </option>
                    <option value="free_first" className="bg-[#111317] text-fg">
                      Free First
                    </option>
                    <option value="paid_first" className="bg-[#111317] text-fg">
                      Paid First
                    </option>
                  </select>
                  <FiChevronDown className="w-3.5 h-3.5 text-fg-secondary/60 group-hover:text-fg pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 shrink-0" />
                </div>
              </div>
            </div>

            {/* DESKTOP CONSOLIDATED FILTER TOOLBAR (>= lg) */}
            <div className="hidden lg:flex rounded-xl p-2.5 border border-white/[0.08] bg-surface/30 backdrop-blur-2xl items-center justify-between gap-2.5 shadow-xl">
              {/* Left: Live Breadcrumb Path */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-mono text-fg-secondary truncate">
                  <Link
                    href="/"
                    className="hover:text-action transition-colors"
                  >
                    models
                  </Link>
                  <span className="text-white/20">/</span>
                  <span className="text-fg-secondary truncate">
                    {currentCategory?.name || "All Assets"}
                  </span>
                  {currentSubCategory && (
                    <>
                      <span className="text-white/20">/</span>
                      <span className="text-action font-medium truncate">
                        {currentSubCategory.name}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Right: Search + Access Filter + Sort Filter */}
              <div className="flex items-center gap-2">
                {/* 1. Search input */}
                <form
                  onSubmit={handleSearchSubmit}
                  className="relative group w-64 md:w-72 lg:w-80 h-9"
                >
                  <button
                    type="submit"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-fg-secondary/70 hover:text-action group-focus-within:text-action transition-colors cursor-pointer p-0.5"
                    aria-label="Submit search"
                  >
                    <FiSearch className="w-4 h-4" />
                  </button>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={
                      currentSubCategory
                        ? `Search in ${currentSubCategory.name}...`
                        : currentCategory
                          ? `Search in ${currentCategory.name}...`
                          : "Search 3D models..."
                    }
                    value={searchInputValue}
                    onChange={(e) => setSearchInputValue(e.target.value)}
                    className="w-full h-full bg-surface/50 border border-white/[0.12] hover:border-white/25 focus:border-action focus:ring-1 focus:ring-action/30 rounded-lg pl-9 pr-8 text-xs text-fg placeholder:text-fg-secondary/50 font-sans focus:outline-none transition-all shadow-inner"
                  />
                  {searchInputValue ? (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-fg-secondary hover:text-fg hover:bg-white/10 rounded transition-colors cursor-pointer"
                      aria-label="Clear search"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono text-fg-secondary/60 bg-white/5 border border-white/10 shadow-sm">
                        /
                      </kbd>
                    </div>
                  )}
                </form>

                {/* 2. Access filter pill */}
                <div className="h-9 flex items-center gap-1.5 bg-surface/50 border border-white/[0.12] hover:border-white/25 focus-within:border-action/60 rounded-lg px-2.5 text-xs font-mono transition-all">
                  <span className="text-[10px] text-fg-secondary font-bold uppercase tracking-wider">
                    Access:
                  </span>
                  <select
                    value={activeFilters.access || "all"}
                    onChange={handleAccessChange}
                    className="bg-transparent text-fg text-xs font-mono focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="all" className="bg-[#111317] text-fg">
                      All
                    </option>
                    <option value="free" className="bg-[#111317] text-fg">
                      Free
                    </option>
                    <option value="paid" className="bg-[#111317] text-fg">
                      PRO
                    </option>
                  </select>
                </div>

                {/* 3. Sort filter pill */}
                <div className="h-9 flex items-center gap-1.5 bg-surface/50 border border-white/[0.12] hover:border-white/25 focus-within:border-action/60 rounded-lg px-2.5 text-xs font-mono transition-all">
                  <span className="text-[10px] text-fg-secondary font-bold uppercase tracking-wider">
                    Sort:
                  </span>
                  <select
                    value={activeFilters.sort || "newest"}
                    onChange={handleSortChange}
                    className="bg-transparent text-fg text-xs font-mono focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="newest" className="bg-[#111317] text-fg">
                      Newest
                    </option>
                    <option value="popular" className="bg-[#111317] text-fg">
                      Popular
                    </option>
                    <option value="lowpoly" className="bg-[#111317] text-fg">
                      Low Poly
                    </option>
                    <option value="free_first" className="bg-[#111317] text-fg">
                      Free First
                    </option>
                    <option value="paid_first" className="bg-[#111317] text-fg">
                      Paid First
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Status Counter */}
            <div className="flex items-center justify-between text-xs font-mono text-fg-secondary px-0.5">
              <span>
                {displayTotalCount}{" "}
                {displayTotalCount === 1 ? "model" : "models"} available
              </span>
              {activeFilters.search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-action hover:underline cursor-pointer text-[11px]"
                >
                  Clear search
                </button>
              )}
            </div>

            {/* 3D Models Grid (responsive 2, 3, or 4 columns - 24 total cards fills 100% of rows) */}
            {displayAssets.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
                {displayAssets.map((asset, index) => {
                  const formattedSize = formatAssetSize(asset);

                  const href = `/${slugify(asset.category_name || currentCategory?.name || "sketchup-3d-models")}/${slugify(asset.sub_category_name || currentSubCategory?.name || "sofa")}/${slugify(asset.name)}-${asset.id}`;

                  return (
                    <React.Fragment key={asset.id}>
                      <article className="bg-surface/30 hover:bg-surface/50 border border-white/[0.08] hover:border-white/20 rounded-xl overflow-hidden flex flex-col group transition-all duration-300 shadow-md hover:shadow-xl relative">
                        {/* Top 4:3 Image Stage */}
                        <Link
                          href={href}
                          className="aspect-[4/3] w-full bg-canvas/40 overflow-hidden relative flex items-center justify-center p-2.5"
                        >
                          {asset.cover ? (
                            <Image
                              src={getOptimizedImageUrl(
                                getOriginalImageUrl(asset.cover),
                              )}
                              alt={asset.cover_alt?.trim() || asset.name}
                              fill
                              priority={index === 0}
                              loading={index === 0 ? "eager" : "lazy"}
                              fetchPriority={index === 0 ? "high" : "auto"}
                              sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                              className="object-contain p-2 group-hover:scale-[1.15] transition-transform duration-500 ease-out drop-shadow-[0_6px_14px_rgba(0,0,0,0.65)]"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-fg-secondary/40 font-mono text-[10px]">
                              .SKP
                            </div>
                          )}

                          {/* Top-Left Pricing Badge */}
                          <div className="absolute top-2 left-2 z-10 pointer-events-none">
                            {asset.access_type === "paid" ? (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#322B15] text-[#E8C96A] border border-[#5F5125] shadow-sm">
                                PRO
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-action-tintBg text-action border border-action-tintLine shadow-sm">
                                Free
                              </span>
                            )}
                          </div>
                        </Link>

                        {/* Bottom Metadata Block (p-2.5) */}
                        <div className="p-2.5 flex flex-col justify-between flex-1 bg-surface/10">
                          <Link href={href} className="block group">
                            <h3
                              className="text-xs font-medium text-fg truncate group-hover:text-action transition-colors font-sans"
                              title={asset.name}
                            >
                              {asset.name}
                            </h3>
                            <p className="text-[10px] text-fg-secondary truncate mt-0.5">
                              {asset.sub_category_name || "SketchUp Model"}
                            </p>
                          </Link>

                          {/* Bottom Technical Spec Bar */}
                          <div className="border-t border-white/[0.08] pt-2 mt-2 flex items-center justify-between text-[10px] font-mono text-fg-secondary/80">
                            <span>{formattedSize}</span>
                          </div>
                        </div>
                      </article>

                      {/* Organic Staggered In-Grid Ad (Option 1) */}
                      {adIndices.has(index) && (
                        <CatalogGridAd
                          key={`catalog-grid-ad-${displayPage}-${index}`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="border-2 border-dashed border-white/10 rounded-xl py-20 px-4 text-center space-y-3 bg-surface/20">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-fg-secondary">
                  <FiPackage className="w-6 h-6 text-action" />
                </div>
                <h3 className="text-sm font-semibold text-fg font-sans">
                  {hasActiveFilters
                    ? "No 3D models match your criteria"
                    : "No models uploaded to this category yet"}
                </h3>
                <p className="text-xs text-fg-secondary max-w-sm mx-auto font-mono">
                  {hasActiveFilters
                    ? "Try clearing your search terms, toggling the access tier, or switching categories."
                    : "Check back soon or explore our other 3D asset categories from the sidebar."}
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-action text-xs font-mono transition-colors border border-white/10 cursor-pointer"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            )}

            {/* Pagination Controls */}
            {displayTotalPages > 1 && (
              <nav
                aria-label="Catalog pagination"
                className="pt-6 pb-2 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.08]"
              >
                {/* Summary status */}
                <span className="text-xs font-mono text-fg-secondary">
                  Showing {(displayPage - 1) * ITEMS_PER_PAGE + 1}–
                  {Math.min(displayPage * ITEMS_PER_PAGE, displayTotalCount)} of{" "}
                  {displayTotalCount} models
                </span>

                {/* Controls: Prev, Number Pills, Next */}
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  {displayPage > 1 && (
                    <a
                      href={buildUrl(displayPage - 1)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 bg-canvas/60 text-xs font-mono text-fg-secondary hover:text-fg hover:bg-white/10 transition-colors cursor-pointer"
                      aria-label="Previous page"
                    >
                      <FiChevronLeft className="w-3.5 h-3.5" />
                      <span>Prev</span>
                    </a>
                  )}

                  {renderPaginationPills()}

                  {displayPage < displayTotalPages && (
                    <a
                      href={buildUrl(displayPage + 1)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 bg-canvas/60 text-xs font-mono text-fg-secondary hover:text-fg hover:bg-white/10 transition-colors cursor-pointer"
                      aria-label="Next page"
                    >
                      <span>Next</span>
                      <FiChevronRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </nav>
            )}

            {/* Horizontal Banner Ad: Right below pagination and above Overview */}
            <ResponsiveBannerAd className="mt-6" />

            {/* Admin Panel Description (Rendered directly after pagination) */}
            {activeDescription && (
              <section className="mt-8 p-5 sm:p-6 rounded-2xl border border-white/[0.08] bg-surface/30 backdrop-blur-2xl shadow-xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-action" />
                  <h2 className="text-xs font-mono uppercase tracking-wider text-action font-semibold">
                    Overview •{" "}
                    {currentSubCategory?.name ||
                      currentCategory?.name ||
                      "Catalog"}
                  </h2>
                </div>

                <div className="relative">
                  <div
                    ref={descriptionRef}
                    className={`text-sm text-fg-secondary leading-relaxed font-sans prose prose-invert max-w-none [&_p]:mb-2.5 [&_a]:text-action hover:[&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 transition-all duration-300 ${
                      !isOverviewExpanded && isLongDescription
                        ? "max-h-[140px] overflow-hidden sm:max-h-none sm:overflow-visible"
                        : "max-h-none"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(activeDescription),
                    }}
                  />

                  {/* Gradient Fade Overlay on Mobile when Collapsed */}
                  {!isOverviewExpanded && isLongDescription && (
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#111317]/95 via-[#111317]/60 to-transparent pointer-events-none sm:hidden" />
                  )}
                </div>

                {/* See More / See Less Toggle Button (Phone Only) */}
                {isLongDescription && (
                  <div className="pt-1 sm:hidden">
                    <button
                      type="button"
                      onClick={() => setIsOverviewExpanded((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/10 border border-white/10 text-xs font-mono font-medium text-action transition-all cursor-pointer active:scale-95"
                      aria-expanded={isOverviewExpanded}
                    >
                      <span>
                        {isOverviewExpanded ? "See less" : "See more"}
                      </span>
                      {isOverviewExpanded ? (
                        <FiChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <FiChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

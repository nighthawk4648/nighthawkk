"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import slugify from "@/utils/slugify";
import { usePatreonAuth } from "@/contexts/PatreonAuthContext";
import { getOptimizedImageUrl } from "@/utils/cloudinary";
import { formatAssetSize } from "@/utils/formatAssetSize";
import dynamic from "next/dynamic";

const preloadSearchModal = () => import("./SearchModal");

const SearchModal = dynamic(() => import("./SearchModal"), {
  ssr: false,
  loading: () => null,
});

export default function Navbar({
  categories = [],
  subCategories = [],
  footerPages = [],
}) {
  const router = useRouter();
  const { user, isAuthenticated, login, logout } = usePatreonAuth();

  const [isBrowseOpen, setIsBrowseOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [initialSearchQuery, setInitialSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const browseRef = useRef(null);
  const userMenuRef = useRef(null);

  // Idle preload of search modal bundle chunk (zero initial bundle bloat)
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(() => preloadSearchModal());
      } else {
        setTimeout(() => preloadSearchModal(), 2000);
      }
    }
  }, []);

  // Global keyboard listener for Escape & custom open-search-modal event
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsBrowseOpen(false);
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    const handleOpenSearchEvent = (e) => {
      const query = e.detail?.query || "";
      setInitialSearchQuery(query);
      setIsSearchOpen(true);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-search-modal", handleOpenSearchEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-search-modal", handleOpenSearchEvent);
    };
  }, []);

  // Close flyouts on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (browseRef.current && !browseRef.current.contains(e.target)) {
        setIsBrowseOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getOriginalImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
  };

  // Extract top categories for the Browse flyout (sorted: 3D models -> Textures -> Plugins)
  const sortedCategories = useMemo(() => {
    return [...categories].sort(
      (a, b) => (Number(a.id) || 0) - (Number(b.id) || 0),
    );
  }, [categories]);

  const topCategories = sortedCategories.slice(0, 6);

  // Featured Sofa metadata (Asset ID 247: /sketchup-3d-models/sofa/stockholm-sundhamn-beige-sofa-by-ikea-247)
  const STOCKHOLM_SOFA = {
    id: 247,
    name: "Stockholm Sundhamn beige sofa by ikea",
    cover: "cover-1757323725958.png",
    access_type: "free",
    size: "Native .SKP",
    categoryName: "Sketchup 3D models",
    subCategoryName: "Sofa",
    href: "/sketchup-3d-models/sofa/stockholm-sundhamn-beige-sofa-by-ikea-247",
  };

  // Safely resolve the featured asset (specifically prioritizing Stockholm sofa ID 247)
  let featuredAsset = null;
  let featuredCategory = null;
  let featuredSubCategory = null;

  for (const cat of categories) {
    if (Array.isArray(cat?.sub_categories) && cat.sub_categories.length > 0) {
      for (const sub of cat.sub_categories) {
        if (Array.isArray(sub?.assets) && sub.assets.length > 0) {
          const match247 = sub.assets.find((a) => a.id === 247);
          if (match247) {
            featuredAsset = match247;
            featuredCategory = cat;
            featuredSubCategory = sub;
            break;
          }
        }
      }
    }
    if (featuredAsset) break;
  }

  // Fallback check against subCategories prop
  if (!featuredAsset && Array.isArray(subCategories) && subCategories.length > 0) {
    for (const sub of subCategories) {
      if (Array.isArray(sub?.assets) && sub.assets.length > 0) {
        const match247 = sub.assets.find((a) => a.id === 247);
        if (match247) {
          featuredAsset = match247;
          featuredSubCategory = sub;
          featuredCategory =
            sub.category ||
            categories.find((c) => c.id === sub.category_id) || {
              id: 3,
              name: "Sketchup 3D models",
            };
          break;
        }
      }
    }
  }

  // Resolved metadata with guaranteed Stockholm sofa presentation
  const featuredCover = featuredAsset?.cover || STOCKHOLM_SOFA.cover;
  const featuredName = featuredAsset?.name || STOCKHOLM_SOFA.name;
  const featuredCategoryName =
    featuredCategory?.name || STOCKHOLM_SOFA.categoryName;
  const featuredSubCategoryName =
    featuredSubCategory?.name || STOCKHOLM_SOFA.subCategoryName;
  const featuredAccessType =
    featuredAsset?.access_type || STOCKHOLM_SOFA.access_type;
  const featuredSize = formatAssetSize(featuredAsset) || STOCKHOLM_SOFA.size;
  const featuredAssetHref =
    featuredAsset && featuredCategory && featuredSubCategory
      ? `/${slugify(featuredCategory.name)}/${slugify(featuredSubCategory.name)}/${slugify(featuredAsset.name)}-${featuredAsset.id}`
      : STOCKHOLM_SOFA.href;

  return (
    <>
      {/* Sticky Floating Header Nav (Full-bleed fluid with 0.5in side margin) */}
      <header className="sticky top-4 z-40 px-4 md:px-[0.5in] w-full transition-all duration-200 mb-4 sm:mb-6">
        <div className="glass-panel h-14 rounded-full px-6 flex items-center justify-between shadow-2xl relative border border-line w-full">
          {/* Left: Wordmark & Navigation */}
          <div className="flex items-center gap-8">
            {/* Wordmark */}
            <Link
              href="/"
              className="flex items-center text-xl font-medium tracking-tight-brand select-none group font-sans"
            >
              <span className="text-fg group-hover:text-fg/90 transition-colors">
                Sketch
              </span>
              <span className="text-action">shaper</span>
            </Link>

            {/* Desktop Nav Items */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-fg-secondary">
              <div className="relative" ref={browseRef}>
                <button
                  type="button"
                  onClick={() => setIsBrowseOpen(!isBrowseOpen)}
                  aria-expanded={isBrowseOpen}
                  className={`px-3.5 py-1.5 rounded-full hover:text-fg hover:bg-surface-raised transition-colors flex items-center gap-1.5 ${
                    isBrowseOpen ? "text-fg bg-surface-raised" : ""
                  }`}
                >
                  <span>Browse</span>
                  <svg
                    className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${
                      isBrowseOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Browse Flyout Panel (Golden Ratio Layout: 1.618fr : 1fr) */}
                {isBrowseOpen && (
                  <div className="absolute top-12 left-0 w-[780px] !bg-surface/95 backdrop-blur-2xl rounded-card p-6 shadow-2xl border border-line-strong transition-all z-50 text-fg">
                    {/* Header bar inside Browse with compact, non-stretched Search Button */}
                    <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-line/60">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-action" />
                        <span className="text-xs font-mono uppercase tracking-wider text-fg-secondary">
                          Browse Catalog
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsBrowseOpen(false);
                          setIsSearchOpen(true);
                        }}
                        onMouseEnter={preloadSearchModal}
                        className="w-72 max-w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-surface-raised/80 hover:bg-surface-raised border border-line hover:border-action/40 transition-all text-left group"
                      >
                        <div className="flex items-center gap-2 text-fg-secondary group-hover:text-fg text-xs truncate">
                          <svg
                            className="w-3.5 h-3.5 text-fg-secondary group-hover:text-action transition-colors flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                          <span className="truncate">Search 3D models...</span>
                        </div>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[1.618fr_1fr] gap-8">
                      {/* Left: Top Categories */}
                      <div>
                        <div className="text-xs font-mono uppercase tracking-wider text-fg-secondary mb-4">
                          Top Categories (Live Catalog)
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {topCategories.map((category) => {
                            const assetCount =
                              category.sub_categories?.reduce(
                                (acc, sub) => acc + (sub.assets?.length || 0),
                                0,
                              ) || 0;

                            return (
                              <Link
                                key={category.id}
                                href={`/${slugify(category.name)}-${category.id}`}
                                onClick={() => setIsBrowseOpen(false)}
                                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-raised group transition-colors"
                              >
                                <span className="text-fg group-hover:text-action transition-colors truncate">
                                  {category.name}
                                </span>
                                {assetCount > 0 && (
                                  <span className="text-xs text-fg-secondary font-mono ml-2 flex-shrink-0">
                                    {assetCount.toLocaleString()}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                        <div className="mt-4 pt-4 border-t border-line flex justify-end items-center text-xs">
                          <Link
                            href="/#categories"
                            onClick={() => setIsBrowseOpen(false)}
                            className="text-action hover:underline font-medium"
                          >
                            View all categories &rarr;
                          </Link>
                        </div>
                      </div>

                      {/* Right: Featured Release */}
                      <div className="border-l border-line/60 pl-6 hidden md:block">
                        <div className="text-xs font-mono uppercase tracking-wider text-fg-secondary mb-3">
                          Featured Release
                        </div>
                        <Link
                          href={featuredAssetHref}
                          onClick={() => setIsBrowseOpen(false)}
                          className="block rounded-lg overflow-hidden border border-line bg-surface group cursor-pointer hover:border-action/50 transition-colors"
                        >
                          <div className="aspect-video relative overflow-hidden bg-surface-raised">
                            {featuredCover ? (
                              <Image
                                src={getOptimizedImageUrl(
                                  getOriginalImageUrl(featuredCover),
                                )}
                                alt={featuredName}
                                fill
                                sizes="(max-width: 768px) 100vw, 320px"
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <img
                                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"
                                alt={featuredName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            )}
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[11px] font-mono bg-action-tintBg text-action-tintFg border border-action-tintLine">
                              {featuredAccessType === "paid"
                                ? "PRO"
                                : "Free"}
                            </span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/gallery"
                className="px-3.5 py-1.5 rounded-full hover:text-fg hover:bg-surface-raised transition-colors"
              >
                Gallery
              </Link>
              <Link
                href="/blog"
                className="px-3.5 py-1.5 rounded-full hover:text-fg hover:bg-surface-raised transition-colors"
              >
                Articles
              </Link>
            </nav>
          </div>

          {/* Right: Extension pill, Patreon control */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Extension Pill (Action green tint, bolt icon, links to /extension) */}
            <Link
              href="/extension"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-action-tintBg text-action-tintFg border border-action-tintLine hover:bg-action/20 transition-all font-mono"
            >
              <svg
                className="w-3.5 h-3.5 text-action fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span className="tracking-tight">Extension</span>
            </Link>

            {/* Patreon Control Container */}
            <div className="relative" ref={userMenuRef}>
              {isAuthenticated && user ? (
                /* Signed In (Pro) State */
                <div>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 glass-panel px-3 py-1 rounded-full border border-line hover:border-action transition-all cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-action/20 border border-action text-action flex items-center justify-center text-xs font-bold overflow-hidden">
                      {user.image_url ? (
                        <img
                          src={user.image_url}
                          alt={user.full_name || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>
                          {(user.full_name || user.email || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-medium text-fg hidden sm:inline max-w-[100px] truncate">
                      {user.full_name?.split(" ")[0] || "Patron"}
                    </span>
                    <span className="text-[10px] font-mono font-semibold bg-action text-canvas px-1.5 py-0.2 rounded">
                      PRO
                    </span>
                  </button>

                  {/* User Dropdown Popover */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 !bg-surface/95 backdrop-blur-2xl rounded-card p-3 shadow-2xl border border-line-strong z-50 text-fg">
                      <div className="px-3 py-2 border-b border-line mb-2">
                        <div className="text-xs font-medium text-fg truncate">
                          {user.full_name || "Patron Member"}
                        </div>
                        <div className="text-[11px] font-mono text-fg-secondary truncate">
                          {user.email || "Active Supporter"}
                        </div>
                      </div>
                      <Link
                        href="https://www.patreon.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-3 py-1.5 text-xs rounded hover:bg-surface-raised hover:text-action transition-colors"
                      >
                        Manage Patreon Membership &rarr;
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-danger hover:bg-surface-raised rounded transition-colors mt-1"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Signed Out State (Default) */
                <button
                  type="button"
                  onClick={() => login()}
                  className="glass-panel text-fg hover:bg-surface-raised hover:text-white px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 border border-line"
                >
                  <svg
                    className="w-3.5 h-3.5 fill-[#FF424D] flex-shrink-0"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15.386.5C10.743.5 6.96 4.283 6.96 8.926c0 4.606 3.783 8.352 8.426 8.352 4.607 0 8.353-3.746 8.353-8.352C23.739 4.283 19.993.5 15.386.5zm-14.886 23h4.63v-23H.5v23z" />
                  </svg>
                  <span className="hidden sm:inline">
                    Sign in with Patreon
                  </span>
                  <span className="sm:hidden">Sign in</span>
                </button>
              )}
            </div>

            {/* Mobile Drawer Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-fg-secondary hover:text-fg hover:bg-surface-raised transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 !bg-surface/95 backdrop-blur-2xl rounded-card p-5 border border-line shadow-2xl text-fg space-y-4">
            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-surface-raised border border-line text-left text-sm text-fg-secondary hover:text-fg hover:border-action/40 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <svg
                  className="w-4 h-4 text-action"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span>Search models, categories...</span>
              </div>
            </button>

            <div className="flex flex-col space-y-2 text-sm font-medium">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded hover:bg-surface-raised"
              >
                Home
              </Link>
              <Link
                href="/gallery"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded hover:bg-surface-raised"
              >
                Gallery
              </Link>
              <Link
                href="/blog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded hover:bg-surface-raised"
              >
                Articles
              </Link>
              <Link
                href="/extension"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded hover:bg-surface-raised text-action font-mono"
              >
                SketchUp Extension
              </Link>
            </div>

            <div className="border-t border-line pt-3">
              <div className="text-xs font-mono uppercase tracking-wider text-fg-secondary mb-2">
                Categories
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {topCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/${slugify(cat.name)}-${cat.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded hover:bg-surface-raised text-fg-secondary hover:text-action truncate"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Universal Command Palette / Search Modal (Cmd+K) */}
      {isSearchOpen && (
        <SearchModal
          isOpen={isSearchOpen}
          initialQuery={initialSearchQuery}
          onClose={() => setIsSearchOpen(false)}
          categories={categories}
        />
      )}
    </>
  );
}

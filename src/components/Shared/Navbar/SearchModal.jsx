"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import slugify from "@/utils/slugify";
import { getOptimizedImageUrl } from "@/utils/cloudinary";

// Module-scope LRU cache: survives unmounts, capped at 40 entries
const SEARCH_CACHE_MAX = 40;
const searchCache = new Map();
const getCacheKey = (q) => (q || "").trim().toLowerCase();

export default function SearchModal({
  isOpen,
  initialQuery = "",
  onClose,
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Sync initial query and focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery || "");
      setSelectedIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults(null);
      setSelectedIndex(-1);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
  }, [isOpen, initialQuery]);

  // Global ESC listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search query using BFF route with AbortController cancellation & module cache
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      setResults(null);
      setLoading(false);
      setSelectedIndex(-1);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      return;
    }

    const cacheKey = getCacheKey(trimmed);
    if (searchCache.has(cacheKey)) {
      setResults(searchCache.get(cacheKey));
      setLoading(false);
      setSelectedIndex(-1);
      return;
    }

    setLoading(true);

    const timeoutId = setTimeout(async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const res = await fetch(
          `/api/assets/search?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        );

        if (res.ok) {
          const json = await res.json();
          const data = json.data || null;

          if (searchCache.size >= SEARCH_CACHE_MAX) {
            const oldestKey = searchCache.keys().next().value;
            searchCache.delete(oldestKey);
          }
          searchCache.set(cacheKey, data);
          setResults(data);
          setSelectedIndex(-1);
        } else {
          setResults(null);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Search fetch error:", err);
          setResults(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 140);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const getOriginalImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE || ""}${imagePath}`;
  };

  const handleSelect = (url) => {
    onClose();
    router.push(url);
  };

  const assets = results?.asset || [];
  const categories = results?.category || [];
  const subCategories = results?.subCategory || [];

  const hasResults =
    assets.length > 0 || categories.length > 0 || subCategories.length > 0;

  // Flatten active items for keyboard arrow navigation: Subcategories -> Categories -> 3D Models
  const flatItems = useMemo(() => {
    if (!hasResults) return [];
    const items = [];
    subCategories.forEach((sub) => {
      const url =
        sub.slug ||
        (sub.category
          ? `/${slugify(sub.category.name)}-${sub.category.id}/${slugify(sub.name)}-${sub.id}`
          : `/${slugify(sub.category_name || "Sketchup 3D models")}-${sub.category_id || 3}/${slugify(sub.name)}-${sub.id}`);
      items.push({ type: "subCategory", id: `sub-${sub.id}`, name: sub.name, url });
    });
    categories.forEach((cat) => {
      const url = cat.slug || `/${slugify(cat.name)}-${cat.id}`;
      items.push({ type: "category", id: `cat-${cat.id}`, name: cat.name, url });
    });
    assets.forEach((asset) => {
      const url =
        asset.slug ||
        `/${slugify(asset.sub_category?.category?.name || "model")}/${slugify(
          asset.sub_category?.name || "asset"
        )}/${slugify(asset.name)}-${asset.id}`;
      items.push({ type: "asset", id: `asset-${asset.id}`, name: asset.name, url });
    });
    return items;
  }, [hasResults, subCategories, categories, assets]);

  const handleEnterPress = () => {
    // 1. If an item is selected via arrow keys, open that item
    if (selectedIndex >= 0 && flatItems[selectedIndex]) {
      handleSelect(flatItems[selectedIndex].url);
      return;
    }

    // 2. If matching subcategory exists, take directly to that subcategory!
    if (subCategories.length > 0) {
      const targetSub = subCategories[0];
      const url =
        targetSub.slug ||
        (targetSub.category
          ? `/${slugify(targetSub.category.name)}-${targetSub.category.id}/${slugify(targetSub.name)}-${targetSub.id}`
          : `/${slugify(targetSub.category_name || "Sketchup 3D models")}-${targetSub.category_id || 3}/${slugify(targetSub.name)}-${targetSub.id}`);
      handleSelect(url);
      return;
    }

    // 3. If matching category exists, take directly to that category!
    if (categories.length > 0) {
      const targetCat = categories[0];
      const url = targetCat.slug || `/${slugify(targetCat.name)}-${targetCat.id}`;
      handleSelect(url);
      return;
    }

    // 4. Default: navigate to catalog search page
    const trimmed = query.trim();
    if (trimmed) {
      handleSelect(`/sketchup-3d-models-3?search=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (flatItems.length === 0) return;
      setSelectedIndex((prev) => (prev + 1 >= flatItems.length ? 0 : prev + 1));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (flatItems.length === 0) return;
      setSelectedIndex((prev) => (prev <= 0 ? flatItems.length - 1 : prev - 1));
      return;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-canvas/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl glass-panel rounded-card border border-line-strong p-5 shadow-2xl animate-in zoom-in-95 duration-150 text-fg"
      >
        {/* Search Input Form (Form submit handles Enter key natively on desktop & mobile) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEnterPress();
          }}
          className="h-14 w-full rounded-full bg-surface-raised border border-action px-5 flex items-center gap-3 mb-4 focus-within:ring-2 focus-within:ring-action/30 transition-all"
        >
          <svg
            className="w-5 h-5 text-action flex-shrink-0"
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
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Search models, categories, textures..."
            className="bg-transparent border-none outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 text-fg placeholder:text-fg-secondary w-full text-base font-normal shadow-none"
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-action border-t-transparent rounded-full animate-spin flex-shrink-0" />
          )}
          {query && !loading && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedIndex(-1);
                inputRef.current?.focus();
              }}
              className="text-xs font-mono text-fg-secondary hover:text-fg mr-1 cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono text-fg-secondary bg-surface px-2 py-0.5 rounded border border-line hover:text-fg hover:border-line-strong transition-colors cursor-pointer"
          >
            ESC
          </button>
        </form>

        {/* Results / Suggestions Container */}
        <div className="max-h-[380px] overflow-y-auto space-y-4 pr-1">
          {query.trim().length >= 2 ? (
            hasResults ? (
              <div className="space-y-4">
                {/* 1. Subcategories (Clean prominence at top for fast navigation) */}
                {subCategories.length > 0 && (
                  <div>
                    <div className="text-xs font-mono text-fg-secondary uppercase tracking-wider px-2 mb-1.5">
                      Subcategories ({subCategories.length})
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {subCategories.map((sub) => {
                        const url =
                          sub.slug ||
                          (sub.category
                            ? `/${slugify(sub.category.name)}-${sub.category.id}/${slugify(sub.name)}-${sub.id}`
                            : `/${slugify(sub.category_name || "Sketchup 3D models")}-${sub.category_id || 3}/${slugify(sub.name)}-${sub.id}`);
                        const isSelected =
                          flatItems[selectedIndex]?.id === `sub-${sub.id}`;

                        return (
                          <div
                            key={sub.id}
                            onClick={() => handleSelect(url)}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer group border transition-all ${
                              isSelected
                                ? "bg-surface-raised border-action text-action shadow-sm"
                                : "hover:bg-surface-raised border-line/60 text-fg"
                            }`}
                          >
                            <span className="text-sm font-medium truncate">
                              {sub.name}
                            </span>
                            <span className="text-xs font-mono text-fg-secondary">
                              &rarr;
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Categories */}
                {categories.length > 0 && (
                  <div>
                    <div className="text-xs font-mono text-fg-secondary uppercase tracking-wider px-2 mb-1.5">
                      Categories ({categories.length})
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((cat) => {
                        const url = cat.slug || `/${slugify(cat.name)}-${cat.id}`;
                        const isSelected =
                          flatItems[selectedIndex]?.id === `cat-${cat.id}`;

                        return (
                          <div
                            key={cat.id}
                            onClick={() =>
                              handleSelect(url)
                            }
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer group border transition-all ${
                              isSelected
                                ? "bg-surface-raised border-action text-action shadow-sm"
                                : "hover:bg-surface-raised border-line/60 text-fg"
                            }`}
                          >
                            <span className="text-sm font-medium truncate">
                              {cat.name}
                            </span>
                            <span className="text-xs font-mono text-fg-secondary">
                              &rarr;
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. 3D Models */}
                {assets.length > 0 && (
                  <div>
                    <div className="text-xs font-mono text-fg-secondary uppercase tracking-wider px-2 mb-1.5">
                      3D Models ({assets.length})
                    </div>
                    <div className="space-y-1">
                      {assets.map((asset) => {
                        const assetUrl =
                          asset.slug ||
                          `/${slugify(
                            asset.sub_category?.category?.name || "model"
                          )}/${slugify(
                            asset.sub_category?.name || "asset"
                          )}/${slugify(asset.name)}-${asset.id}`;
                        const isSelected =
                          flatItems[selectedIndex]?.id === `asset-${asset.id}`;

                        return (
                          <div
                            key={asset.id}
                            onClick={() => handleSelect(assetUrl)}
                            className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer group transition-all border ${
                              isSelected
                                ? "bg-surface-raised border-action text-action shadow-sm"
                                : "border-transparent hover:bg-surface-raised"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-md overflow-hidden bg-surface flex-shrink-0 relative border border-line">
                                {asset.cover ? (
                                  <Image
                                    src={getOptimizedImageUrl(
                                      getOriginalImageUrl(asset.cover)
                                    )}
                                    alt={asset.name}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-surface-raised flex items-center justify-center text-xs font-mono text-fg-secondary">
                                    .SKP
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className={`text-sm font-medium truncate ${isSelected ? "text-action" : "text-fg group-hover:text-action"}`}>
                                  {asset.name}
                                </div>
                                <div className="text-xs text-fg-secondary font-mono truncate">
                                  {asset.subCategoryName ||
                                    asset.sub_category?.name ||
                                    "Model"}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              !loading && (
                <div className="py-8 text-center text-sm text-fg-secondary font-mono">
                  No models or categories found for &ldquo;{query}&rdquo;
                </div>
              )
            )
          ) : (
            <div>
              <div className="text-xs font-mono text-fg-secondary uppercase tracking-wider px-2 mb-2">
                Popular Collections
              </div>
              <div className="space-y-1">
                {[
                  { title: "Bed", query: "Bed" },
                  { title: "New Model", query: "New Model" },
                  { title: "Marble", query: "Marble" },
                  { title: "Tiles", query: "Tiles" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setQuery(item.query);
                      inputRef.current?.focus();
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-raised cursor-pointer group text-sm text-fg"
                  >
                    <span className="group-hover:text-action truncate">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="mt-4 pt-3 border-t border-line text-[11px] text-fg-secondary flex justify-between font-mono">
          <span>Press Enter to select &bull; &uarr;&darr; to navigate</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}

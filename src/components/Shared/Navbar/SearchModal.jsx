"use client";

import React, { useEffect, useState, useRef } from "react";
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
  categories: rawCategoriesProp = [],
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Sync initial query and focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery || "");
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults(null);
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
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      return;
    }

    const cacheKey = getCacheKey(trimmed);
    if (searchCache.has(cacheKey)) {
      setResults(searchCache.get(cacheKey));
      setLoading(false);
      return;
    }

    setLoading(true);

    const timeoutId = setTimeout(async () => {
      // Abort previous in-flight request if user is still typing
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

          // Store in module LRU cache
          if (searchCache.size >= SEARCH_CACHE_MAX) {
            const oldestKey = searchCache.keys().next().value;
            searchCache.delete(oldestKey);
          }
          searchCache.set(cacheKey, data);
          setResults(data);
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

  if (!isOpen) return null;

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

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-canvas/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl glass-panel rounded-card border border-line-strong p-5 shadow-2xl animate-in zoom-in-95 duration-150 text-fg"
      >
        {/* Input Pill (56px) */}
        <div className="h-14 w-full rounded-full bg-surface-raised border border-action px-5 flex items-center gap-3 mb-4 focus-within:ring-2 focus-within:ring-action/30 transition-all">
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
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search models, categories, textures..."
            className="bg-transparent border-none outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 text-fg placeholder:text-fg-secondary w-full text-base font-normal shadow-none"
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-action border-t-transparent rounded-full animate-spin flex-shrink-0" />
          )}
          {query && !loading && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs font-mono text-fg-secondary hover:text-fg mr-1"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono text-fg-secondary bg-surface px-2 py-0.5 rounded border border-line hover:text-fg hover:border-line-strong transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results / Suggestions Container */}
        <div className="max-h-[380px] overflow-y-auto space-y-4 pr-1">
          {query.trim().length >= 2 ? (
            hasResults ? (
              <div className="space-y-4">
                {/* 3D Assets List */}
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
                        const isPro = asset.access_type === "paid";

                        return (
                          <div
                            key={asset.id}
                            onClick={() => handleSelect(assetUrl)}
                            className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-raised cursor-pointer group transition-colors"
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
                                <div className="text-sm font-medium text-fg group-hover:text-action truncate">
                                  {asset.name}
                                </div>
                                <div className="text-xs text-fg-secondary font-mono truncate">
                                  {asset.subCategoryName ||
                                    asset.sub_category?.name ||
                                    "Model"}
                                </div>
                              </div>
                            </div>
                            <span
                              className={`text-[11px] font-mono px-2 py-0.5 rounded border ml-2 flex-shrink-0 ${
                                isPro
                                  ? "bg-surface text-[#E8C96A] border-[#E8C96A]/40 font-semibold"
                                  : "bg-action-tintBg text-action-tintFg border-action-tintLine"
                              }`}
                            >
                              {isPro ? "PRO" : "Free"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Categories */}
                {categories.length > 0 && (
                  <div>
                    <div className="text-xs font-mono text-fg-secondary uppercase tracking-wider px-2 mb-1.5">
                      Categories ({categories.length})
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((cat) => (
                        <div
                          key={cat.id}
                          onClick={() =>
                            handleSelect(
                              cat.slug || `/${slugify(cat.name)}-${cat.id}`
                            )
                          }
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-raised cursor-pointer group border border-line/60"
                        >
                          <span className="text-sm text-fg group-hover:text-action truncate">
                            {cat.name}
                          </span>
                          <span className="text-xs font-mono text-fg-secondary">
                            &rarr;
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subcategories */}
                {subCategories.length > 0 && (
                  <div>
                    <div className="text-xs font-mono text-fg-secondary uppercase tracking-wider px-2 mb-1.5">
                      Subcategories ({subCategories.length})
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {subCategories.map((sub) => (
                        <div
                          key={sub.id}
                          onClick={() =>
                            handleSelect(
                              sub.slug ||
                                (sub.category
                                  ? `/${slugify(sub.category.name)}-${sub.category.id}/${slugify(sub.name)}-${sub.id}`
                                  : `/${slugify(sub.category_name || "models")}-${sub.category_id || ""}/${slugify(sub.name)}-${sub.id}`)
                            )
                          }
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-raised cursor-pointer group border border-line/60"
                        >
                          <span className="text-sm text-fg group-hover:text-action truncate">
                            {sub.name}
                          </span>
                          <span className="text-xs font-mono text-fg-secondary">
                            &rarr;
                          </span>
                        </div>
                      ))}
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
                Popular Categories &amp; Collections
              </div>
              <div className="space-y-1">
                {(Array.isArray(rawCategoriesProp) && rawCategoriesProp.length > 0
                  ? rawCategoriesProp.flatMap((cat) => [
                      { title: cat.name, query: cat.name },
                      ...(cat.sub_categories || []).slice(0, 1).map((sub) => ({
                        title: sub.name,
                        query: sub.name,
                        badge: cat.name,
                      })),
                    ]).slice(0, 5)
                  : [
                      { title: "Sofa", query: "Sofa" },
                      { title: "Lights", query: "Lights" },
                      { title: "Decoration", query: "Decoration" },
                    ]
                ).map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setQuery(item.query)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-raised cursor-pointer group text-sm text-fg"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="group-hover:text-action truncate">
                        {item.title}
                      </span>
                      {item.badge && (
                        <span className="text-[10px] font-mono text-fg-secondary/70 bg-surface px-1.5 py-0.5 rounded border border-line">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-fg-secondary">
                      Search &rarr;
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="mt-4 pt-3 border-t border-line text-[11px] text-fg-secondary flex justify-between font-mono">
          <span>Type at least 2 characters</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}

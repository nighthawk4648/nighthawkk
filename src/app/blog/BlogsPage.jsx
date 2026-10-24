"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { getOriginalImageUrl } from "@/utils/cloudinary";
import { formatDate } from "@/utils/formateDate";
import { stripHtml } from "@/utils/sanitizeHtml";
import slugify from "@/utils/slugify";
import BlogHorizontalAd from "@/components/Blog/BlogHorizontalAd";
import BlogGutterAd from "@/components/Blog/BlogGutterAd";
import AdUnit from "@/components/Shared/GoogleAdsense/AdUnit";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

function estimateReadingTime(content) {
  if (!content) return "3 min read";
  const text = stripHtml(content, 100000);
  const words = text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const minutes = Math.ceil(words / 200);
  return `${Math.max(1, minutes)} min read`;
}

const BlogsPage = ({ initialData = null }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch blogs with pagination
  const fetchBlogs = useCallback(async (page, limit) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/blogs/pages?page=${page}&limit=${limit}&order=desc`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch blogs: ${response.statusText}`);
      }

      const data = await response.json();
      const result = data.data?.result || [];
      const pagination = data.data?.pagination || {
        total: 0,
        totalPage: 1,
        currentPage: page,
      };

      return {
        result,
        pagination,
      };
    } catch (error) {
      console.error("Error in fetchBlogs:", error);
      throw error;
    }
  }, []);

  const {
    data: blogs,
    isLoading,
    hasMore,
    error,
    observerTarget,
    fetchAllRemaining,
  } = useInfiniteScroll(fetchBlogs, 10, initialData);

  // When a search query is entered, fetch all remaining pages so the search scope covers 100% of the library
  useEffect(() => {
    if (searchQuery.trim() && hasMore) {
      fetchAllRemaining();
    }
  }, [searchQuery, hasMore, fetchAllRemaining]);

  // Search filter
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return blogs || [];
    const q = searchQuery.toLowerCase().trim();
    return (blogs || []).filter((blog) => {
      const title = (blog?.title || "").toLowerCase();
      const desc = (blog?.short_description || "").toLowerCase();
      const author = (blog?.name || "").toLowerCase();
      return title.includes(q) || desc.includes(q) || author.includes(q);
    });
  }, [blogs, searchQuery]);

  const hasSearch = Boolean(searchQuery.trim());
  const featuredArticle = !hasSearch && blogs && blogs.length > 0 ? blogs[0] : null;
  const compactArticles = !hasSearch && blogs && blogs.length > 1 ? blogs.slice(1, 3) : [];
  const archiveArticles = hasSearch ? filteredArticles : (blogs ? blogs.slice(3) : []);

  return (
    <main className="w-full min-h-screen text-fg font-sans py-12 sm:py-16 px-4 md:px-[0.5in] relative overflow-hidden">
      {/* Central Blog Frame + Right Gutter for Wide Desktop Displays (>=1800px) */}
      <div className="w-full flex justify-center items-start gap-6 2xl:gap-8 relative z-10">
        {/* Central 1440px Blog Container */}
        <div className="w-full max-w-[90rem] shrink min-w-0">
          {/* Header Row */}
          <div className="mb-10 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight-h2 text-fg font-sans">
              Articles &amp; Guides
            </h1>
            <p className="text-xs sm:text-sm text-fg-secondary mt-1.5 max-w-2xl leading-relaxed">
              In-depth workflows, lighting breakdowns, material mapping guides, and SketchUp modeling tutorials curated for archviz professionals.
            </p>
          </div>

        {/* Error State */}
        {error && (
          <div className="bg-danger/10 border border-danger/30 text-danger px-5 py-4 rounded-[14px] mb-8 font-mono text-xs">
            <p>Error loading articles: {error}</p>
          </div>
        )}

        {/* Golden Split Featured Editorial */}
        {!hasSearch && featuredArticle && (
          <section className="mb-14 sm:mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-[1.618fr_1fr] gap-8 lg:gap-10 items-stretch">
              {/* Major Featured Article (1.618fr) */}
              <article className="group rounded-card overflow-hidden border border-white/[0.08] hover:border-action/40 bg-surface/30 backdrop-blur-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-action/5 relative">
                {/* Subtle Specular Sheen & Glass Highlight */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-action/[0.02] pointer-events-none" />

                <div className="relative z-10">
                  <Link
                    href={`/blog/${slugify(featuredArticle.title)}-${featuredArticle.id}`}
                    className="block"
                  >
                    <div className="aspect-[16/9] w-full rounded-[14px] overflow-hidden mb-6 bg-canvas/80 border border-white/10 relative shadow-inner">
                      {featuredArticle.image ? (
                        <Image
                          src={getOriginalImageUrl(featuredArticle.image)}
                          alt={
                            featuredArticle.image_alt?.trim() ||
                            featuredArticle.title ||
                            "Featured article"
                          }
                          fill
                          priority
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-fg-secondary/50 font-mono text-xs">
                          Featured Article
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-fg-secondary mb-2">
                      <span className="text-action">Featured</span>
                      <span>&bull;</span>
                      <span>
                        {estimateReadingTime(
                          featuredArticle.short_description ||
                            featuredArticle.paragraph_one,
                        )}
                      </span>
                      <span>&bull;</span>
                      <span>
                        {featuredArticle.created_at
                          ? formatDate(featuredArticle.created_at)
                          : "Recent"}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-fg group-hover:text-action transition-colors mb-3 font-sans line-clamp-2">
                      {featuredArticle.title}
                    </h2>

                    {featuredArticle.short_description && (
                      <p className="text-xs sm:text-sm text-fg-secondary leading-relaxed line-clamp-3 mb-4">
                        {stripHtml(featuredArticle.short_description, 240)}
                      </p>
                    )}
                  </Link>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.08] text-xs font-mono text-fg-secondary flex items-center justify-between">
                  <span>By {featuredArticle.name || "SketchShaper"}</span>
                  <Link
                    href={`/blog/${slugify(featuredArticle.title)}-${featuredArticle.id}`}
                    className="text-action hover:underline inline-flex items-center gap-1 font-medium group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Read full article</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </article>

              {/* Right Stacked Column: Alternating Compact Articles, Ad, and Promo */}
              <div className="flex flex-col gap-5 sm:gap-6 justify-between h-full">
                {/* 1. First Compact Article */}
                {compactArticles[0] && (
                  <Link
                    key={compactArticles[0].id}
                    href={`/blog/${slugify(compactArticles[0].title)}-${compactArticles[0].id}`}
                    className="p-4 sm:p-5 rounded-card border border-white/[0.08] hover:border-action/40 bg-surface/30 hover:bg-surface/50 backdrop-blur-2xl transition-all duration-300 flex items-center gap-4 group shadow-lg shadow-black/10 relative overflow-hidden"
                  >
                    <div className="w-24 sm:w-28 h-20 sm:h-24 rounded-[12px] bg-canvas/80 border border-white/10 flex-shrink-0 relative overflow-hidden">
                      {compactArticles[0].image ? (
                        <Image
                          src={getOriginalImageUrl(compactArticles[0].image)}
                          alt={
                            compactArticles[0].image_alt?.trim() ||
                            compactArticles[0].title ||
                            "Article thumbnail"
                          }
                          fill
                          sizes="120px"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-fg-secondary/50 p-2 text-center">
                          Article
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono text-fg-secondary mb-1 flex items-center gap-2">
                        <span className="text-action">Guide</span>
                        <span>&bull;</span>
                        <span>
                          {estimateReadingTime(
                            compactArticles[0].short_description ||
                              compactArticles[0].paragraph_one,
                          )}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-semibold text-fg group-hover:text-action transition-colors leading-snug line-clamp-2 mb-1">
                        {compactArticles[0].title}
                      </h3>
                      <span className="text-[11px] font-mono text-fg-secondary/70">
                        {compactArticles[0].created_at
                          ? formatDate(compactArticles[0].created_at)
                          : ""}
                      </span>
                    </div>
                  </Link>
                )}

                {/* 2. Horizontal Ad #1 (Between Blog 1 and Blog 2) */}
                <BlogHorizontalAd
                  slot="2114378043"
                  className="!my-0"
                  minHeight="min-h-[110px] sm:min-h-[125px]"
                />

                {/* 3. Second Compact Article */}
                {compactArticles[1] && (
                  <Link
                    key={compactArticles[1].id}
                    href={`/blog/${slugify(compactArticles[1].title)}-${compactArticles[1].id}`}
                    className="p-4 sm:p-5 rounded-card border border-white/[0.08] hover:border-action/40 bg-surface/30 hover:bg-surface/50 backdrop-blur-2xl transition-all duration-300 flex items-center gap-4 group shadow-lg shadow-black/10 relative overflow-hidden"
                  >
                    <div className="w-24 sm:w-28 h-20 sm:h-24 rounded-[12px] bg-canvas/80 border border-white/10 flex-shrink-0 relative overflow-hidden">
                      {compactArticles[1].image ? (
                        <Image
                          src={getOriginalImageUrl(compactArticles[1].image)}
                          alt={
                            compactArticles[1].image_alt?.trim() ||
                            compactArticles[1].title ||
                            "Article thumbnail"
                          }
                          fill
                          sizes="120px"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-fg-secondary/50 p-2 text-center">
                          Article
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono text-fg-secondary mb-1 flex items-center gap-2">
                        <span className="text-action">Guide</span>
                        <span>&bull;</span>
                        <span>
                          {estimateReadingTime(
                            compactArticles[1].short_description ||
                              compactArticles[1].paragraph_one,
                          )}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-semibold text-fg group-hover:text-action transition-colors leading-snug line-clamp-2 mb-1">
                        {compactArticles[1].title}
                      </h3>
                      <span className="text-[11px] font-mono text-fg-secondary/70">
                        {compactArticles[1].created_at
                          ? formatDate(compactArticles[1].created_at)
                          : ""}
                      </span>
                    </div>
                  </Link>
                )}

                {/* 4. Official SketchShaper Extension Promo Card */}
                <div className="p-4 sm:p-5 rounded-card border border-white/[0.08] hover:border-action/40 bg-surface/30 hover:bg-surface/40 backdrop-blur-2xl flex flex-col justify-between shadow-lg transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-action/[0.04] via-transparent to-transparent pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-action font-semibold px-1.5 py-0.5 rounded bg-action-tintBg border border-action-tintLine">
                        Official Plugin
                      </span>
                      <span className="text-[10px] font-mono text-fg-secondary/70">
                        v1.5.0
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-fg group-hover:text-action transition-colors mt-1 font-sans">
                      Import 3D models directly inside SketchUp
                    </h4>
                    <p className="text-xs text-fg-secondary mt-1 leading-relaxed font-sans line-clamp-2">
                      Install our native SketchUp plugin to search, preview, and insert optimized .skp assets with one click.
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-center justify-between relative z-10">
                    <Link
                      href="/extension"
                      className="text-xs font-mono font-medium text-action hover:underline inline-flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Download free extension</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Archive Section Header & Live Filter */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-line">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight-h2 text-fg">
                {hasSearch
                  ? `Results for "${searchQuery}"`
                  : "Browse Recent Articles"}
              </h2>
              <p className="text-xs font-mono text-fg-secondary mt-1">
                {hasSearch
                  ? `${filteredArticles.length} article${filteredArticles.length === 1 ? "" : "s"} found`
                  : `${blogs?.length || 0} articles available in library`}
              </p>
            </div>

            {/* Search Input Bar */}
            <div className="relative w-full sm:w-72">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-secondary pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (hasMore) fetchAllRemaining();
                }}
                placeholder="Search articles..."
                className="w-full bg-surface-raised/50 backdrop-blur-md border border-white/10 focus:border-action rounded-full pl-10 pr-9 py-2 text-xs font-mono text-fg placeholder:text-fg-secondary/60 outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-fg-secondary hover:text-fg p-1"
                  aria-label="Clear search"
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          {/* 3-Column Responsive Grid (Exact same pattern as homepage ArticlesSection) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {archiveArticles.map((article, index) => (
              <React.Fragment key={article.id}>
                <article
                  className="group rounded-card overflow-hidden border border-white/[0.08] hover:border-action/40 bg-surface/30 backdrop-blur-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-action/5 relative"
                >
                  {/* Subtle Specular Sheen & Glass Highlight */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-action/[0.02] pointer-events-none" />

                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <Link
                      href={`/blog/${slugify(article.title)}-${article.id}`}
                      className="block"
                    >
                      <div className="aspect-[16/10] w-full rounded-[14px] overflow-hidden mb-5 bg-canvas/80 border border-white/10 relative shadow-inner">
                        {article.image ? (
                          <Image
                            src={getOriginalImageUrl(article.image)}
                            alt={
                              article.image_alt?.trim() ||
                              article.title ||
                              "Blog cover"
                            }
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-fg-secondary/50 font-mono text-xs">
                            SketchShaper Article
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono text-fg-secondary mb-2">
                        <span>
                          {article.created_at
                            ? formatDate(article.created_at)
                            : "Recent"}
                        </span>
                        <span>&bull;</span>
                        <span>
                          {estimateReadingTime(
                            article.short_description || article.paragraph_one,
                          )}
                        </span>
                        <span>&bull;</span>
                        <span className="truncate max-w-[120px]">
                          {article.name || "SketchShaper"}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-semibold text-fg group-hover:text-action transition-colors mb-2 font-sans line-clamp-2">
                        {article.title}
                      </h3>

                      {article.short_description && (
                        <p className="text-xs sm:text-sm text-fg-secondary leading-relaxed line-clamp-2">
                          {stripHtml(article.short_description, 140)}
                        </p>
                      )}
                    </Link>

                    <div className="mt-5 pt-4 border-t border-white/[0.08] text-xs font-mono text-action flex items-center justify-between">
                      <Link
                        href={`/blog/${slugify(article.title)}-${article.id}`}
                        className="hover:underline flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Read article</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </article>

                {/* In-feed Ad placed after every 4 articles */}
                {(index + 1) % 4 === 0 && index < archiveArticles.length - 1 && (
                  <BlogFeedAd key={`blog-feed-ad-${index}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {isLoading &&
              [1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="rounded-[20px] border border-line bg-surface p-5 sm:p-6 animate-pulse"
                >
                  <div className="aspect-[16/10] w-full rounded-[14px] bg-canvas mb-5"></div>
                  <div className="h-3 w-1/3 bg-line rounded mb-3"></div>
                  <div className="h-5 w-4/5 bg-line rounded mb-2"></div>
                  <div className="h-3 w-full bg-line/60 rounded mb-4"></div>
                  <div className="h-3 w-1/4 bg-line rounded mt-4 pt-4 border-t border-line"></div>
                </div>
              ))}
          </div>

          {/* Infinite Scroll Observer Target */}
          {hasMore && !isLoading && !hasSearch && (
            <div
              ref={observerTarget}
              className="flex justify-center items-center py-10"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-fg-secondary">
                <span className="w-2 h-2 rounded-full bg-action animate-ping"></span>
                <span>Loading more articles...</span>
              </div>
            </div>
          )}

          {/* End of Content */}
          {!hasMore && blogs?.length > 0 && !hasSearch && (
            <div className="text-center py-12 border-t border-line mt-8">
              <p className="text-xs font-mono text-fg-secondary/60">
                End of articles &bull; Check back soon for new insights
              </p>
            </div>
          )}

          {/* Empty Search Filter State */}
          {hasSearch && filteredArticles.length === 0 && (
            <div className="text-center py-16 px-4 rounded-[20px] border border-line bg-surface max-w-md mx-auto my-8">
              <p className="text-sm font-sans font-medium text-fg">
                No articles found
              </p>
              <p className="text-xs text-fg-secondary mt-1">
                We couldn&apos;t find any articles matching &ldquo;{searchQuery}&rdquo;
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 px-4 py-1.5 rounded-full text-xs font-mono text-action bg-action-tintBg border border-action-tintLine hover:bg-action/20 transition-colors"
              >
                Clear search filter
              </button>
            </div>
          )}

          {/* Empty Database State */}
          {!isLoading && (!blogs || blogs.length === 0) && !error && (
            <div className="text-center py-20 px-4 rounded-[20px] border border-line bg-surface max-w-md mx-auto">
              <p className="text-sm font-sans font-medium text-fg">
                No articles published yet
              </p>
              <p className="text-xs text-fg-secondary mt-1">
                Check back soon for new tutorials and architectural insights.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Right Vertical Skyscraper Gutter Ad (Normal scroll, not sticky, well-spaced) */}
      <BlogGutterAd position="right" slot="2445550536" count={hasSearch ? 1 : 2} />
    </div>
  </main>
);
};

// Native in-feed ad card matching blog card dimensions and glass styling
function BlogFeedAd() {
  return (
    <article className="group rounded-card overflow-hidden border border-white/[0.08] hover:border-white/20 bg-surface/30 backdrop-blur-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 shadow-xl shadow-black/20 relative h-full min-h-[380px] max-h-[460px]">
      {/* Specular Sheen Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />

      {/* Top Header Tag: only "Advertisement" */}
      <div className="relative z-10 flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
        <span className="text-[10px] font-mono uppercase tracking-wider text-fg-secondary/60 font-medium">
          Advertisement
        </span>
      </div>

      {/* Center Ad Unit */}
      <div className="relative z-10 flex-1 flex items-center justify-center min-h-[250px] overflow-hidden">
        <AdUnit
          slot="5146613914"
          format="rectangle"
          fullWidthResponsive={false}
          bare={true}
          className="w-full h-full flex items-center justify-center"
        />
      </div>
    </article>
  );
}

export default BlogsPage;

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getOriginalImageUrl } from "@/utils/imageUrl";
import { stripHtml } from "@/utils/sanitizeHtml";
import slugify from "@/utils/slugify";

/**
 * Option B: High-Impact "Up Next" Hero Card
 *
 * Fix #1: `transition-all` replaced with explicit property list to avoid
 *         triggering layout/paint on every CSS property.
 * Fix #2: Arrow `transition-transform duration-300` matches card animation.
 * Fix #3: Grid uses `items-stretch` so the right column's h-full resolves correctly.
 * Fix #4: Single consistent `aspect-[16/10]` — no breakpoint flip that causes reflow.
 * Fix #8: Removed `hover:bg-surface/50` — only box-shadow changes on hover so
 *         the browser never re-composites the backdrop-blur behind a new alpha.
 */
export default function BlogNextArticle({ article }) {
  if (!article || !article.id) return null;

  const href = `/blog/${article.slug || slugify(article.title)}-${article.id}`;

  return (
    <section aria-label="Next article" className="my-10">
      {/* Section eyebrow label */}
      <div className="flex items-center gap-2 mb-3.5 px-1">
        <span className="w-2 h-2 rounded-full bg-action animate-pulse flex-shrink-0" />
        <span className="text-xs font-mono uppercase tracking-wider text-action font-semibold">
          Next Article
        </span>
      </div>

      {/*
        Fix #1 & #8: `transition-[border-color,box-shadow]` only — border and shadow
        are GPU-composited safely without triggering layout. No background opacity change.
        Fix #4: Removed overflow-hidden from the outer card so only the
        image wrapper clips; this eliminates the double-clip compositing conflict.
      */}
      <Link
        href={href}
        className="group block rounded-card border border-white/[0.08] hover:border-action/40 bg-surface/30 backdrop-blur-2xl p-5 sm:p-7 transition-[border-color,box-shadow] duration-300 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-action/10 relative"
      >
        {/* Decorative specular sheen — pointer-events disabled */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-action/[0.03] pointer-events-none rounded-card" />

        {/*
          Fix #3: `items-stretch` lets the right column's flex h-full resolve
          to the grid row height instead of collapsing on short content.
        */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-[200px_1fr] md:grid-cols-[240px_1fr] gap-5 sm:gap-6 items-stretch">

          {/*
            Fix #4: Single aspect ratio `aspect-[16/10]` — no breakpoint switching.
            overflow-hidden is on this wrapper only (the image's clip boundary).
            The outer card has no overflow-hidden so both radius layers don't
            fight each other during the scale transform.
          */}
          <div className="aspect-[16/10] w-full rounded-[14px] overflow-hidden bg-canvas/80 border border-white/10 relative shadow-inner flex-shrink-0">
            {article.image ? (
              <Image
                src={getOriginalImageUrl(article.image)}
                alt={
                  article.image_alt?.trim() ||
                  article.title ||
                  "Next article thumbnail"
                }
                fill
                sizes="(max-width: 640px) 100vw, 240px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-fg-secondary/50 font-mono text-xs">
                Next Article
              </div>
            )}
          </div>

          {/* Info & Content Block */}
          <div className="flex flex-col justify-between min-w-0 py-0.5">
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-fg group-hover:text-action transition-colors duration-300 font-sans line-clamp-2 leading-snug mb-2">
                {article.title}
              </h3>

              {article.short_description && (
                <p className="text-xs sm:text-sm text-fg-secondary leading-relaxed line-clamp-2 mb-4">
                  {stripHtml(article.short_description, 160)}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end text-xs font-mono">
              {/*
                Fix #2: `duration-300` added to match the card's border/shadow
                transition so the arrow slides in sync with the card settle.
              */}
              <span className="text-action inline-flex items-center gap-1.5 font-medium group-hover:translate-x-1 transition-transform duration-300">
                <span>Read next article</span>
                <span>&rarr;</span>
              </span>
            </div>
          </div>

        </div>
      </Link>
    </section>
  );
}

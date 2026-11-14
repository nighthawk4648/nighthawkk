import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiLayers } from "react-icons/fi";
import { getOriginalImageUrl } from "@/utils/imageUrl";
import { stripHtml } from "@/utils/sanitizeHtml";
import { blogPath } from "@/utils/paths";

/**
 * Similar Articles Grid (3 Cards) — matches SketchShaper CAD dark glass aesthetic.
 *
 * Cleanup #2: The entire card is a single `<Link>` wrapper. Eliminates redundant tab stops
 *             and ensures any click on the card opens the article.
 */
export default function BlogSimilarArticles({ articles = [] }) {
  const items = Array.isArray(articles) ? articles.filter((a) => a?.id) : [];
  if (items.length === 0) return null;

  return (
    <section aria-label="Similar articles" className="my-10">
      {/* Section header */}
      <div className="flex items-center gap-2 pb-3 mb-6 border-b border-white/[0.08]">
        <h2 className="text-xs font-mono uppercase tracking-wider text-action font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-action flex-shrink-0" />
          <FiLayers className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Similar Articles</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
        {items.map((item) => {
          const href = blogPath(item);

          return (
            <Link
              key={item.id}
              href={href}
              className="group flex flex-col justify-between rounded-card border border-white/[0.08] hover:border-action/40 bg-surface/30 backdrop-blur-2xl p-4 sm:p-5 transition-[border-color,box-shadow] duration-300 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-action/10 relative"
            >
              {/* Decorative specular sheen */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-action/[0.02] pointer-events-none rounded-card" />

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  {/* Image wrapper is the only clip boundary */}
                  <div className="aspect-[16/10] w-full rounded-[12px] overflow-hidden mb-4 bg-canvas/80 border border-white/10 relative shadow-inner">
                    {item.image ? (
                      <Image
                        src={getOriginalImageUrl(item.image)}
                        alt={
                          item.image_alt?.trim() ||
                          item.title ||
                          "Similar article thumbnail"
                        }
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-fg-secondary/50 font-mono text-xs">
                        Article
                      </div>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-semibold text-fg group-hover:text-action transition-colors duration-300 font-sans line-clamp-3 leading-snug">
                    {item.short_description
                      ? stripHtml(item.short_description, 140)
                      : item.title}
                  </h3>
                </div>

                {/* Footer CTA — styled text with animated arrow; card handles link navigation */}
                <div className="mt-4 pt-3 border-t border-white/[0.08] text-xs font-mono text-action flex items-center justify-between flex-shrink-0">
                  <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform duration-300">
                    <span>Read guide</span>
                    <span>&rarr;</span>
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

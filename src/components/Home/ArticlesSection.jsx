import React from "react";
import Link from "next/link";
import Image from "next/image";
import slugify from "@/utils/slugify";
import { getOptimizedImageUrl } from "@/utils/cloudinary";
import { formatDate } from "@/utils/formateDate";
import { stripHtml } from "@/utils/sanitizeHtml";

export default function ArticlesSection({ blogs = [] }) {
  if (!blogs || blogs.length === 0) {
    return null;
  }

  const getOriginalImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
  };

  // Only take real database blog posts (up to 3 latest)
  const realArticles = blogs.slice(-3).reverse().map((blog) => ({
    id: blog.id,
    title: blog.title,
    description: stripHtml(blog.short_description || "", 160),
    author: blog.name || "SketchShaper",
    date: formatDate(blog.created_at) || "Recent",
    image: blog.image ? getOptimizedImageUrl(getOriginalImageUrl(blog.image)) : null,
    href: `/blog/${slugify(blog.title)}-${blog.id}`,
  }));

  const gridClass =
    realArticles.length === 1
      ? "grid grid-cols-1 max-w-2xl mx-auto"
      : realArticles.length === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8";

  return (
    <section id="articles" className="py-16 w-full px-4 md:px-[0.5in] text-fg">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight-h2 text-fg font-sans">
            Articles
          </h2>
        </div>
        <Link
          href="/blog"
          className="text-sm font-medium text-action hover:text-action-hover transition-colors font-sans"
        >
          View all &rarr;
        </Link>
      </div>

      {/* Dynamic Grid: holds with 1, 2, or 3 cards cleanly */}
      <div className={gridClass}>
        {realArticles.map((article) => (
          <article
            key={article.id}
            className="group rounded-card overflow-hidden border border-white/[0.08] hover:border-action/40 bg-surface/30 backdrop-blur-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-action/5 relative"
          >
            {/* Subtle Specular Sheen & Glass Highlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-action/[0.02] pointer-events-none" />

            <div className="relative z-10 flex flex-col justify-between h-full">
              <Link href={article.href} className="block">
                <div className="aspect-[16/10] w-full rounded-[14px] overflow-hidden mb-5 bg-canvas/80 border border-white/10 relative shadow-inner">
                  {article.image ? (
                    article.image.startsWith("http") ? (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-fg-secondary/50 font-mono text-xs">
                      SketchShaper Article
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-fg-secondary mb-2">
                  <span>{article.date}</span>
                  <span>&bull;</span>
                  <span className="truncate">{article.author}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-fg group-hover:text-action transition-colors mb-2 font-sans line-clamp-2">
                  {article.title}
                </h3>
                {article.description && (
                  <p className="text-xs sm:text-sm text-fg-secondary leading-relaxed line-clamp-2">
                    {article.description}
                  </p>
                )}
              </Link>
              <div className="mt-5 pt-4 border-t border-white/[0.08] text-xs font-mono text-action flex items-center justify-between">
                <Link href={article.href} className="hover:underline flex items-center gap-1">
                  <span>Read article</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

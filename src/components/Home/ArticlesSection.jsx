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
      ? "grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-8 max-w-5xl mx-auto"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8";

  return (
    <section id="articles" className="py-8 sm:py-16 w-full px-4 md:px-[0.5in] text-fg">
      <div className="flex items-end justify-between mb-5 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-3xl font-semibold tracking-tight text-fg font-sans">
            Articles
          </h2>
        </div>
        <Link
          href="/blog"
          className="text-xs sm:text-sm font-medium text-action hover:text-action-hover transition-colors font-sans"
        >
          View all &rarr;
        </Link>
      </div>

      {/* Dynamic Grid: Compact Editorial Rows on mobile -> 3-Column Glass Cards on desktop */}
      <div className={gridClass}>
        {realArticles.map((article) => (
          <article
            key={article.id}
            className="group rounded-2xl md:rounded-card overflow-hidden border border-white/[0.08] hover:border-action/40 bg-surface/30 backdrop-blur-2xl p-3 sm:p-5 lg:p-6 transition-all duration-300 shadow-md hover:shadow-xl shadow-black/20 hover:shadow-action/5 relative"
          >
            {/* Subtle Specular Sheen & Glass Highlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-action/[0.02] pointer-events-none" />

            <Link
              href={article.href}
              className="relative z-10 flex flex-row md:flex-col items-center md:items-stretch gap-3.5 sm:gap-5 justify-between h-full"
            >
              {/* Thumbnail Frame: 80px square on mobile -> 16:10 wide hero banner on desktop */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-full md:h-auto md:aspect-[16/10] rounded-xl md:rounded-[14px] overflow-hidden bg-canvas/80 border border-white/10 relative shadow-inner flex-shrink-0 md:mb-5">
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
                  <div className="w-full h-full flex items-center justify-center text-fg-secondary/50 font-mono text-[10px] sm:text-xs">
                    Article
                  </div>
                )}
              </div>

              {/* Content Block */}
              <div className="min-w-0 flex-1 flex flex-col justify-between self-stretch md:self-auto py-0.5 md:py-0">
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono text-fg-secondary mb-1 sm:mb-2">
                    <span>{article.date}</span>
                    <span>&bull;</span>
                    <span className="truncate">{article.author}</span>
                  </div>

                  <h3 className="text-sm sm:text-lg lg:text-xl font-semibold text-fg group-hover:text-action transition-colors mb-1 sm:mb-2 font-sans line-clamp-2">
                    {article.title}
                  </h3>

                  {article.description && (
                    <p className="hidden md:block text-xs sm:text-sm text-fg-secondary leading-relaxed line-clamp-2">
                      {article.description}
                    </p>
                  )}
                </div>

                {/* Mobile Inline Link / Desktop Footer Row */}
                <div className="mt-1.5 md:mt-5 md:pt-4 md:border-t md:border-white/[0.08] text-xs font-mono text-action flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 font-medium group-hover:translate-x-0.5 transition-transform">
                    <span>Read article</span>
                    <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

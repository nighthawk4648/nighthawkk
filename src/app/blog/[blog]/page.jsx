import { getOptimizedImageUrl, getOriginalImageUrl } from "@/utils/cloudinary";
import { formatDate } from "@/utils/formateDate";
import getData from "@/utils/getData";
import { sanitizeHtml, stripHtml } from "@/utils/sanitizeHtml";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiCalendar, FiClock, FiUser } from "react-icons/fi";

function estimateReadingTime(content) {
  const text = stripHtml(content, 100000);
  const words = text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const minutes = Math.ceil(words / 200);
  return `${Math.max(1, minutes)} min read`;
}

// Dynamic metadata generation
export async function generateMetadata({ params }) {
  const id = params?.blog?.split("-").pop();
  if (!id || isNaN(Number(id))) {
    return {
      title: "Blog Not Found - SketchShaper",
      description: "The requested blog post could not be found.",
    };
  }
  const blog = await getData(`blogs/${id}`);

  if (!blog?.data) {
    return {
      title: "Blog Not Found - SketchShaper",
      description: "The requested blog post could not be found.",
    };
  }

  const cleanDescription =
    stripHtml(
      blog.data.short_description || blog.data.paragraph_one || "",
      160,
    ) ||
    "Read our latest architectural 3D and visualization insights on SketchShaper.";
  const coverUrl = blog.data.image
    ? getOriginalImageUrl(blog.data.image)
    : undefined;

  return {
    title: `${blog.data.title} - SketchShaper Blog`,
    description: cleanDescription,
    openGraph: {
      title: blog.data.title,
      description: cleanDescription,
      images: coverUrl ? [coverUrl] : [],
    },
  };
}

const BlogDetailPage = async ({ params }) => {
  const id = params?.blog?.split("-").pop();
  if (!id || isNaN(Number(id))) {
    notFound();
  }

  const blog = await getData(`blogs/${id}`);

  if (!blog?.data) {
    notFound();
  }

  const post = blog.data;

  // Filter out empty sections, literal "undefined" strings, and blank markup
  const rawSections = [
    { key: "short_description", html: post.short_description },
    { key: "paragraph_one", html: post.paragraph_one },
    { key: "paragraph_two", html: post.paragraph_two },
    { key: "paragraph_three", html: post.paragraph_three },
    { key: "content", html: post.content || post.body },
  ];

  const contentSections = rawSections.filter((section) => {
    if (!section.html) return false;
    const str = String(section.html).trim();
    if (!str || str === "undefined" || str === "<p>undefined</p>") return false;
    const textOnly = str.replace(/<[^>]*>/g, "").trim();
    return textOnly.length > 0 && textOnly !== "undefined";
  });

  // Calculate estimated reading time
  const fullText = contentSections.map((s) => s.html).join(" ");
  const readingTime = estimateReadingTime(fullText);

  return (
    <article className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white px-4 py-8 sm:px-6 md:px-12 md:py-14">
      <div className="max-w-4xl mx-auto">
        {/* Top Breadcrumb / Back Link */}
        <nav className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors duration-200 group"
          >
            <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Back to all articles</span>
          </Link>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            {post.title}
          </h1>

          {/* Metadata Row: Author, Date, Reading Time */}
          <div className="flex flex-wrap items-center gap-y-3 gap-x-6 pb-6 border-b border-zinc-800/80 text-sm text-zinc-400">
            {/* Author */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <FiUser className="w-4 h-4" />
              </div>
              <span className="font-medium text-zinc-200">
                {post.name || "SketchShaper"}
              </span>
            </div>

            {/* Publication Date */}
            {post.created_at && (
              <div className="flex items-center gap-1.5">
                <FiCalendar className="w-4 h-4 text-zinc-500" />
                <time dateTime={post.created_at}>
                  {formatDate(post.created_at)}
                </time>
              </div>
            )}

            {/* Reading Time */}
            <div className="flex items-center gap-1.5">
              <FiClock className="w-4 h-4 text-zinc-500" />
              <span>{readingTime}</span>
            </div>
          </div>
        </header>

        {/* Cover Hero Image */}
        {post.image && (
          <div className="mb-10 rounded-2xl overflow-hidden border border-zinc-800/90 shadow-2xl bg-zinc-900/60">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={getOptimizedImageUrl(getOriginalImageUrl(post.image))}
                alt={post.title || "Blog cover image"}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="max-w-3xl mx-auto">
          {contentSections.length > 0 ? (
            contentSections.map((section) => (
              <div
                key={section.key}
                className="blog-content mb-8 text-zinc-300 text-base md:text-lg leading-relaxed"
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(section.html),
                  }}
                />
              </div>
            ))
          ) : (
            <p className="text-zinc-500 italic py-8 text-center">
              No content available for this post.
            </p>
          )}

          {/* Secondary / In-Article Image */}
          {post.bgImage && (
            <figure className="my-10 rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-900/40">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={getOptimizedImageUrl(getOriginalImageUrl(post.bgImage))}
                  alt={post.title || "Blog featured visual"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            </figure>
          )}

          {/* Bottom Footer CTA */}
          <footer className="mt-14 pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-white font-semibold text-base">
                Enjoyed this article?
              </h4>
              <p className="text-zinc-400 text-sm">
                Discover more guides, 3D models, and rendering tips.
              </p>
            </div>
            <Link
              href="/blog"
              className="px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors duration-200 border border-zinc-700 flex items-center gap-2 flex-shrink-0"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Explore all blogs</span>
            </Link>
          </footer>
        </div>
      </div>
    </article>
  );
};

export default BlogDetailPage;

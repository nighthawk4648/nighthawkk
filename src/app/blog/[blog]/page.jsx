import { getOriginalImageUrl } from "@/utils/cloudinary";
import { formatDate } from "@/utils/formateDate";
import getData from "@/utils/getData";
import { sanitizeHtml, stripHtml } from "@/utils/sanitizeHtml";
import slugify from "@/utils/slugify";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiCalendar, FiClock, FiUser } from "react-icons/fi";
import BlogLeftRail from "@/components/Blog/BlogLeftRail";
import BlogRightRailAd from "@/components/Blog/BlogRightRailAd";
import BlogMobileToc from "@/components/Blog/BlogMobileToc";
import BlogHorizontalAd from "@/components/Blog/BlogHorizontalAd";

function estimateReadingTime(content) {
  const text = stripHtml(content, 100000);
  const words = text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const minutes = Math.ceil(words / 200);
  return `${Math.max(1, minutes)} min read`;
}

function extractHeadingsAndInjectIds(sections) {
  const toc = [];
  const existingIds = new Set();

  const processedSections = sections.map((section) => {
    if (!section.html) return section;

    const processedHtml = section.html.replace(
      /<(h[1-4])([^>]*)>([\s\S]*?)<\/\1>/gi,
      (match, tag, attrs, text) => {
        const plainText = text.replace(/<[^>]*>/g, "").trim();
        if (!plainText) return match;

        // Check if id already exists in attrs
        const idMatch = attrs.match(/id=["']([^"']+)["']/i);
        let slug = idMatch ? idMatch[1] : null;

        if (!slug) {
          let baseSlug = plainText
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
          if (!baseSlug) baseSlug = "section";

          slug = baseSlug;
          let counter = 1;
          while (existingIds.has(slug)) {
            slug = `${baseSlug}-${counter++}`;
          }
        }
        existingIds.add(slug);

        toc.push({ id: slug, text: plainText, level: tag.toLowerCase() });

        if (idMatch) {
          return match;
        }
        return `<${tag} id="${slug}"${attrs}>${text}</${tag}>`;
      }
    );

    return {
      ...section,
      html: processedHtml,
    };
  });

  return { processedSections, toc };
}

// Dynamic metadata generation
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.blog?.split("-").pop();
  const fallbackCanonical = `https://www.sketchshaper.com/blog/${resolvedParams?.blog || ""}`;

  if (!id || isNaN(Number(id))) {
    return {
      title: "Blog Not Found - SketchShaper",
      description: "The requested blog post could not be found.",
      alternates: {
        canonical: fallbackCanonical,
      },
    };
  }
  const blog = await getData(`blogs/${id}`);

  if (!blog?.data) {
    return {
      title: "Blog Not Found - SketchShaper",
      description: "The requested blog post could not be found.",
      alternates: {
        canonical: fallbackCanonical,
      },
    };
  }

  const post = blog.data;
  const canonicalUrl =
    post.title && post.id
      ? `https://www.sketchshaper.com/blog/${slugify(post.title)}-${post.id}`
      : fallbackCanonical;

  const cleanDescription =
    stripHtml(
      post.short_description || post.paragraph_one || "",
      160,
    ) ||
    "Read our latest architectural 3D and visualization insights on SketchShaper.";
  const coverUrl = post.image
    ? getOriginalImageUrl(post.image)
    : undefined;

  const title =
    post.meta_title?.trim() || `${post.title} - SketchShaper Blog`;
  const description =
    (post.meta_description
      ? stripHtml(post.meta_description, 160)
      : "") || cleanDescription;
  const keywords = post.keywords?.trim() || undefined;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description,
      url: canonicalUrl,
      type: "article",
      siteName: "SketchShaper",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at || post.created_at,
      images: coverUrl ? [coverUrl] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: coverUrl ? [coverUrl] : [],
    },
  };
}

const BlogDetailPage = async ({ params }) => {
  const resolvedParams = await params;
  const id = resolvedParams?.blog?.split("-").pop();
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

  const { processedSections, toc: tocItems } =
    extractHeadingsAndInjectIds(contentSections);

  // Calculate estimated reading time
  const fullText = processedSections.map((s) => s.html).join(" ");
  const readingTime = estimateReadingTime(fullText);

  const canonicalUrl = `https://www.sketchshaper.com/blog/${slugify(post.title)}-${post.id}`;

  const normalizedAuthor = (post?.name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  const authorObject =
    normalizedAuthor === "sketchshaper" || !normalizedAuthor
      ? {
          "@type": "Organization",
          name: "SketchShaper",
          url: "https://www.sketchshaper.com",
        }
      : {
          "@type": "Person",
          name: post.name.trim(),
        };

  const publisherObject = {
    "@type": "Organization",
    name: "SketchShaper",
    url: "https://www.sketchshaper.com",
    logo: {
      "@type": "ImageObject",
      url: "https://www.sketchshaper.com/assets/navbar/navbar_logo.png",
    },
  };

  const coverUrl = post.image ? getOriginalImageUrl(post.image) : undefined;
  const postDescription =
    post.meta_description?.trim()
      ? stripHtml(post.meta_description, 160)
      : stripHtml(post.short_description || post.paragraph_one || "", 160);

  const blogPostingLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: postDescription,
    image: coverUrl ? [coverUrl] : [],
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    url: canonicalUrl,
    keywords: post.keywords?.trim() || undefined,
    author: authorObject,
    publisher: publisherObject,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.sketchshaper.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Articles",
        item: "https://www.sketchshaper.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <article className="min-h-screen text-fg font-sans px-4 py-8 sm:px-6 md:px-8 xl:px-10 md:py-14 relative">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="w-full max-w-[1560px] mx-auto relative z-10">
        <div className="flex justify-center gap-8 2xl:gap-12 items-start">
          {/* Left Rail (Sticky Table of Contents + Share) */}
          <BlogLeftRail
            tocItems={tocItems}
            title={post.title}
            url={canonicalUrl}
          />

          {/* Central Article Column */}
          <div className="w-full max-w-3xl shrink min-w-0">
            {/* Top Breadcrumb / Back Link (visible on mobile/tablet, hidden on desktop XL where left rail has it) */}
            <nav className="mb-8 xl:hidden">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs font-mono text-fg-secondary hover:text-action transition-colors duration-200 group"
              >
                <FiArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span>Back to all articles</span>
              </Link>
            </nav>

            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-fg tracking-tight-h2 leading-tight mb-6 font-sans">
                {post.title}
              </h1>

              {/* Metadata Row: Author, Date, Reading Time */}
              <div className="flex flex-wrap items-center gap-y-3 gap-x-6 pb-6 border-b border-white/[0.08] text-xs font-mono text-fg-secondary">
                {/* Author */}
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-action-tintBg border border-action-tintLine flex items-center justify-center text-action">
                    <FiUser className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-fg">
                    {post.name || "SketchShaper"}
                  </span>
                </div>

                {/* Publication Date */}
                {post.created_at && (
                  <div className="flex items-center gap-1.5">
                    <FiCalendar className="w-3.5 h-3.5 text-fg-secondary/70" />
                    <time dateTime={post.created_at}>
                      {formatDate(post.created_at)}
                    </time>
                  </div>
                )}

                {/* Reading Time */}
                <div className="flex items-center gap-1.5">
                  <FiClock className="w-3.5 h-3.5 text-fg-secondary/70" />
                  <span>{readingTime}</span>
                </div>
              </div>
            </header>

            {/* Cover Hero Image in Frosted Glass Frame */}
            {post.image && (
              <div className="mb-10 rounded-[20px] overflow-hidden border border-white/[0.08] shadow-2xl bg-surface/30 backdrop-blur-2xl p-2 sm:p-3 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-action/[0.02] pointer-events-none" />
                <div className="relative aspect-[16/9] w-full rounded-[14px] overflow-hidden bg-canvas/80 border border-white/10 shadow-inner z-10">
                  <Image
                    src={getOriginalImageUrl(post.image)}
                    alt={
                      post?.image_alt?.trim() || post?.title || "Blog cover image"
                    }
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 896px) 100vw, 896px"
                  />
                </div>
              </div>
            )}

            {/* In-Article Horizontal Ad directly after the Hero Image */}
            <BlogHorizontalAd slot="2114378043" />

            {/* Mobile / Tablet Collapsible Table of Contents */}
            <BlogMobileToc tocItems={tocItems} />

            {/* Content Body */}
            <div>
              {processedSections.length > 0 ? (
                processedSections.map((section) => {
                  const hasHtml = /<[a-z][\s\S]*>/i.test(section.html);
                  const isLead = section.key === "short_description";
                  const showAdAfter =
                    section.key === "paragraph_one" ||
                    section.key === "paragraph_two" ||
                    section.key === "paragraph_three";

                  return (
                    <React.Fragment key={section.key}>
                      {!hasHtml ? (
                        <div
                          className={`blog-plain-text leading-relaxed ${
                            isLead
                              ? "text-lg md:text-xl text-fg-secondary mb-8 italic font-normal"
                              : "text-base md:text-lg text-fg/90 mb-5 last:mb-0"
                          }`}
                        >
                          {section.html}
                        </div>
                      ) : (
                        <div
                          className="blog-content text-fg/90 text-base md:text-lg leading-relaxed mb-5 last:mb-0"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(section.html),
                          }}
                        />
                      )}

                      {/* In-Article Horizontal Ad Box after paragraph 1, 2, and 3 */}
                      {showAdAfter && (
                        <BlogHorizontalAd slot="2114378043" />
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <p className="text-fg-secondary italic py-8 text-center font-mono text-xs">
                  No content available for this post.
                </p>
              )}

              {/* Secondary / In-Article Image in Frosted Glass Frame */}
              {post.bgImage && (
                <figure className="my-10 rounded-[16px] overflow-hidden border border-white/[0.08] bg-surface/30 backdrop-blur-2xl p-2 relative shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />
                  <div className="relative aspect-[16/9] w-full rounded-[10px] overflow-hidden bg-canvas/80 border border-white/10 z-10">
                    <Image
                      src={getOriginalImageUrl(post.bgImage)}
                      alt={
                        post?.bg_image_alt?.trim() ||
                        post?.title ||
                        "Blog featured visual"
                      }
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 768px"
                    />
                  </div>
                </figure>
              )}

              {/* Bottom In-Article Horizontal Ad */}
              <BlogHorizontalAd slot="2114378043" className="mt-10 !mb-8" />

              {/* Bottom Footer CTA in Frosted Glass Card */}
              <footer className="mt-8 p-6 sm:p-8 rounded-card border border-white/[0.08] bg-surface/30 backdrop-blur-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-action/[0.02] pointer-events-none" />
                <div className="relative z-10">
                  <h4 className="text-fg font-semibold text-base">
                    Enjoyed this article?
                  </h4>
                  <p className="text-fg-secondary text-xs sm:text-sm mt-0.5">
                    Discover more guides, free 3D models, and rendering tips.
                  </p>
                </div>
                <Link
                  href="/blog"
                  className="relative z-10 px-4 py-2.5 rounded-full bg-surface-raised/60 hover:bg-surface-raised text-fg text-xs font-mono transition-colors duration-200 border border-white/10 flex items-center gap-2 flex-shrink-0 hover:border-white/20 backdrop-blur-sm"
                >
                  <FiArrowLeft className="w-3.5 h-3.5" />
                  <span>Explore all articles</span>
                </Link>
              </footer>
            </div>
          </div>

          {/* Right Rail (Vertical Ad Slot 2445550536) */}
          <BlogRightRailAd slot="2445550536" />
        </div>
      </div>
    </article>
  );
};

export default BlogDetailPage;

import React, { cache } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import getData from "@/utils/getData";
import { sanitizeHtml } from "@/utils/sanitizeHtml";
import { ErrorFallback } from "@/components/Shared/ErrorFallback/ErrorFallback";
import { buildPageMetadata, cleanText } from "@/utils/seo";
import {
  JsonLd,
  generateBreadcrumbSchema,
  generateWebPageSchema,
} from "@/utils/schema";

const getLicensePage = cache(async () => {
  const allPages = await getData("pages", {
    tags: ["pages"],
    revalidate: 300,
  });
  const page = allPages?.data?.find(
    (p) =>
      p.slug === "license" ||
      p.title?.toLowerCase().includes("license")
  );
  return page || null;
});

const normalizeLicenseContent = (html) => {
  if (!html) return html;
  return html
    .replace(
      /https:\/\/chooser-beta\.creativecommons\.org\/img\/cc-logo\.[^"']+\.(svg|png)/g,
      "/assets/licenses/cc-logo.svg",
    )
    .replace(
      /https:\/\/chooser-beta\.creativecommons\.org\/img\/cc-zero\.[^"']+\.(svg|png)/g,
      "/assets/licenses/cc-zero.svg",
    );
};

export async function generateMetadata() {
  const page = await getLicensePage();
  const title =
    cleanText(page?.meta_title, 200) ||
    `${page?.title || "License"} - SketchShaper`;
  const description =
    cleanText(page?.meta_description, 160) ||
    cleanText(page?.short_description || page?.content || "", 160) ||
    "Creative Commons Zero (CC0) and platform licensing terms for SketchShaper assets.";

  return {
    ...buildPageMetadata({ title, description, pathname: "/license" }),
    keywords: cleanText(page?.keywords, 300) || undefined,
  };
}

export default async function LicensePage() {
  const page = await getLicensePage();

  if (!page) {
    return <ErrorFallback />;
  }

  const normalized = normalizeLicenseContent(page.content);
  const cleanContent = sanitizeHtml(normalized);

  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: page.title || "License", url: "/license" },
  ]);

  const webPageSchema = generateWebPageSchema({
    title: page.title || "License",
    description:
      page.short_description ||
      "Creative Commons Zero (CC0) and platform licensing terms for SketchShaper assets.",
    pathname: "/license",
  });

  return (
    <div className="w-full min-h-screen text-fg font-sans py-8 sm:py-12 px-4 md:px-[0.5in] relative overflow-hidden bg-transparent">
      <JsonLd data={breadcrumbsSchema} />
      <JsonLd data={webPageSchema} />
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Top Breadcrumb Navigation */}
        <nav className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-fg-secondary hover:text-action transition-colors duration-200 group"
          >
            <FiArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Back to home</span>
          </Link>
        </nav>

        {/* Main Architectural Glass Panel Container */}
        <div className="bg-surface/30 backdrop-blur-2xl rounded-panel border border-white/[0.08] p-6 sm:p-10 lg:p-12 shadow-2xl shadow-black/40 relative overflow-hidden">
          {/* Subtle Specular Sheen Gradient Wash */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-action/[0.02] pointer-events-none" />

          {/* Header Row */}
          <header className="relative z-10 pb-6 mb-8 border-b border-white/[0.08]">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight-h2 text-fg font-sans mb-3">
              {page.title || "License"}
            </h1>

            {page.short_description && (
              <p className="text-sm sm:text-base text-fg-secondary font-sans leading-relaxed max-w-2xl mt-2">
                {page.short_description}
              </p>
            )}
          </header>

          {/* Body Content */}
          <div className="relative z-10">
            {cleanContent ? (
              <div
                className="whitespace-normal break-words text-fg/90 text-sm sm:text-base leading-relaxed [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_li]:mb-1.5 [&_h1]:text-2xl sm:[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:text-fg [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-fg [&_h3]:text-lg sm:[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-fg [&_a]:text-action [&_a]:underline hover:[&_a]:text-action-hover [&_blockquote]:border-l-2 [&_blockquote]:border-action [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:border [&_th]:border-white/10 [&_th]:p-2.5 [&_td]:border [&_td]:border-white/10 [&_td]:p-2.5 [&_.icon]:inline-flex [&_.icon]:items-center [&_.icon]:gap-1 [&_.icon]:align-middle [&_.icon]:mx-1 [&_.icon_img]:w-5 [&_.icon_img]:h-5 [&_.icon_img]:inline-block [&_.icon_img]:align-middle [&_.icon_img]:my-0 [&_img[src*='license']]:w-5 [&_img[src*='license']]:h-5 [&_img[src*='license']]:inline-block [&_img[src*='license']]:align-middle [&_img[src*='license']]:my-0 [&_img[src*='cc-']]:w-5 [&_img[src*='cc-']]:h-5 [&_img[src*='cc-']]:inline-block [&_img[src*='cc-']]:align-middle [&_img[src*='cc-']]:my-0"
                dangerouslySetInnerHTML={{ __html: cleanContent }}
              />
            ) : (
              <div className="text-center py-12 text-fg-secondary font-mono text-sm">
                No license content available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import getData from "@/utils/getData";
import { sanitizeHtml } from "@/utils/sanitizeHtml";
import { notFound } from "next/navigation";
import React from "react";
import { buildPageMetadata, cleanText } from "@/utils/seo";
import { notFoundMeta } from "@/utils/validateSlug";

export async function generateMetadata({ params }) {
  const { pageName } = await params;
  const pageId = pageName?.split("-").pop();
  if (!pageId || isNaN(Number(pageId))) return notFoundMeta;

  const footerPage = await getData(`pages/${pageId}`);
  if (!footerPage?.data) return notFoundMeta;

  const page = footerPage.data;
  const title =
    cleanText(page.meta_title, 200) ||
    cleanText(page.title || page.name, 150) ||
    "SketchShaper Page";
  const description =
    cleanText(page.meta_description, 160) ||
    cleanText(page.short_description || page.content, 160);
  const canonicalSlug = page.slug && page.id ? `${page.slug}-${page.id}` : pageName;

  return {
    ...buildPageMetadata({
      title,
      description,
      pathname: `/pages/${canonicalSlug}`,
      image: page.cover,
      imageAlt: title,
      noIndex: !description,
    }),
    keywords: cleanText(page.keywords, 300) || undefined,
  };
}

const Page = async ({ params }) => {
  const { pageName } = await params;
  const pageId = pageName?.split("-").pop();

  if (!pageId || isNaN(Number(pageId))) {
    notFound();
  }

  const footerPage = await getData(`pages/${pageId}`);

  if (!footerPage?.data) {
    notFound();
  }

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          {footerPage.data.title || footerPage.data.name}
        </h1>
        {footerPage?.data?.content && (
          <div
            className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(footerPage.data.content) }}
          />
        )}
      </div>
    </div>
  );
};

export default Page;

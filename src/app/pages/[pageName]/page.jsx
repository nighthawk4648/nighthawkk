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
    "Sketch shaper Page";
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
    <div className="w-full min-h-[70vh] text-fg font-sans py-8 sm:py-12 px-4 md:px-[0.5in]">
      <div className="max-w-4xl mx-auto bg-surface/30 backdrop-blur-2xl rounded-panel border border-white/[0.08] p-6 sm:p-10 lg:p-12 shadow-2xl shadow-black/40">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight-h2 text-fg pb-6 mb-8 border-b border-white/[0.08]">
          {footerPage.data.title || footerPage.data.name}
        </h1>
        {footerPage?.data?.content && (
          <div
            className="break-words text-fg/90 text-sm sm:text-base leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_li]:mb-1.5 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-fg [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-fg [&_a]:text-action [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(footerPage.data.content) }}
          />
        )}
      </div>
    </div>
  );
};

export default Page;

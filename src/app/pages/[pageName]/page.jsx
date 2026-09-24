import getData from "@/utils/getData";
import { stripHtml } from "@/utils/sanitizeHtml";
import { notFound } from "next/navigation";
import React from "react";

export async function generateMetadata({ params }) {
  const { pageName } = params;
  const pageId = pageName?.split("-").pop();
  if (!pageId || isNaN(Number(pageId))) {
    return { title: "Page Not Found - SketchShaper" };
  }

  const footerPage = await getData(`pages/${pageId}`);
  if (!footerPage?.data) {
    return { title: "Page Not Found - SketchShaper" };
  }

  const cleanDescription = footerPage.data.meta_description
    ? stripHtml(footerPage.data.meta_description, 160)
    : "";

  return {
    title:
      footerPage.data.meta_title?.trim() ||
      `${footerPage.data.title || footerPage.data.name || "Page"} - SketchShaper`,
    description: cleanDescription || "SketchShaper custom page",
    keywords: footerPage.data.keywords?.trim() || undefined,
  };
}

const Page = async ({ params }) => {
  const { pageName } = params;
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
            dangerouslySetInnerHTML={{ __html: footerPage.data.content }}
          />
        )}
      </div>
    </div>
  );
};

export default Page;

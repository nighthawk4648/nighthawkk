import BlogsPage from "./BlogsPage";
import { notFound } from "next/navigation";
import getData from "@/utils/getData";
import { buildPageMetadata } from "@/utils/seo";
import { parsePageParam } from "@/utils/catalogPagination";
import { JsonLd, generateBreadcrumbSchema, ORG_REF } from "@/utils/schema";

export async function generateMetadata({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  return buildPageMetadata({
    title: "Articles & Knowledge Base",
    description:
      "Stay informed with curated architectural 3D workflows, PBR texturing guides, lighting breakdowns, rendering tips, and SketchUp tutorials.",
    pathname: "/blog",
    searchParams: resolvedSearchParams,
    preservePage: true,
  });
}

const blogListingSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Sketch shaper Articles & Knowledge Base",
  url: "https://www.sketchshaper.com/blog",
  description:
    "Curated architectural 3D workflows, PBR texturing guides, lighting breakdowns, rendering tips, and SketchUp tutorials.",
  publisher: ORG_REF,
};

const breadcrumbsSchema = generateBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Articles", url: "/blog" },
]);

export default async function Page({ searchParams }) {
  const page = parsePageParam((await searchParams)?.page);
  let initialData = null;
  let fetched = false;
  try {
    const res = await getData(`blogs/pages?page=${page}&limit=10&order=desc`);
    fetched = true;
    if (res?.data?.result) {
      initialData = {
        result: res.data.result,
        pagination: res.data.pagination || {
          total: res.data.result.length,
          totalPage: 1,
          currentPage: page,
        },
      };
    }
  } catch (err) {
    console.error("Error prefetching blogs:", err);
  }

  // A page past the end is a 404; a backend failure is not
  if (
    page > 1 &&
    fetched &&
    (!initialData?.result.length || page > initialData.pagination.totalPage)
  ) {
    notFound();
  }

  return (
    <>
      <JsonLd data={blogListingSchema} />
      <JsonLd data={breadcrumbsSchema} />
      <BlogsPage initialData={initialData} />
    </>
  );
}

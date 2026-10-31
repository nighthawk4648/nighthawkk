import BlogsPage from "./BlogsPage";
import getData from "@/utils/getData";
import { buildPageMetadata } from "@/utils/seo";
import { JsonLd, generateBreadcrumbSchema } from "@/utils/schema";

export const metadata = buildPageMetadata({
  title: "Articles & Knowledge Base",
  description:
    "Stay informed with curated architectural 3D workflows, PBR texturing guides, lighting breakdowns, rendering tips, and SketchUp tutorials.",
  pathname: "/blog",
});

const blogListingSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "SketchShaper Articles & Knowledge Base",
  url: "https://www.sketchshaper.com/blog",
  description:
    "Curated architectural 3D workflows, PBR texturing guides, lighting breakdowns, rendering tips, and SketchUp tutorials.",
  publisher: {
    "@type": "Organization",
    name: "SketchShaper",
    url: "https://www.sketchshaper.com",
    logo: "https://www.sketchshaper.com/assets/navbar/navbar_logo.png",
  },
};

const breadcrumbsSchema = generateBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Articles", url: "/blog" },
]);

export default async function Page() {
  let initialData = null;
  try {
    const res = await getData("blogs/pages?page=1&limit=10&order=desc");
    if (res?.data?.result) {
      initialData = {
        result: res.data.result,
        pagination: res.data.pagination || {
          total: res.data.result.length,
          totalPage: 1,
          currentPage: 1,
        },
      };
    }
  } catch (err) {
    console.error("Error prefetching blogs:", err);
  }

  return (
    <>
      <JsonLd data={blogListingSchema} />
      <JsonLd data={breadcrumbsSchema} />
      <BlogsPage initialData={initialData} />
    </>
  );
}

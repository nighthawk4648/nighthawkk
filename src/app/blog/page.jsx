import BlogsPage from "./BlogsPage";
import getData from "@/utils/getData";

export const metadata = {
  title: "Articles & Knowledge Base - SketchShaper",
  description:
    "Stay informed with curated architectural 3D workflows, PBR texturing guides, lighting breakdowns, rendering tips, and SketchUp tutorials.",
  openGraph: {
    title: "Articles & Knowledge Base - SketchShaper",
    description:
      "Stay informed with curated architectural 3D workflows, PBR texturing guides, lighting breakdowns, rendering tips, and SketchUp tutorials.",
    url: "https://www.sketchshaper.com/blog",
    type: "website",
    siteName: "SketchShaper",
  },
  twitter: {
    card: "summary",
    title: "Articles & Knowledge Base - SketchShaper",
    description:
      "Stay informed with curated architectural 3D workflows, PBR texturing guides, lighting breakdowns, rendering tips, and SketchUp tutorials.",
  },
};

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

  return <BlogsPage initialData={initialData} />;
}

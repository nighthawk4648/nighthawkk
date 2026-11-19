import React from "react";

import { Gallery } from "../../components/Gallery/Gallery";
import getData from "@/utils/getData";
import { buildPageMetadata } from "@/utils/seo";

export const metadata = buildPageMetadata({
  title: "Render Gallery",
  description: "Artwork submitted by creators using Sketch shaper assets.",
  pathname: "/gallery",
});

const Page = async () => {
  // First 12 pictures come with the page (more load on scroll); if this fails the page fetches them itself
  let initialData = null;
  try {
    const res = await getData("gallery/pages?page=1&limit=12&order=desc");
    if (res?.data?.result) initialData = { result: res.data.result, pagination: res.data.pagination };
  } catch (err) {
    console.error("Error prefetching gallery:", err);
  }
  return <Gallery initialData={initialData} />;
};

export default Page;

import React from "react";

import { Gallery } from "../../components/Gallery/Gallery";
import { buildPageMetadata } from "@/utils/seo";

export const metadata = buildPageMetadata({
  title: "Render Gallery",
  description: "Artwork submitted by creators using SketchShaper assets.",
  pathname: "/gallery",
});

const Page = () => {
  return <Gallery />;
};

export default Page;

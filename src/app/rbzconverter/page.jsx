import React from "react";
import RbzConverterClient from "./RbzConverterClient";
import { buildPageMetadata } from "@/utils/seo";

export const metadata = buildPageMetadata({
  title: "ZIP to RBZ Converter for SketchUp",
  description:
    "Convert .zip archives into SketchUp extension packages (.rbz) instantly with this free online tool.",
  pathname: "/rbzconverter",
});

export default function RbzConverterPage() {
  return (
    <div className="min-h-screen bg-canvas text-fg py-12 sm:py-16 px-4 md:px-[0.5in]">
      <RbzConverterClient />
    </div>
  );
}

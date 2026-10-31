import React from "react";
import RbzConverterClient from "./RbzConverterClient";
import { buildPageMetadata } from "@/utils/seo";
import {
  JsonLd,
  generateSoftwareAppSchema,
  generateBreadcrumbSchema,
} from "@/utils/schema";

export const metadata = buildPageMetadata({
  title: "ZIP to RBZ Converter for SketchUp",
  description:
    "Convert .zip archives into SketchUp extension packages (.rbz) instantly with this free online tool.",
  pathname: "/rbzconverter",
});

const converterSchema = generateSoftwareAppSchema({
  name: "ZIP to RBZ Converter for SketchUp",
  description:
    "Convert .zip archives into SketchUp extension packages (.rbz) instantly with this free client-safe online tool.",
  pathname: "/rbzconverter",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any (Web Browser)",
  fileFormat: ".rbz",
  isFree: true,
});

const breadcrumbsSchema = generateBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "RBZ Converter", url: "/rbzconverter" },
]);

export default function RbzConverterPage() {
  return (
    <div className="min-h-screen bg-canvas text-fg py-12 sm:py-16 px-4 md:px-[0.5in]">
      <JsonLd data={converterSchema} />
      <JsonLd data={breadcrumbsSchema} />
      <RbzConverterClient />
    </div>
  );
}

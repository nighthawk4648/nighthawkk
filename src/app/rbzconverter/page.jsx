import React from "react";
import RbzConverterClient from "./RbzConverterClient";

export const metadata = {
  title: "ZIP to RBZ Converter for SketchUp - Free Online Tool | SketchShaper",
  description:
    "Convert .zip archives into SketchUp extension packages (.rbz) instantly. Free, client-safe packaging tool for SketchUp plugin developers and users.",
  alternates: {
    canonical: "https://www.sketchshaper.com/rbzconverter",
  },
  openGraph: {
    title: "ZIP to RBZ Converter for SketchUp | SketchShaper",
    description:
      "Convert .zip archives into SketchUp extension packages (.rbz) instantly. Free online packaging tool.",
    url: "https://www.sketchshaper.com/rbzconverter",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RbzConverterPage() {
  return (
    <div className="min-h-screen bg-canvas text-fg py-12 sm:py-16 px-4 md:px-[0.5in]">
      <RbzConverterClient />
    </div>
  );
}

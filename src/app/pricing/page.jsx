import React from "react";
import PricingClient from "@/components/Pricing/PricingClient";
import { buildPageMetadata } from "@/utils/seo";
import { JsonLd, generateBreadcrumbSchema } from "@/utils/schema";

export const metadata = buildPageMetadata({
  title: "Pricing: PRO Models & Ad-free Plans",
  description:
    "Free 3D models stay free. Choose a monthly or yearly Sketch shaper plan to unlock PRO SketchUp models, the PRO extension and an ad-free website.",
  pathname: "/pricing",
});

export default function PricingPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Pricing", url: "/pricing" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <PricingClient />
    </>
  );
}

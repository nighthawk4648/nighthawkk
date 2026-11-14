import React from "react";
import ContactPageClient from "@/components/Contact/ContactPageClient";
import { buildPageMetadata } from "@/utils/seo";
import { JsonLd, generateBreadcrumbSchema } from "@/utils/schema";

export const metadata = buildPageMetadata({
  title: "Commission Custom 3D & Architectural Projects",
  description:
    "Request custom 3D modeling, full interior design & exterior architectural scenes, SketchUp plugins, and realistic PBR material sets directly from the Sketch shaper studio.",
  pathname: "/contact",
});

const contactPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": "https://www.sketchshaper.com/contact#webpage",
      url: "https://www.sketchshaper.com/contact",
      name: "Commission Custom 3D & Architectural Projects - Sketch shaper",
      description:
        "Request custom 3D modeling, full interior design & exterior architectural scenes, SketchUp plugins, and realistic PBR material sets directly from the Sketch shaper studio.",
      mainEntity: {
        "@type": "Organization",
        name: "Sketch shaper",
        url: "https://www.sketchshaper.com",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Support & Studio Commissions",
          email: "desk@sketchshaper.com",
          telephone: "+8801956274648",
          availableLanguage: ["English", "Bengali"],
        },
      },
    },
  ],
};

export default function ContactPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Contact & Studio Commission", url: "/contact" },
  ]);

  return (
    <>
      <JsonLd data={contactPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ContactPageClient />
    </>
  );
}


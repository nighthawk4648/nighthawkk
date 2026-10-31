import React from "react";
import { cleanText } from "./seo.js";
import { getOriginalImageUrl } from "./cloudinary.js";

const SITE_URL = "https://www.sketchshaper.com";
const DEFAULT_LOGO = `${SITE_URL}/assets/navbar/navbar_logo.png`;

/**
 * Escapes unsafe HTML characters to prevent XSS in embedded JSON-LD scripts
 */
export function serializeJsonLd(data) {
  if (!data) return "";
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * React Component for injecting secure JSON-LD script tags
 */
export function JsonLd({ data }) {
  if (!data) return null;
  return React.createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: serializeJsonLd(data) },
  });
}

/**
 * Generates Schema.org BreadcrumbList
 * @param {Array<{name: string, url: string}>} items
 */
export function generateBreadcrumbSchema(items = []) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const rawUrl = item.url || "/";
      const fullUrl = rawUrl.startsWith("http")
        ? rawUrl
        : `${SITE_URL}${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`;

      return {
        "@type": "ListItem",
        position: index + 1,
        name: cleanText(item.name, 100) || `Step ${index + 1}`,
        item: fullUrl,
      };
    }),
  };
}

/**
 * Generates Schema.org WebSite with SearchAction + Organization
 */
export function generateWebsiteAndOrgSchema(socialUrls = []) {
  const defaultSocials = [
    "https://www.facebook.com/sketchshaper",
    "https://twitter.com/sketchshaper",
    "https://www.instagram.com/sketchshaper",
    "https://www.youtube.com/@sketchshaper",
  ];

  const sameAs =
    Array.isArray(socialUrls) && socialUrls.length > 0
      ? socialUrls.filter((url) => typeof url === "string" && url.startsWith("http"))
      : defaultSocials;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "SketchShaper",
        url: SITE_URL,
        description: "Free & Pro 3D Models, Textures, and Plugins for SketchUp",
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/api/assets/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "SketchShaper",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: DEFAULT_LOGO,
          width: 512,
          height: 512,
        },
        sameAs,
      },
    ],
  };
}

/**
 * Generates Schema.org Product & 3DModel for an asset
 */
export function generateAssetSchema(asset, { category, subCategory, pathname }) {
  if (!asset) return null;

  const fullPathname = pathname || "";
  const canonicalUrl = `${SITE_URL}${fullPathname.startsWith("/") ? fullPathname : `/${fullPathname}`}`;

  const toAbsoluteUrl = (url) => {
    if (!url || typeof url !== "string") return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
  };

  const images = [];
  if (asset.cover) {
    const coverUrl = toAbsoluteUrl(getOriginalImageUrl(asset.cover));
    if (coverUrl) images.push(coverUrl);
  }
  if (Array.isArray(asset.images)) {
    asset.images.forEach((imgObj) => {
      const imgUrl = imgObj?.image
        ? toAbsoluteUrl(getOriginalImageUrl(imgObj.image))
        : null;
      if (imgUrl && !images.includes(imgUrl)) {
        images.push(imgUrl);
      }
    });
  }

  const isFree = asset.access_type !== "paid";
  const catName = category?.name || "3D Models";
  const subName = subCategory?.name || "Assets";
  const title = cleanText(asset.name, 150) || "SketchUp 3D Model";
  const description =
    cleanText(asset.short_description, 200) ||
    `Download ${title} for SketchUp with clean quad geometry and calibrated PBR textures.`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description,
    image: images.length > 0 ? images : [`${SITE_URL}/assets/seo/social-card.png`],
    category: `${catName} > ${subName}`,
    brand: {
      "@type": "Brand",
      name: "SketchShaper",
    },
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      price: isFree ? "0" : "5.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Compatibility",
        value: "SketchUp 2022-2026",
      },
      {
        "@type": "PropertyValue",
        name: "Geometry",
        value: "Clean Quad Topology, 100% Human-Made",
      },
      ...(asset.resolution
        ? [
            {
              "@type": "PropertyValue",
              name: "Resolution",
              value: asset.resolution,
            },
          ]
        : []),
    ],
  };
}

/**
 * Generates Schema.org WebApplication or SoftwareApplication
 */
export function generateSoftwareAppSchema({
  name,
  description,
  pathname = "/",
  applicationCategory = "DesignApplication",
  operatingSystem = "Windows 10/11 64-bit, macOS 12+",
  softwareVersion = "1.5.0",
  fileFormat,
  downloadUrl,
  image = DEFAULT_LOGO,
  isFree = true,
}) {
  const fullUrl = `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: cleanText(name, 150),
    url: fullUrl,
    description: cleanText(description, 250),
    applicationCategory,
    operatingSystem,
    softwareVersion,
    ...(fileFormat ? { fileFormat } : {}),
    ...(downloadUrl ? { downloadUrl } : {}),
    image,
    publisher: {
      "@type": "Organization",
      name: "SketchShaper",
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      price: isFree ? "0" : "9.99",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };
}

/**
 * Generates Schema.org WebPage
 */
export function generateWebPageSchema({ title, description, pathname = "/" }) {
  const fullUrl = `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: cleanText(title, 150),
    description: cleanText(description, 250),
    url: fullUrl,
    publisher: {
      "@type": "Organization",
      name: "SketchShaper",
      url: SITE_URL,
    },
  };
}

/**
 * Generates Schema.org CollectionPage
 */
export function generateCollectionSchema({ name, description, pathname = "/" }) {
  const fullUrl = `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: cleanText(name, 150),
    description: cleanText(description, 250),
    url: fullUrl,
  };
}



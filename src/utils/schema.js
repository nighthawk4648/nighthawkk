import React from "react";
import { cleanText } from "./seo.js";
import { getOriginalImageUrl } from "./imageUrl.js";
import { EXTENSION_VERSION } from "./constants.js";
import { PLANS, yearlyPrice } from "./pricing.js";

const SITE_URL = "https://www.sketchshaper.com";
const DEFAULT_LOGO = `${SITE_URL}/assets/navbar/navbar_logo.png`;
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

// Other schemas point at the Organization / WebSite nodes the layout renders on every page
export const ORG_REF = { "@id": ORG_ID };
export const WEBSITE_REF = { "@id": WEBSITE_ID };

const OFFER_AVAILABILITY = "https://schema.org/InStock";

// Offers stay valid until the end of next year
export function priceValidUntil(now = new Date()) {
  return `${now.getUTCFullYear() + 1}-12-31`;
}

const absoluteUrl = (url) =>
  url.startsWith("http") ? url : `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;

// Price per one month (MON) or one year (ANN)
const recurringPrice = (price, unitCode) => ({
  "@type": "UnitPriceSpecification",
  price,
  priceCurrency: "USD",
  referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode },
});

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
 * Generates Schema.org WebSite + Organization
 */
export function generateWebsiteAndOrgSchema(socialUrls = [], { description } = {}) {
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
        "@id": WEBSITE_ID,
        name: "Sketch shaper",
        url: SITE_URL,
        description: "Free & Pro 3D Models, Textures, and Plugins for SketchUp",
        publisher: ORG_REF,
      },
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: "Sketch shaper",
        url: SITE_URL,
        ...(description && { description }),
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          url: `${SITE_URL}/contact`,
        },
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
  const proMonthlyPrice = Math.min(
    ...PLANS.filter((p) => p.id === "pro" || p.id === "sponsor").map((p) => p.monthly),
  );
  const catName = category?.name || "3D Models";
  const subName = subCategory?.name || "Assets";
  const title = cleanText(asset.name, 150) || "SketchUp 3D Model";
  const description =
    cleanText(asset.short_description, 200) ||
    `Download ${title} for SketchUp with clean quad geometry and calibrated PBR textures.`;

  return {
    "@context": "https://schema.org",
    "@type": ["Product", "3DModel"],
    name: title,
    description,
    image: images.length > 0 ? images : [`${SITE_URL}/assets/seo/social-card.png`],
    category: `${catName} > ${subName}`,
    brand: {
      "@type": "Brand",
      name: "Sketch shaper",
    },
    publisher: ORG_REF,
    encodingFormat: "application/vnd.sketchup.skp",
    isAccessibleForFree: isFree,
    license: `${SITE_URL}/license`,
    // PRO models have no per-model price: they come with a membership, so the offer points at the cheapest plan that includes them
    offers: isFree
      ? {
          "@type": "Offer",
          url: canonicalUrl,
          price: "0",
          priceCurrency: "USD",
          availability: OFFER_AVAILABILITY,
          priceValidUntil: priceValidUntil(),
          itemCondition: "https://schema.org/NewCondition",
        }
      : {
          "@type": "Offer",
          url: `${SITE_URL}/pricing`,
          price: String(proMonthlyPrice),
          priceCurrency: "USD",
          availability: OFFER_AVAILABILITY,
          priceValidUntil: priceValidUntil(),
          priceSpecification: recurringPrice(proMonthlyPrice, "MON"),
          description: "Included with a Sketch shaper PRO membership",
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
  softwareVersion = EXTENSION_VERSION,
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
    publisher: ORG_REF,
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
    publisher: ORG_REF,
    isPartOf: WEBSITE_REF,
  };
}

/**
 * Generates Schema.org CollectionPage
 */
export function generateCollectionSchema({ name, description, pathname = "/", items = [] }) {
  const fullUrl = `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: cleanText(name, 150),
    description: cleanText(description, 250),
    url: fullUrl,
    isPartOf: WEBSITE_REF,
    ...(items.length > 0 && {
      mainEntity: {
        "@type": "ItemList",
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: cleanText(it.name, 150),
          url: absoluteUrl(it.url),
        })),
      },
    }),
  };
}

/**
 * Generates one Schema.org Product per membership plan, with a monthly and a yearly offer
 */
export function generatePlanSchemas(plans = []) {
  const offer = (price, unitCode) => ({
    "@type": "Offer",
    url: `${SITE_URL}/pricing`,
    price: String(price),
    priceCurrency: "USD",
    availability: OFFER_AVAILABILITY,
    priceSpecification: recurringPrice(price, unitCode),
  });

  return plans.map((plan) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: plan.name,
    description: plan.features.join(". "),
    brand: { "@type": "Brand", name: "Sketch shaper" },
    offers: [offer(plan.monthly, "MON"), offer(yearlyPrice(plan.monthly), "ANN")],
  }));
}



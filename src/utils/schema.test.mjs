import test from "node:test";
import assert from "node:assert/strict";
import {
  serializeJsonLd,
  generateBreadcrumbSchema,
  generateWebsiteAndOrgSchema,
  generateAssetSchema,
  generateSoftwareAppSchema,
  generateWebPageSchema,
  generateCollectionSchema,
} from "./schema.js";

test("serializeJsonLd escapes '<' to prevent XSS", () => {
  const unsafe = { text: "<script>alert('xss')</script>" };
  const serialized = serializeJsonLd(unsafe);
  assert.ok(!serialized.includes("<script>"));
  assert.ok(serialized.includes("\\u003cscript>"));
});

test("generateBreadcrumbSchema builds valid Schema.org ListItem hierarchy", () => {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Furniture", url: "/furniture-1" },
    { name: "Modern Chair", url: "/furniture-1/chairs-5/chair-10" },
  ]);

  assert.equal(breadcrumbs["@type"], "BreadcrumbList");
  assert.equal(breadcrumbs.itemListElement.length, 3);
  assert.equal(breadcrumbs.itemListElement[0].position, 1);
  assert.equal(breadcrumbs.itemListElement[0].item, "https://www.sketchshaper.com/");
  assert.equal(breadcrumbs.itemListElement[2].name, "Modern Chair");
  assert.equal(
    breadcrumbs.itemListElement[2].item,
    "https://www.sketchshaper.com/furniture-1/chairs-5/chair-10"
  );
});

test("generateWebsiteAndOrgSchema includes Sitelinks SearchAction and Organization logo", () => {
  const schema = generateWebsiteAndOrgSchema(["https://twitter.com/sketchshaper"]);
  assert.equal(schema["@graph"].length, 2);

  const website = schema["@graph"].find((item) => item["@type"] === "WebSite");
  const org = schema["@graph"].find((item) => item["@type"] === "Organization");

  assert.ok(website);
  assert.equal(website.potentialAction["@type"], "SearchAction");
  assert.ok(website.potentialAction.target.urlTemplate.includes("search_term_string"));

  assert.ok(org);
  assert.equal(org.name, "SketchShaper");
  assert.ok(org.logo.url.includes("navbar_logo.png"));
  assert.ok(org.sameAs.includes("https://twitter.com/sketchshaper"));
});

test("generateAssetSchema outputs valid Product structure with free/paid offers and geometry", () => {
  const dummyAsset = {
    name: "Classic Wooden Chair & Table",
    short_description: "High quality <p>3D model</p> for SketchUp &amp; V-Ray",
    cover: "models/chair.jpg",
    images: [{ image: "models/chair-angle2.jpg" }],
    access_type: "free",
    resolution: "4K",
  };

  const productSchema = generateAssetSchema(dummyAsset, {
    category: { name: "Furniture" },
    subCategory: { name: "Chairs" },
    pathname: "/furniture-1/chairs-5/wooden-chair-10",
  });

  assert.equal(productSchema["@type"], "Product");
  assert.equal(productSchema.name, "Classic Wooden Chair & Table");
  assert.ok(!productSchema.description.includes("<p>"));
  assert.ok(productSchema.description.includes("&"));
  assert.equal(productSchema.offers.price, "0");
  assert.equal(productSchema.offers.availability, "https://schema.org/InStock");
  assert.ok(productSchema.image.length >= 2);
  assert.ok(productSchema.image.every((img) => img.startsWith("https://")));
  assert.ok(
    productSchema.additionalProperty.some((p) => p.name === "Geometry" && p.value.includes("100% Human-Made"))
  );
});

test("generateSoftwareAppSchema generates valid application details", () => {
  const appSchema = generateSoftwareAppSchema({
    name: "ZIP to RBZ Converter",
    description: "Convert zip files to rbz",
    pathname: "/rbzconverter",
    fileFormat: ".rbz",
  });

  assert.equal(appSchema["@type"], "SoftwareApplication");
  assert.equal(appSchema.url, "https://www.sketchshaper.com/rbzconverter");
  assert.equal(appSchema.offers.price, "0");
});

test("generateWebPageSchema produces valid WebPage schema with publisher", () => {
  const pageSchema = generateWebPageSchema({
    title: "License Agreement",
    description: "Creative Commons Zero licensing terms.",
    pathname: "/license",
  });

  assert.equal(pageSchema["@type"], "WebPage");
  assert.equal(pageSchema.name, "License Agreement");
  assert.equal(pageSchema.url, "https://www.sketchshaper.com/license");
  assert.equal(pageSchema.publisher.name, "SketchShaper");
});

test("generateCollectionSchema produces valid CollectionPage and sanitizes description", () => {
  const collection = generateCollectionSchema({
    name: "Living Room 3D Models",
    description: "Curated <b>furniture &amp; decor</b> models for SketchUp.",
    pathname: "/living-room-1",
  });

  assert.equal(collection["@type"], "CollectionPage");
  assert.equal(collection.name, "Living Room 3D Models");
  assert.equal(collection.url, "https://www.sketchshaper.com/living-room-1");
  assert.ok(!collection.description.includes("<b>"));
  assert.ok(collection.description.includes("&"));
});



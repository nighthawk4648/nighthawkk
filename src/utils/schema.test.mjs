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
  generatePlanSchemas,
  priceValidUntil,
  ORG_REF,
  WEBSITE_REF,
} from "./schema.js";
import { PLANS, yearlyPrice } from "./pricing.js";

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

test("generateWebsiteAndOrgSchema includes WebSite and Organization logo (no SearchAction: the site has no crawlable search URL)", () => {
  const schema = generateWebsiteAndOrgSchema(["https://twitter.com/sketchshaper"], {
    description: "A SketchUp model library.",
  });
  assert.equal(schema["@graph"].length, 2);

  const website = schema["@graph"].find((item) => item["@type"] === "WebSite");
  const org = schema["@graph"].find((item) => item["@type"] === "Organization");

  assert.ok(website);
  assert.equal(website.potentialAction, undefined);

  assert.ok(org);
  assert.equal(org.name, "Sketch shaper");
  assert.ok(org.logo.url.includes("navbar_logo.png"));
  assert.ok(org.sameAs.includes("https://twitter.com/sketchshaper"));
  assert.equal(org.description, "A SketchUp model library.");
  assert.equal(org.contactPoint.contactType, "customer support");
  assert.equal(org.contactPoint.url, "https://www.sketchshaper.com/contact");
  assert.deepEqual(website.publisher, ORG_REF);
  assert.equal(org["@id"], ORG_REF["@id"]);
  assert.equal(website["@id"], WEBSITE_REF["@id"]);
});

test("generateWebsiteAndOrgSchema leaves the description out when none is given", () => {
  const org = generateWebsiteAndOrgSchema()["@graph"].find((i) => i["@type"] === "Organization");
  assert.equal("description" in org, false);
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

  assert.deepEqual(productSchema["@type"], ["Product", "3DModel"]);
  assert.equal(productSchema.encodingFormat, "application/vnd.sketchup.skp");
  assert.equal(productSchema.isAccessibleForFree, true);
  assert.equal(productSchema.license, "https://www.sketchshaper.com/license");
  assert.deepEqual(productSchema.publisher, ORG_REF);
  assert.equal(productSchema.offers.priceValidUntil, priceValidUntil());
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

test("generateAssetSchema offers PRO models at the cheapest PRO plan price", () => {
  const productSchema = generateAssetSchema(
    { name: "PRO Sofa", access_type: "paid" },
    { pathname: "/models-3/sofa-1/pro-sofa-9" },
  );
  const cheapest = Math.min(...PLANS.filter((p) => p.id === "pro" || p.id === "sponsor").map((p) => p.monthly));
  const { offers } = productSchema;

  assert.equal(cheapest, 5);
  assert.equal(productSchema.isAccessibleForFree, false);
  assert.deepEqual(productSchema["@type"], ["Product", "3DModel"]);
  assert.deepEqual(productSchema.publisher, ORG_REF);
  assert.equal(offers.url, "https://www.sketchshaper.com/pricing");
  assert.equal(offers.price, "5");
  assert.equal(offers.priceCurrency, "USD");
  assert.equal(offers.priceValidUntil, priceValidUntil());
  assert.equal(offers.priceSpecification["@type"], "UnitPriceSpecification");
  assert.equal(offers.priceSpecification.price, 5);
  assert.equal(offers.priceSpecification.referenceQuantity.unitCode, "MON");
  assert.equal(offers.description, "Included with a Sketch shaper PRO membership");
});

test("priceValidUntil is December 31 of next year", () => {
  assert.equal(priceValidUntil(new Date("2026-11-26T10:00:00Z")), "2027-12-31");
  assert.equal(priceValidUntil(), `${new Date().getUTCFullYear() + 1}-12-31`);
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
  assert.deepEqual(appSchema.publisher, ORG_REF);
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
  assert.deepEqual(pageSchema.publisher, ORG_REF);
  assert.deepEqual(pageSchema.isPartOf, WEBSITE_REF);
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

test("generateCollectionSchema lists items as an ItemList with positions and absolute urls", () => {
  const collection = generateCollectionSchema({
    name: "Chairs",
    description: "Chairs",
    pathname: "/furniture-1/chairs-5",
    items: [
      { name: "Wooden <b>Chair</b>", url: "/furniture/chairs/wooden-chair-10" },
      { name: "Sofa", url: "https://www.sketchshaper.com/furniture/chairs/sofa-11" },
    ],
  });

  assert.deepEqual(collection.isPartOf, WEBSITE_REF);
  const list = collection.mainEntity;
  assert.equal(list["@type"], "ItemList");
  assert.equal(list.itemListElement.length, 2);
  assert.equal(list.itemListElement[0].position, 1);
  assert.equal(list.itemListElement[0].name, "Wooden Chair");
  assert.equal(
    list.itemListElement[0].url,
    "https://www.sketchshaper.com/furniture/chairs/wooden-chair-10",
  );
  assert.equal(list.itemListElement[1].position, 2);
  assert.equal(list.itemListElement[1].url, "https://www.sketchshaper.com/furniture/chairs/sofa-11");
});

test("generateCollectionSchema has no mainEntity without items", () => {
  const collection = generateCollectionSchema({ name: "Empty", description: "x", pathname: "/e", items: [] });
  assert.equal(collection.mainEntity, undefined);
});

test("generatePlanSchemas builds a Product per plan with monthly and yearly offers", () => {
  const schemas = generatePlanSchemas(PLANS);
  assert.equal(schemas.length, PLANS.length);

  schemas.forEach((schema, i) => {
    const plan = PLANS[i];
    assert.equal(schema["@type"], "Product");
    assert.equal(schema.name, plan.name);
    assert.equal(schema.description, plan.features.join(". "));
    assert.equal(schema.brand.name, "Sketch shaper");

    const [monthly, yearly] = schema.offers;
    assert.equal(monthly.price, String(plan.monthly));
    assert.equal(monthly.priceSpecification.referenceQuantity.unitCode, "MON");
    assert.equal(yearly.price, String(yearlyPrice(plan.monthly)));
    assert.equal(yearly.priceSpecification.referenceQuantity.unitCode, "ANN");
    for (const offer of schema.offers) {
      assert.equal(offer.url, "https://www.sketchshaper.com/pricing");
      assert.equal(offer.priceCurrency, "USD");
      assert.equal(offer.availability, "https://schema.org/InStock");
    }
  });
});

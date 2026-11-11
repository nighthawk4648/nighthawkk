// Single place for cache rules: how long backend data is cached and which tags it gets.
// Tag names must match what the backend purges (nighthawk-server-mysql_version/src/modules/*/*.controller.mjs).

export const TTL = {
  short: 300, // 5 min: assets, blogs and anything that changes often
  long: 3600, // 1 hour: structural data
};

// Endpoints whose data changes rarely
const LONG_LIVED = [
  "categories",
  "categories/nav",
  "sub-categories",
  "social",
  "pages",
  "supportedby",
  "innovative",
  "sliders",
];

// "<resource>/<id>" also gets a per-item tag, e.g. assets/15 -> asset-15
const ITEM_TAG_PREFIX = {
  assets: "asset",
  categories: "category",
  "sub-categories": "subcategory",
  blogs: "blog",
};

export function ttlFor(path) {
  if (!path || typeof path !== "string") return TTL.short;
  const clean = path.split("?")[0].toLowerCase();
  return LONG_LIVED.includes(clean) || clean.startsWith("general/")
    ? TTL.long
    : TTL.short;
}

export function tagsFor(path) {
  if (!path || typeof path !== "string") return ["general"];
  // The nav tree has its own tag: asset create/delete/move purge just it, not all category data
  if (path.split("?")[0] === "categories/nav") return ["categories", "nav"];
  const [resource = "general", item] = path.split("?")[0].split("/").filter(Boolean);
  const prefix = ITEM_TAG_PREFIX[resource];
  if (!prefix || !item) return [resource];
  // Numeric ids only, except blogs, which also accept slugs
  return resource === "blogs" || !isNaN(Number(item))
    ? [resource, `${prefix}-${item}`]
    : [resource];
}

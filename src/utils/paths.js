import slugify from "./slugify.js";

// Canonical URL paths. Assets have their own builder in buildAssetPath.js.
export const categoryPath = (cat) => `/${cat.slug || slugify(cat.name)}-${cat.id}`;

export const subCategoryPath = (cat, sub) =>
  `${categoryPath(cat)}/${sub.slug || slugify(sub.name)}-${sub.id}`;

export const blogPath = (blog) => `/blog/${blog.slug || slugify(blog.title)}-${blog.id}`;

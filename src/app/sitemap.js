import getData from "@/utils/getData";
import slugify from "@/utils/slugify";

// Revalidate sitemap dynamically every 1 hour
export const revalidate = 3600;

function parseDate(dateValue, fallback) {
  if (!dateValue) return fallback;
  const d = new Date(dateValue);
  return isNaN(d.getTime()) ? fallback : d;
}

export default async function sitemap() {
  const baseUrl = "https://www.sketchshaper.com";
  const now = new Date();

  // Core static pages
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/extension`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/license`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Fetch dynamic content in parallel with resilient fallbacks
  const [categoriesRes, subCategoriesRes, assetsRes, blogsRes, pagesRes] =
    await Promise.allSettled([
      getData("categories", { next: { revalidate: 3600 } }),
      getData("sub-categories", { next: { revalidate: 3600 } }),
      getData("assets", { next: { revalidate: 3600 } }),
      getData("blogs", { next: { revalidate: 3600 } }),
      getData("pages", { next: { revalidate: 3600 } }),
    ]);

  const categories =
    categoriesRes.status === "fulfilled" && categoriesRes.value?.data
      ? categoriesRes.value.data
      : [];
  const subCategories =
    subCategoriesRes.status === "fulfilled" && subCategoriesRes.value?.data
      ? subCategoriesRes.value.data
      : [];
  const assets =
    assetsRes.status === "fulfilled" && assetsRes.value?.data
      ? assetsRes.value.data
      : [];
  const blogs =
    blogsRes.status === "fulfilled" && blogsRes.value?.data
      ? blogsRes.value.data
      : [];
  const pages =
    pagesRes.status === "fulfilled" && pagesRes.value?.data
      ? pagesRes.value.data
      : [];

  // Lookup maps for fast and accurate hierarchy traversal
  const categoryMap = new Map();
  for (const cat of categories) {
    if (cat?.id) categoryMap.set(cat.id, cat);
  }

  const subCategoryMap = new Map();
  for (const sub of subCategories) {
    if (sub?.id) subCategoryMap.set(sub.id, sub);
  }

  const dynamicRoutes = [];

  // 1. Categories: /category-slug-{id}
  for (const cat of categories) {
    if (!cat?.name || !cat?.id) continue;
    dynamicRoutes.push({
      url: `${baseUrl}/${slugify(cat.name)}-${cat.id}`,
      lastModified: parseDate(cat.updated_at || cat.created_at, now),
      changeFrequency: "daily",
      priority: 0.9,
    });
  }

  // 2. SubCategories: /category-slug-{id}/subcategory-slug-{id}
  for (const sub of subCategories) {
    if (!sub?.name || !sub?.id) continue;
    const parentCategory = sub.category || categoryMap.get(sub.category_id);
    if (!parentCategory?.name) continue;

    dynamicRoutes.push({
      url: `${baseUrl}/${slugify(parentCategory.name)}-${parentCategory.id}/${slugify(sub.name)}-${sub.id}`,
      lastModified: parseDate(sub.updated_at || sub.created_at, now),
      changeFrequency: "daily",
      priority: 0.85,
    });
  }

  // 3. Assets: /category-slug/subcategory-slug/asset-slug-{id}
  for (const asset of assets) {
    if (!asset?.name || !asset?.id) continue;
    const sub = subCategoryMap.get(asset.sub_category_id) || asset.sub_category;
    const cat =
      sub?.category || (sub ? categoryMap.get(sub.category_id) : null);
    if (!cat?.name || !sub?.name) continue;

    dynamicRoutes.push({
      url: `${baseUrl}/${slugify(cat.name)}/${slugify(sub.name)}/${slugify(asset.name)}-${asset.id}`,
      lastModified: parseDate(asset.updated_at || asset.created_at, now),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  // 4. Blogs: /blog/blog-slug-{id}
  for (const blog of blogs) {
    if (!blog?.title || !blog?.id) continue;
    dynamicRoutes.push({
      url: `${baseUrl}/blog/${slugify(blog.title)}-${blog.id}`,
      lastModified: parseDate(blog.updated_at || blog.created_at, now),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // 5. Custom Dynamic Pages: /pages/page-slug-{id}
  const reservedSlugs = new Set([
    "about-us",
    "license",
    "privacy",
    "terms-and-conditions",
    "blogs",
  ]);
  for (const page of pages) {
    if (!page?.slug || !page?.id) continue;
    if (reservedSlugs.has(page.slug)) continue;

    dynamicRoutes.push({
      url: `${baseUrl}/pages/${page.slug}-${page.id}`,
      lastModified: parseDate(page.updated_at || page.created_at, now),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // Deduplicate all entries by URL
  const seenUrls = new Set();
  const allRoutes = [...staticRoutes, ...dynamicRoutes].filter((entry) => {
    if (seenUrls.has(entry.url)) return false;
    seenUrls.add(entry.url);
    return true;
  });

  return allRoutes;
}

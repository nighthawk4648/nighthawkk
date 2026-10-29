import getData from "@/utils/getData";
import slugify from "@/utils/slugify";
import { cleanText } from "@/utils/seo";

// Revalidate sitemap dynamically every 24 hours
export const revalidate = 86400;

function parseDate(dateValue, fallback) {
  if (!dateValue) return fallback;
  const d = new Date(dateValue);
  return isNaN(d.getTime()) ? fallback : d;
}

function toAbsoluteImageUrl(imagePath) {
  if (!imagePath || typeof imagePath !== "string") return null;
  const trimmed = imagePath.trim();
  if (!trimmed || trimmed === "-") return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const base =
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE ||
    "https://api.sketchshaper.com/api/uploads/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const cleanPath = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
  return `${normalizedBase}${cleanPath}`;
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
      url: `${baseUrl}/rbzconverter`,
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
      getData("categories", { next: { revalidate: 86400 } }),
      getData("sub-categories", { next: { revalidate: 86400 } }),
      getData("assets", { timeout: 60000, next: { revalidate: 86400 } }),
      getData("blogs", { next: { revalidate: 86400 } }),
      getData("pages", { next: { revalidate: 86400 } }),
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
    const catImage = toAbsoluteImageUrl(cat.image);
    dynamicRoutes.push({
      url: `${baseUrl}/${slugify(cat.name)}-${cat.id}`,
      lastModified: parseDate(cat.updated_at || cat.created_at, now),
      changeFrequency: "daily",
      priority: 0.9,
      images: catImage ? [catImage] : undefined,
    });
  }

  // 2. SubCategories: /category-slug-{id}/subcategory-slug-{id}
  for (const sub of subCategories) {
    if (!sub?.name || !sub?.id) continue;
    const parentCategory = sub.category || categoryMap.get(sub.category_id);
    if (!parentCategory?.name) continue;

    const subImage = toAbsoluteImageUrl(sub.image);
    dynamicRoutes.push({
      url: `${baseUrl}/${slugify(parentCategory.name)}-${parentCategory.id}/${slugify(sub.name)}-${sub.id}`,
      lastModified: parseDate(sub.updated_at || sub.created_at, now),
      changeFrequency: "daily",
      priority: 0.85,
      images: subImage ? [subImage] : undefined,
    });
  }

  // 3. Assets: /category-slug/subcategory-slug/asset-slug-{id}
  for (const asset of assets) {
    if (!asset?.name || !asset?.id) continue;
    const sub = subCategoryMap.get(asset.sub_category_id) || asset.sub_category;
    const cat =
      sub?.category || (sub ? categoryMap.get(sub.category_id) : null);
    if (!cat?.name || !sub?.name) continue;

    const assetImages = [];
    const coverImg = toAbsoluteImageUrl(asset.cover);
    if (coverImg) assetImages.push(coverImg);

    if (Array.isArray(asset.images)) {
      for (const imgItem of asset.images) {
        const extraImg = toAbsoluteImageUrl(imgItem?.image);
        if (extraImg && !assetImages.includes(extraImg)) {
          assetImages.push(extraImg);
        }
      }
    }

    dynamicRoutes.push({
      url: `${baseUrl}/${slugify(cat.name)}-${cat.id}/${slugify(sub.name)}-${sub.id}/${slugify(asset.name)}-${asset.id}`,
      lastModified: parseDate(asset.updated_at || asset.created_at, now),
      changeFrequency: "weekly",
      priority: 0.9,
      images: assetImages.length > 0 ? assetImages : undefined,
    });
  }

  // 4. Blogs: /blog/blog-slug-{id}
  for (const blog of blogs) {
    if (!blog?.title || !blog?.id) continue;

    const blogImages = [];
    const mainImg = toAbsoluteImageUrl(blog.image);
    if (mainImg) blogImages.push(mainImg);
    const bgImg = toAbsoluteImageUrl(blog.bgImage);
    if (bgImg && !blogImages.includes(bgImg)) blogImages.push(bgImg);

    dynamicRoutes.push({
      url: `${baseUrl}/blog/${slugify(blog.title)}-${blog.id}`,
      lastModified: parseDate(blog.updated_at || blog.created_at, now),
      changeFrequency: "weekly",
      priority: 0.8,
      images: blogImages.length > 0 ? blogImages : undefined,
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
    if (
      !cleanText(page.meta_description, 160) &&
      !cleanText(page.short_description, 160) &&
      !cleanText(page.content, 160)
    ) {
      continue;
    }

    const pageCover = toAbsoluteImageUrl(page.cover);
    dynamicRoutes.push({
      url: `${baseUrl}/pages/${page.slug}-${page.id}`,
      lastModified: parseDate(page.updated_at || page.created_at, now),
      changeFrequency: "monthly",
      priority: 0.6,
      images: pageCover ? [pageCover] : undefined,
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

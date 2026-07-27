import getData from '@/utils/getData';
import slugify from '@/utils/slugify';

const formatDate = (dateStr) => {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date().toISOString().split('T')[0] : d.toISOString().split('T')[0];
};

export default async function sitemap() {
  const baseUrl = 'https://www.sketchshaper.com';

  // Core static pages
  const staticRoutes = [
    '',
    '/pro',
    '/extension',
    '/about-us',
    '/blog',
    '/gallery',
    '/privacy',
    '/terms-and-conditions',
    '/license',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: formatDate(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    const [categoriesRes, subCategoriesRes, blogsRes, assetsRes] = await Promise.all([
      getData('categories'),
      getData('sub-categories'),
      getData('blogs'),
      getData('assets'),
    ]);

    const categories = categoriesRes?.data || [];
    const subCategories = subCategoriesRes?.data || [];
    const blogs = blogsRes?.data || [];
    const assets = assetsRes?.data || [];

    // 1. Categories: /category-slug-{id}
    const categoryRoutes = categories.map((cat) => ({
      url: `${baseUrl}/${slugify(cat.name)}-${cat.id}`,
      lastModified: formatDate(cat.updated_at || cat.created_at),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    // 2. SubCategories: /category-slug-{id}/subcategory-slug-{id}
    const subCategoryRoutes = [];
    categories.forEach((cat) => {
      if (cat.sub_categories && Array.isArray(cat.sub_categories)) {
        cat.sub_categories.forEach((sub) => {
          subCategoryRoutes.push({
            url: `${baseUrl}/${slugify(cat.name)}-${cat.id}/${slugify(sub.name)}-${sub.id}`,
            lastModified: formatDate(sub.updated_at || sub.created_at),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        });
      }
    });

    // 3. Blog posts: /blog/blog-title-{id}
    const blogRoutes = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${slugify(blog.title || blog.name || '')}-${blog.id}`,
      lastModified: formatDate(blog.updated_at || blog.created_at),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    // 4. Asset details: /category-slug/subcategory-slug/asset-name-{id}
    const assetRoutes = assets.map((asset) => {
      const catSlug = slugify(asset?.sub_category?.category?.name || asset?.category?.name || 'category');
      const subCatSlug = slugify(asset?.sub_category?.name || 'subcategory');
      const assetSlug = `${slugify(asset.name)}-${asset.id}`;

      return {
        url: `${baseUrl}/${catSlug}/${subCatSlug}/${assetSlug}`,
        lastModified: formatDate(asset.updated_at || asset.created_at),
        changeFrequency: 'weekly',
        priority: 0.64,
      };
    });

    return [
      ...staticRoutes,
      ...categoryRoutes,
      ...subCategoryRoutes,
      ...blogRoutes,
      ...assetRoutes,
    ];
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    return staticRoutes;
  }
}

export const revalidate = 300;

import SubCategory from "@/components/SubCategory/SubCategory/SubCategory";
import { notFound, redirect } from "next/navigation";
import { validateCategory, notFoundMeta } from "@/utils/validateSlug";
import {
  ITEMS_PER_PAGE,
  parsePageParam,
  resolveActiveFilters,
  hasActiveFilters,
  filterAndSortAssets,
  buildCatalogMetadata,
} from "@/utils/catalogPagination";

export async function generateMetadata({ params, searchParams }) {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;

  const categoryData = await validateCategory(category);
  if (!categoryData?.data) return notFoundMeta;

  const activeFilters = resolveActiveFilters(resolvedSearchParams);
  const page = parsePageParam(resolvedSearchParams?.page);
  const filtersActive = hasActiveFilters(activeFilters);

  const catData = categoryData.data;
  const catName = catData?.name || "Models";
  const baseTitle = catData?.meta_title || `${catName} 3D Models`;
  const baseDesc =
    catData?.meta_description ||
    `Download free and PRO ${catName} 3D models for SketchUp.`;

  return buildCatalogMetadata({
    pathname: `/${category}`,
    baseTitle,
    baseDesc,
    keywords: catData?.keywords,
    page,
    hasFilters: filtersActive,
  });
}

const Page = async ({ params, searchParams }) => {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;

  const categoryData = await validateCategory(category);
  if (!categoryData?.data) notFound();

  // 1. Resolve filters & requested page
  const activeFilters = resolveActiveFilters(resolvedSearchParams);
  const requestedPage = parsePageParam(resolvedSearchParams?.page);

  // 2. Aggregate all assets across the category's subcategories
  const catName = categoryData.data.name || "Sketchup 3D models";
  const rawAssets = (categoryData.data.sub_categories || []).flatMap((sub) =>
    (sub?.assets || []).map((a) => ({
      ...a,
      category_name: catName,
      sub_category_name: sub.name,
    }))
  );

  // 3. Filter & Sort on server
  const filteredAssets = filterAndSortAssets(rawAssets, activeFilters);
  const totalCount = filteredAssets.length;
  const totalPages = totalCount === 0 ? 0 : Math.ceil(totalCount / ITEMS_PER_PAGE);

  // 4. Out-of-bounds redirect: only when totalCount > 0 and requestedPage > totalPages
  if (totalCount > 0 && requestedPage > totalPages) {
    const q = new URLSearchParams();
    if (activeFilters.search) q.set("search", activeFilters.search);
    if (activeFilters.access !== "all") q.set("access", activeFilters.access);
    if (activeFilters.sort !== "newest") q.set("sort", activeFilters.sort);
    if (totalPages > 1) q.set("page", totalPages.toString());
    const qs = q.toString();
    redirect(`/${category}${qs ? `?${qs}` : ""}`);
  }

  // 5. Slice models for current page (empty array if 0 results)
  const currentPage = totalCount === 0 ? 1 : Math.min(requestedPage, totalPages);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAssets =
    totalCount === 0 ? [] : filteredAssets.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div>
      <SubCategory
        subCategoriesByCategoryId={categoryData}
        serverAssets={paginatedAssets}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        activeFilters={activeFilters}
        basePath={`/${category}`}
      />
    </div>
  );
};

export default Page;

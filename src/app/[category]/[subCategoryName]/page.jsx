export const revalidate = 300;

import SingleSubCategoryPage from "@/components/SubCategory/SubCategory/SingleSubCategoryPage";
import { notFound, redirect } from "next/navigation";
import { validateSubCategory, notFoundMeta } from "@/utils/validateSlug";
import {
  ITEMS_PER_PAGE,
  parsePageParam,
  resolveActiveFilters,
  hasActiveFilters,
  filterAndSortAssets,
  buildCatalogMetadata,
} from "@/utils/catalogPagination";

export async function generateMetadata({ params, searchParams }) {
  const { category, subCategoryName } = await params;
  const resolvedSearchParams = await searchParams;

  const result = await validateSubCategory(category, subCategoryName);
  if (!result) return notFoundMeta;

  const activeFilters = resolveActiveFilters(resolvedSearchParams);
  const page = parsePageParam(resolvedSearchParams?.page);
  const filtersActive = hasActiveFilters(activeFilters);

  const subData = result.subCategoryData?.data;
  const subName = subData?.name || "Models";
  const baseTitle = subData?.meta_title || `${subName} 3D Models`;
  const baseDesc =
    subData?.meta_description ||
    `Download free and PRO ${subName} 3D models for SketchUp.`;

  return buildCatalogMetadata({
    pathname: `/${category}/${subCategoryName}`,
    baseTitle,
    baseDesc,
    keywords: subData?.keywords,
    page,
    hasFilters: filtersActive,
  });
}

const Page = async ({ params, searchParams }) => {
  const { category, subCategoryName } = await params;
  const resolvedSearchParams = await searchParams;

  const result = await validateSubCategory(category, subCategoryName);
  if (!result) notFound();

  const categoryId = category?.split("-").slice(-1)?.[0];
  const subCategoryId = subCategoryName?.split("-").slice(-1)?.[0];

  // 1. Resolve filters & requested page
  const activeFilters = resolveActiveFilters(resolvedSearchParams);
  const requestedPage = parsePageParam(resolvedSearchParams?.page);

  // 2. Aggregate raw assets
  const catName = result.categoryData?.data?.name || "Sketchup 3D models";
  const subName = result.subCategoryData?.data?.name || "Models";
  const rawAssets = (result.subCategoryData?.data?.assets || []).map((a) => ({
    ...a,
    category_name: catName,
    sub_category_name: subName,
  }));

  // 3. Filter and sort on server
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
    redirect(`/${category}/${subCategoryName}${qs ? `?${qs}` : ""}`);
  }

  // 5. Slice only this page's models (empty if 0 results)
  const currentPage = totalCount === 0 ? 1 : Math.min(requestedPage, totalPages);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAssets =
    totalCount === 0 ? [] : filteredAssets.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div>
      <SingleSubCategoryPage
        categoryId={categoryId}
        subCategoryId={subCategoryId}
        initialCategoryData={result?.categoryData}
        initialSubCategoryData={result?.subCategoryData}
        serverAssets={paginatedAssets}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        activeFilters={activeFilters}
        basePath={`/${category}/${subCategoryName}`}
      />
    </div>
  );
};

export default Page;

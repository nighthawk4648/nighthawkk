"use client";

import React from "react";
import CatalogLayout from "@/components/Catalog/CatalogLayout";

const SubCategory = ({
  subCategoriesByCategoryId,
  serverAssets = null,
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  activeFilters = { search: "", access: "all", sort: "newest" },
  basePath = "",
}) => {
  return (
    <CatalogLayout
      activeCategoryId={subCategoriesByCategoryId?.data?.id}
      activeSubCategoryId={null}
      initialCategoryData={subCategoriesByCategoryId}
      initialSubCategoryData={null}
      serverAssets={serverAssets}
      page={currentPage}
      totalPages={totalPages}
      totalCount={totalCount}
      activeFilters={activeFilters}
      basePath={basePath}
    />
  );
};

export default SubCategory;

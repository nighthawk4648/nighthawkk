"use client";

import React from "react";
import Loader from "@/components/Shared/Loader/Loader";
import { ErrorFallback } from "@/components/Shared/ErrorFallback/ErrorFallback";
import CatalogLayout from "@/components/Catalog/CatalogLayout";

const SingleSubCategoryPage = ({
  categoryId,
  subCategoryId,
  initialCategoryData,
  initialSubCategoryData,
  serverAssets = null,
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  activeFilters = { search: "", access: "all", sort: "newest" },
  basePath = "",
}) => {
  const categoryData = initialCategoryData;
  const subCategoryData = initialSubCategoryData;

  if (!categoryData || !subCategoryData) {
    return <ErrorFallback />;
  }

  return (
    <CatalogLayout
      activeCategoryId={categoryId}
      activeSubCategoryId={subCategoryId}
      initialCategoryData={categoryData}
      initialSubCategoryData={subCategoryData}
      serverAssets={serverAssets}
      page={currentPage}
      totalPages={totalPages}
      totalCount={totalCount}
      activeFilters={activeFilters}
      basePath={basePath}
    />
  );
};

export default SingleSubCategoryPage;

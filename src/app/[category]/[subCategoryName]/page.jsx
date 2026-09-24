export const dynamic = "force-dynamic";

import SingleSubCategoryPage from "@/components/SubCategory/SubCategory/SingleSubCategoryPage";
import { notFound } from "next/navigation";
import { validateSubCategory, notFoundMeta } from "@/utils/validateSlug";
import { getCleanMetadata } from "@/utils/seo";

export async function generateMetadata({ params }) {
  const { category, subCategoryName } = params;

  const result = await validateSubCategory(category, subCategoryName);
  if (!result) return notFoundMeta;

  const pathname = `/${category}/${subCategoryName}`;

  return getCleanMetadata(pathname, {
    title: `${result.subCategoryData.data?.meta_title}`,
    description: `${result.subCategoryData.data?.meta_description}`,
    keywords: result.subCategoryData.data?.keywords || undefined,
  });
}

const Page = async ({ params }) => {
  const { category, subCategoryName } = params;

  const result = await validateSubCategory(category, subCategoryName);
  if (!result) notFound();

  const categoryId = category?.split("-").slice(-1)?.[0];
  const subCategoryId = subCategoryName?.split("-").slice(-1)?.[0];

  return (
    <div>
      <SingleSubCategoryPage
        categoryId={categoryId}
        subCategoryId={subCategoryId}
        initialCategoryData={result?.categoryData}
        initialSubCategoryData={result?.subCategoryData}
      />
    </div>
  );
};

export default Page;

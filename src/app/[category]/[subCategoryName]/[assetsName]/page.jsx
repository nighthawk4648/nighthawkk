export const revalidate = 300;

import SubCategoryDetails from "@/components/SubCategory/SubCategoryDetails/SubCategoryDetails";
import { notFound } from "next/navigation";
import { getCleanMetadata } from "@/utils/seo";
import { validateAsset, notFoundMeta } from "@/utils/validateSlug";

export async function generateMetadata({ params }) {
  const { assetsName, category, subCategoryName } = await params;

  const assetData = await validateAsset(category, subCategoryName, assetsName);
  if (!assetData) return notFoundMeta;

  const pathname = `/${category}/${subCategoryName}/${assetsName}`;
  const asset = assetData.data;

  const rawTitle = asset?.meta_title?.trim();
  const rawDesc = asset?.meta_description?.trim();
  const rawShortDesc = asset?.short_description
    ? asset.short_description.replace(/<[^>]*>/g, "").trim()
    : "";

  const title =
    rawTitle ||
    (asset?.name ? `${asset.name} | SketchShaper` : "3D Model | SketchShaper");
  const description =
    rawDesc ||
    (rawShortDesc && rawShortDesc !== "-"
      ? rawShortDesc
      : `Download ${asset?.name || "3D model"} for SketchUp from SketchShaper.`);

  return getCleanMetadata(pathname, {
    title,
    description,
    keywords: asset?.keywords?.trim() || undefined,
  });
}

const Page = async ({ params }) => {
  const { assetsName, category, subCategoryName } = await params;

  const assetData = await validateAsset(category, subCategoryName, assetsName);
  if (!assetData) notFound();

  return (
    <div className="">
      <SubCategoryDetails assetDetails={assetData?.data} />
    </div>
  );
};

export default Page;

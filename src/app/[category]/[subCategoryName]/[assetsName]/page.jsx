export const revalidate = 300;

import SubCategoryDetails from "@/components/SubCategory/SubCategoryDetails/SubCategoryDetails";
import { notFound } from "next/navigation";
import { buildPageMetadata, cleanText } from "@/utils/seo";
import { validateAsset, notFoundMeta } from "@/utils/validateSlug";

export async function generateMetadata({ params }) {
  const { assetsName, category, subCategoryName } = await params;

  const assetData = await validateAsset(category, subCategoryName, assetsName);
  if (!assetData) return notFoundMeta;

  const pathname = `/${category}/${subCategoryName}/${assetsName}`;
  const asset = assetData.data;

  const rawTitle = cleanText(asset?.meta_title, 200);
  const rawDesc = cleanText(asset?.meta_description, 160);
  const rawShortDesc = cleanText(asset?.short_description, 160);

  const title =
    rawTitle ||
    (asset?.name ? `${cleanText(asset.name, 150)} 3D Model` : "3D Model");
  const description =
    rawDesc ||
    (rawShortDesc && rawShortDesc !== "-"
    ? rawShortDesc
    : `Download ${asset?.name || "3D model"} for SketchUp from SketchShaper.`);

  const firstGalleryImage = Array.isArray(asset?.images)
    ? asset.images.find((item) => item?.image)?.image
    : undefined;

  return {
    ...buildPageMetadata({
    pathname,
    title,
    description,
    image: asset?.cover || firstGalleryImage,
    imageAlt: asset?.name || "SketchUp 3D model",
    }),
    keywords: cleanText(asset?.keywords, 300) || undefined,
  };
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

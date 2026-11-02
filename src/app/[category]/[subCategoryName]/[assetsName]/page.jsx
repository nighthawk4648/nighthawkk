export const revalidate = 300;

import SubCategoryDetails from "@/components/SubCategory/SubCategoryDetails/SubCategoryDetails";
import { notFound, redirect, permanentRedirect } from "next/navigation";
import { buildPageMetadata, cleanText } from "@/utils/seo";
import { validateAsset, notFoundMeta } from "@/utils/validateSlug";
import buildAssetPath from "@/utils/buildAssetPath";
import {
  JsonLd,
  generateAssetSchema,
  generateBreadcrumbSchema,
} from "@/utils/schema";

// Single constant flag to toggle between 307 (temporary, safe during slug stabilization) and 308 (permanent SEO)
const USE_PERMANENT_REDIRECT =
  process.env.NEXT_PUBLIC_USE_PERMANENT_REDIRECT === "true";

function executeRedirect(targetUrl, searchParamsObj = {}) {
  const qs = new URLSearchParams(searchParamsObj).toString();
  const destination = qs ? `${targetUrl}?${qs}` : targetUrl;
  if (USE_PERMANENT_REDIRECT) {
    permanentRedirect(destination);
  } else {
    redirect(destination);
  }
}

export async function generateMetadata({ params, searchParams }) {
  const { assetsName, category, subCategoryName } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const assetData = await validateAsset(category, subCategoryName, assetsName);
  if (!assetData) return notFoundMeta;

  if (assetData.redirectUrl) {
    executeRedirect(assetData.redirectUrl, resolvedSearchParams);
  }

  const asset = assetData.data || assetData.asset;
  const canonicalPath = buildAssetPath(asset);

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
      pathname: canonicalPath,
      title,
      description,
      image: asset?.cover || firstGalleryImage,
      imageAlt: asset?.name || "SketchUp 3D model",
    }),
    alternates: {
      canonical: canonicalPath,
    },
    keywords: cleanText(asset?.keywords, 300) || undefined,
  };
}

const Page = async ({ params, searchParams }) => {
  const { assetsName, category, subCategoryName } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const assetData = await validateAsset(category, subCategoryName, assetsName);
  if (!assetData) notFound();

  if (assetData.redirectUrl) {
    executeRedirect(assetData.redirectUrl, resolvedSearchParams);
  }

  const asset = assetData.data || assetData.asset;
  if (!asset) notFound();

  const subCategory = asset?.sub_category;
  const cat = subCategory?.category;
  const canonicalPath = buildAssetPath(asset);

  const productSchema = generateAssetSchema(asset, {
    category: cat,
    subCategory,
    pathname: canonicalPath,
  });

  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: cat?.name || "Models", url: `/${category}` },
    {
      name: subCategory?.name || "Category",
      url: `/${category}/${subCategoryName}`,
    },
    { name: asset.name, url: canonicalPath },
  ]);

  return (
    <div className="">
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbsSchema} />
      <SubCategoryDetails assetDetails={asset} />
    </div>
  );
};

export default Page;

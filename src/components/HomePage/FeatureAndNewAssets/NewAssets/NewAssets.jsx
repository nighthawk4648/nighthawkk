import Image from "next/image";
import React from "react";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { getOptimizedImageUrl } from "@/utils/cloudinary";

const NewAssets = ({ categories }) => {
  const getOriginalImageUrl = (imagePath) => {
    return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
  };

  // Flatten all assets across all categories and subcategories
  const allAssets =
    categories?.flatMap(
      (category) =>
        category?.sub_categories?.flatMap((subCategory) =>
          (subCategory?.assets || []).map((asset) => ({
            ...asset,
            categoryName: category.name,
            subCategoryName: subCategory.name,
          })),
        ) || [],
    ) || [];

  // Separate into paid and free assets, newest first
  const paidAssets = allAssets
    .filter((asset) => asset.access_type === "paid")
    .sort((a, b) => b.id - a.id);

  const freeAssets = allAssets
    .filter((asset) => asset.access_type !== "paid")
    .sort((a, b) => b.id - a.id);

  // Target: up to 3 paid assets and up to 9 free assets (total 12)
  const maxPaid = Math.min(paidAssets.length, 3);
  const selectedPaid = paidAssets.slice(0, maxPaid);
  const remainingNeeded = 12 - selectedPaid.length;
  const selectedFree = freeAssets.slice(0, remainingNeeded);

  // If still under 12 and more paid assets exist, fill remaining slots
  let extraPaid = [];
  if (
    selectedPaid.length + selectedFree.length < 12 &&
    paidAssets.length > maxPaid
  ) {
    extraPaid = paidAssets.slice(
      maxPaid,
      maxPaid + (12 - (selectedPaid.length + selectedFree.length)),
    );
  }

  // Interleave: PRO assets placed at rhythmic slots (indexes 2, 5, 8)
  const proSlots = new Set([2, 5, 8]);
  const displayAssets = [];
  let paidIdx = 0;
  let freeIdx = 0;
  const paidPool = [...selectedPaid, ...extraPaid];
  const freePool = [...selectedFree];
  const totalAvailable = paidPool.length + freePool.length;
  const totalToDisplay = Math.min(12, totalAvailable);

  for (let i = 0; i < totalToDisplay; i++) {
    if (proSlots.has(i) && paidIdx < paidPool.length) {
      displayAssets.push(paidPool[paidIdx++]);
    } else if (freeIdx < freePool.length) {
      displayAssets.push(freePool[freeIdx++]);
    } else if (paidIdx < paidPool.length) {
      displayAssets.push(paidPool[paidIdx++]);
    }
  }

  if (displayAssets.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black p-5 lg:p-8">
      <div className="bg-gradient-to-r from-black-400 to-gray-500 mb-2">
        <h2 className="text-center font-semibold text-2xl text-white p-2">
          New Assets
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 lg:gap-6 mt-8 w-full mx-auto">
        {displayAssets.map((asset) => (
          <div key={asset?.id} className="group flex flex-col items-center">
            <Link
              href={`/${slugify(asset?.categoryName)}/${slugify(asset?.subCategoryName)}/${slugify(asset?.name)}-${asset?.id}`}
              className="w-full flex flex-col items-center"
            >
              {/* Image without enclosing square box */}
              <div className="relative flex justify-center items-center">
                {asset?.access_type === "paid" && (
                  <span className="absolute top-1 right-1 z-10 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border border-purple-400/40 flex items-center gap-1">
                    <span>💎</span> PRO
                  </span>
                )}
                {asset?.cover && (
                  <Image
                    src={getOptimizedImageUrl(
                      getOriginalImageUrl(asset?.cover),
                    )}
                    height={800}
                    width={800}
                    alt={asset?.name || "Asset image"}
                    className="w-[180px] h-[180px] md:w-[200px] md:h-[200px] object-cover rounded-md transform transition-transform duration-700 ease-out group-hover:scale-125"
                  />
                )}
              </div>

              {/* Asset Title */}
              <div className="text-center mt-2.5 px-1 w-full max-w-[210px]">
                <p className="text-sm font-medium text-gray-200 line-clamp-2 group-hover:text-white transition-colors duration-200">
                  {asset?.name}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewAssets;

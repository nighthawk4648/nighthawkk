'use client'
import slugify from '@/utils/slugify';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import all_sub_cat_image from '../../../../public/assets/sub_category/all.png'
import { getOptimizedImageUrl } from '@/utils/cloudinary';
import { HorizontalBanner } from '@/components/Shared/GoogleAdsense/HorizontalBanner';
import { CategoryAds } from '@/components/Shared/GoogleAdsense/categoryads';

const SubCategory = ({ subCategoriesByCategoryId }) => {

    const getOriginalImageUrl = (imagePath) => {
        return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
    };

    return (
        <div>

            {/* Header */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black py-2">
                <h1 className="text-white font-semibold text-2xl text-center">
                    {subCategoriesByCategoryId?.data?.name}
                </h1>
                <h2 className="text-white text-center mt-2 px-4 py-2 text-sm font-medium">
                    {subCategoriesByCategoryId?.data?.short_description}
                </h2>
            </div>

            {/* Subcategory Grid */}
            <div className="grid md:grid-cols-8 grid-cols-2 gap-4 bg-gradient-to-br from-gray-900 via-gray-900 to-black py-8 px-4 border-b-2 border-gray-500">

                {/* All Button */}
                <div className="cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-purple-600/40 rounded-md overflow-hidden">
                    <Link href={`/${slugify(subCategoriesByCategoryId?.data?.name)}-${subCategoriesByCategoryId?.data?.id}`}>
                        <Image
                            src={all_sub_cat_image}
                            height={400}
                            width={500}
                            alt="all subcategories"
                            className="w-full h-28 object-cover"
                        />
                        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black py-1">
                            <h2 className="text-white font-semibold text-sm text-center">All</h2>
                        </div>
                    </Link>
                </div>

                {/* Dynamic Subcategories */}
                {subCategoriesByCategoryId?.data?.sub_categories?.map((subCategory) => (
                    <div
                        className="cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-purple-600/40 rounded-md overflow-hidden"
                        key={subCategory?.id}
                    >
                        <Link
                            href={`${slugify(subCategoriesByCategoryId?.data?.name)}-${subCategoriesByCategoryId?.data?.id}/${slugify(subCategory?.name)}-${subCategory?.id}`}
                        >
                            {subCategory?.image && (
                                <Image
                                    src={getOptimizedImageUrl(getOriginalImageUrl(subCategory?.image))}
                                    height={400}
                                    width={500}
                                    alt={subCategory?.name}
                                    className="w-full h-28 object-cover"
                                />
                            )}
                            <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black py-1">
                                <h2 className="text-white font-semibold text-sm text-center">{subCategory?.name}</h2>
                            </div>
                        </Link>
                    </div>
                ))}

            </div>

            {/* Premium CTA */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black py-3 px-4 flex items-center justify-center gap-4 text-center">
                <h6 className="text-white font-semibold text-lg">
                    Checkout Our Premium Models, Textures and SketchUp Extension
                </h6>

                <a
                    href="https://sketchshaper.com/pro"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-full transition duration-200 whitespace-nowrap"
                >
                    Browse
                </a>
            </div>

            {/* Banner Ad */}
            <CategoryAds />

            {/* All Subcategory Assets + Horizontal Banner after every slice */}
            {subCategoriesByCategoryId?.data?.sub_categories?.map((subCategories, index) => {
                const sortedAssets = subCategories?.assets
                    ?.slice()
                    ?.sort((a, b) => b.id - a.id);

                return (
                    <div key={subCategories?.id}>
                        
                        {/* Asset Grid */}
                        <div className="bg-primary py-8 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 px-4">
                            {sortedAssets?.map((asset) => (
                                <div key={asset?.id}>
                                    <div className="lg:w-[300px] md:w-[200px] w-full lg:h-[308px] md:h-[200px] h-auto mx-auto relative overflow-hidden">
                                        <Link
                                            href={`/${slugify(asset?.sub_category?.category?.name)}/${slugify(asset?.sub_category?.name)}/${slugify(asset?.name)}-${asset?.id}`}
                                        >
                                            {asset?.cover && (
                                                <Image
                                                    src={getOptimizedImageUrl(getOriginalImageUrl(asset?.cover))}
                                                    height={400}
                                                    width={400}
                                                    alt={asset?.name}
                                                    className="transform transition-transform duration-1000 hover:scale-150"
                                                    style={{ transformOrigin: 'center' }}
                                                />
                                            )}
                                        </Link>
                                    </div>

                                    <h3 className="text-white text-center font-semibold mt-2">
                                        <Link
                                            href={`/${slugify(asset?.sub_category?.category?.name)}/${slugify(asset?.sub_category?.name)}/${slugify(asset?.name)}-${asset?.id}`}
                                        >
                                            {asset?.name}
                                        </Link>
                                    </h3>
                                </div>
                            ))}
                        </div>

                        {/* Horizontal banner after each slice */}
                        <HorizontalBanner />

                    </div>
                );
            })}
        </div>
    );
};

export default SubCategory;

'use client'
import slugify from '@/utils/slugify';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import all_sub_cat_image from '../../../../public/assets/sub_category/all.png'
import { getOptimizedImageUrl } from '@/utils/cloudinary';
import { HorizontalBanner } from '@/components/Shared/GoogleAdsense/HorizontalBanner';
import { CategoryAds } from '@/components/Shared/GoogleAdsense/categoryads';
import { CiSearch } from 'react-icons/ci';
import { RxCross2 } from 'react-icons/rx';
import useSWR from 'swr';
import { fetcher } from '@/utils/swrFetcher';

const SubCategory = ({ subCategoriesByCategoryId }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Collect all assets from all subcategories
    const allAssets = subCategoriesByCategoryId?.data?.sub_categories?.flatMap(subCategory => 
        subCategory?.assets || []
    ) || [];

    // Filter assets based on search term
    const filteredAssets = allAssets.filter(asset => 
        asset && asset.name && typeof asset.name === 'string' && asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

            {/* Assets Section with Search */}
            <div className="bg-primary py-8">
                {/* Search Bar */}
                <div className="mb-8 px-4">
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search assets by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all"
                            />
                            <svg
                                className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        {searchTerm && (
                            <p className="text-sm text-gray-400 mt-2 text-center">
                                Found {filteredAssets.length} {filteredAssets.length === 1 ? 'asset' : 'assets'} matching "{searchTerm}"
                            </p>
                        )}
                    </div>
                </div>

                {/* Search Results */}
                {searchTerm ? (
                    filteredAssets.length > 0 ? (
                        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 px-4">
                            {filteredAssets.map((asset) => (
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
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg">No assets found matching "{searchTerm}"</p>
                            <p className="text-gray-500 text-sm mt-2">Try adjusting your search terms</p>
                        </div>
                    )
                ) : (
                    /* All Subcategory Assets + Horizontal Banner after every slice */
                    subCategoriesByCategoryId?.data?.sub_categories?.map((subCategories, index) => {
                        const sortedAssets = subCategories?.assets
                            ?.slice()
                            ?.sort((a, b) => b.id - a.id);

                        return (
                            <div key={subCategories?.id}>
                                
                                {/* Asset Grid */}
                                <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 px-4">
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
                    })
                )}
            </div>
        </div>
    );
};

export default SubCategory;

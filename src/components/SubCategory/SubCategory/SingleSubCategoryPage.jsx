'use client'
import slugify from '@/utils/slugify';
import React, { useEffect, useRef } from 'react';

import all_sub_cat_image from '../../../../public/assets/sub_category/all.png'
import Image from 'next/image';
import Link from 'next/link';
import { getOptimizedImageUrl } from '@/utils/cloudinary';
import { HorizontalBanner } from '@/components/Shared/GoogleAdsense/HorizontalBanner';
import useSWR from 'swr';
import { ErrorFallback } from '@/components/Shared/ErrorFallback/ErrorFallback ';
import { fetcher } from '@/utils/swrFetcher';
import Loader from '@/components/Shared/Loader/Loader';

const SingleSubCategoryPage = ({ categoryId, subCategoryId }) => {
    const assetsRef = useRef(null);
  
    const categoryNumber = parseInt(categoryId);
    const subCategoryNumber = parseInt(subCategoryId);

    const { data: subCategoriesByCategoryId, isLoading: subCategoriesByCategoryIdLoading } = useSWR(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/categories/${categoryNumber}`,
        fetcher
    );

    const { data: assetBySubCategoryId, isLoading: assetBySubCategoryIdLoading } = useSWR(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/sub-categories/${subCategoryNumber}`,
        fetcher
    );

    // Auto-scroll on mobile
    useEffect(() => {
        if (!subCategoriesByCategoryIdLoading && !assetBySubCategoryIdLoading && assetsRef.current) {
            const isMobile = window.innerWidth < 768;
            if (isMobile) {
                const timer = setTimeout(() => {
                    assetsRef.current.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 10);
                return () => clearTimeout(timer);
            }
        }
    }, [subCategoriesByCategoryIdLoading, assetBySubCategoryIdLoading]);

    const sortedAssets = assetBySubCategoryId?.data?.assets
        ?.slice()
        .sort((a, b) => b.id - a.id);

    const getOriginalImageUrl = (imagePath) => {
        return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
    };

    if (subCategoriesByCategoryIdLoading || assetBySubCategoryIdLoading) {
        return <Loader />
    }

    if (!subCategoriesByCategoryId || !assetBySubCategoryId) {
        return <ErrorFallback />
    }

    return (
        <div>
            {/* Header */}
            <div className='bg-gradient-to-br from-gray-900 via-gray-900 to-black py-2'>
                <h1 className='text-white font-semibold text-2xl text-center'>
                    {assetBySubCategoryId?.data?.name}
                </h1>
                <h2 className="text-white text-center mt-2 px-4 py-2 text-sm font-medium">
                    {assetBySubCategoryId?.data?.short_description}
                </h2>
            </div>

            {/* Subcategory list */}
            <div className='grid md:grid-cols-8 grid-cols-2 gap-4 bg-gradient-to-br from-gray-900 via-gray-900 to-black py-8 px-4 border-b-2 border-gray-500'>
                
                {/* ALL category card */}
                <div className='cursor-pointer'>
                    <div className="cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40 rounded-md overflow-hidden">
                        <Link href={`/${slugify(subCategoriesByCategoryId?.data?.name)}-${subCategoriesByCategoryId?.data?.id}`}>
                            <Image
                                src={all_sub_cat_image}
                                height={400}
                                width={500}
                                alt="all subcategories"
                                className="w-full h-28 object-cover"
                            />
                            <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black py-1">
                                <p className="text-white font-semibold text-sm text-center">All</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Dynamic Subcategories */}
                {subCategoriesByCategoryId?.data?.sub_categories?.map((subCategory) => (
                    <div
                        className="cursor-pointer transition-transform duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-600/40 rounded-md overflow-hidden"
                        key={subCategory?.id}
                    >
                        <Link href={`${slugify(subCategory?.name)}-${subCategory?.id}`}>
                            {subCategory?.image && (
                                <Image
                                    src={getOptimizedImageUrl(getOriginalImageUrl(subCategory?.image))}
                                    height={800}
                                    width={900}
                                    alt={subCategory?.name}
                                    className="w-full h-28 object-cover"
                                />
                            )}

                            <div className="bg-gradient-to-br from-black to-gray-900 py-1">
                                <p className="text-white font-semibold text-sm text-center">
                                    {subCategory?.name}
                                </p>
                            </div>
                        </Link>
                    </div>
                ))}

            </div>

            {/* Premium Banner */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black py-3 px-4 flex items-center justify-center gap-4 text-center">
                <h6 className="text-white font-semibold text-lg">
                    Checkout Our Premium Models, Textures & SketchUp Extension
                </h6>

                <a
                    href="https://sketchshaper.com/pro"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-full transition duration-200 whitespace-nowrap"
                >
                    Browse
                </a>
            </div>

            {/* Google AdSense banner */}
            <HorizontalBanner />

            {/* Assets Grid (NO ADS) */}
            <div 
                ref={assetsRef} 
                className='bg-primary py-8 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 px-4'
            >
                {sortedAssets?.map((asset) => (
                    <div key={asset.id}>
                        <div className='lg:w-[300px] md:[w-200px] w-full lg:h-[308px] md:[h-200px] h-auto mx-auto mb-5 relative overflow-hidden'>
                            <Link href={`/${slugify(assetBySubCategoryId?.data?.category?.name)}/${slugify(assetBySubCategoryId?.data?.name)}/${slugify(asset?.name)}-${asset?.id}`}>
                                {asset?.cover && (
                                    <Image
                                        src={getOptimizedImageUrl(getOriginalImageUrl(asset?.cover))}
                                        height={400}
                                        width={400}
                                        alt={asset?.name}
                                        className='transform transition-transform duration-1000 hover:scale-150'
                                        style={{ transformOrigin: 'center' }}
                                    />
                                )}
                            </Link>
                        </div>

                        <p className='text-white text-center font-semibold mt-2'>
                            <Link href={`/${slugify(assetBySubCategoryId?.data?.category?.name)}/${slugify(assetBySubCategoryId?.data?.name)}/${slugify(asset?.name)}-${asset?.id}`}>
                                {asset?.name}
                            </Link>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SingleSubCategoryPage;

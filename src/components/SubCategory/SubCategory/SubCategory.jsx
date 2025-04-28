'use client'
import slugify from '@/utils/slugify';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import all_sub_cat_image from '../../../../public/assets/sub_category/all.png'
import { getOptimizedImageUrl } from '@/utils/cloudinary';
import Script from 'next/script';
import { HorizontalBanner } from '@/components/Shared/GoogleAdsense/HorizontalBanner';


const SubCategory = ({ subCategoriesByCategoryId }) => {


    const getOriginalImageUrl = (imagePath) => {
        return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
    };


    // AdSense component to insert between cards
    const AdUnit = ({ slotId }) => {
        const adRef = useRef(null);
      
        useEffect(() => {
          // Ensure adsbygoogle is available
          if (typeof window !== "undefined" && window.adsbygoogle && adRef.current) {
            try {
              // Only push if the ad slot is not already initialized
              if (!adRef.current.getAttribute('data-adsbygoogle-status')) {
                window.adsbygoogle.push({});
              }
            } catch (error) {
              console.error('AdSense error:', error);
            }
          }
        }, []);
      
        return (
          <div className="border-4 border-gray-800 shadow-lg rounded-xl p-6 flex items-center justify-center">
            <ins
              ref={adRef}
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', height: '100%' }}
              data-ad-client="ca-pub-5557791257949251" // Your publisher ID
              data-ad-slot={slotId} // Replace with your ad slot ID
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        );
      };


    return (
        <div>
            <div className='bg-primary py-2'>
                <h1 className='text-white font-semibold text-2xl text-center'>{subCategoriesByCategoryId?.data?.name}</h1>
            </div>

            <div className='grid md:grid-cols-8 grid-cols-2 gap-4 bg-[#282828] py-8 px-4 border-b-2 border-gray-500'>
                <div className='cursor-pointer'>
                    <Link href={`/${slugify(subCategoriesByCategoryId?.data?.name)}-${subCategoriesByCategoryId?.data?.id}`}>
                        <Image
                            src={all_sub_cat_image}
                            height={400}
                            width={500}
                            alt="all subcategories"
                            className='w-full h-28'
                        ></Image>

                        <div className='bg-secondary py-1'>
                            <h2 className='text-white font-semibold text-sm text-center'>All</h2>
                        </div>
                    </Link>
                </div>

                {
                    subCategoriesByCategoryId?.data?.sub_categories?.map((subCategory) => (
                        <div className='cursor-pointer' key={subCategory?.id}
                        >
                            <Link href={`${slugify(subCategoriesByCategoryId?.data?.name)}-${subCategoriesByCategoryId?.data?.id}/${slugify(subCategory?.name)}-${subCategory?.id}`}>
                                {subCategory?.image && <Image
                                    src={getOptimizedImageUrl(getOriginalImageUrl(subCategory?.image))}
                                    height={400}
                                    width={500}
                                    alt={subCategory?.name}
                                    className='w-full h-28'
                                ></Image>}

                                <div className='bg-secondary py-1'>
                                    <h2 className='text-white font-semibold text-sm text-center'>{subCategory?.name}</h2>
                                </div>
                            </Link>
                        </div>
                    ))
                }
            </div>


            <HorizontalBanner/>


            {
                subCategoriesByCategoryId?.data?.sub_categories?.map((subCategories) => {
                    // Sort assets by ID in descending order (latest first)
                    const sortedAssets = subCategories?.assets?.sort((a, b) => b.id - a.id) || [];

                    // Create array with assets and ads
                    const assetsWithAds = [];

                    sortedAssets.forEach((asset, index) => {
                        // Add the asset
                        assetsWithAds.push(
                            <div key={`asset-${asset?.id}`}>
                                <div className='lg:w-[300px] md:w-[200px] w-full lg:h-[308px] md:h-[200px] h-auto mx-auto relative overflow-hidden'>
                                    <Link href={`/${slugify(asset?.sub_category?.category?.name)}/${slugify(asset?.sub_category?.name)}/${slugify(asset?.name)}-${asset?.id}`}>
                                        <div className='relative'>
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
                                        </div>
                                    </Link>
                                </div>
                                <h3 className='text-white text-center font-semibold mt-2 z-10 relative'>
                                    <Link href={`/${slugify(asset?.sub_category?.category?.name)}/${slugify(asset?.sub_category?.name)}/${slugify(asset?.name)}-${asset?.id}`}>
                                        {asset?.name}
                                    </Link>
                                </h3>
                            </div>
                        );

                        // Insert an ad after every 4th asset
                        if ((index + 1) % 4 === 0 && index < sortedAssets.length - 1) {
                            assetsWithAds.push(
                                <AdUnit
                                    key={`ad-${subCategories?.id}-${index}`}
                                    slotId="9393509366" // Replace with your actual ad slot ID
                                />
                            );
                        }
                    });

                    return (
                        <div
                            key={subCategories?.id}
                            className='bg-primary py-8 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 px-4'>
                            {assetsWithAds}
                        </div>
                    );
                })
            }



        </div>
    );
};

export default SubCategory;

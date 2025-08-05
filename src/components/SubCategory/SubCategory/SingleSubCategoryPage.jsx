'use client'
import slugify from '@/utils/slugify';
import React, { useEffect, useRef } from 'react';

import all_sub_cat_image from '../../../../public/assets/sub_category/all.png'
import Image from 'next/image';
// import getData from '@/utils/getData';
import Link from 'next/link';
import { getOptimizedImageUrl } from '@/utils/cloudinary';
import { HorizontalBanner } from '@/components/Shared/GoogleAdsense/HorizontalBanner';
import useSWR from 'swr';
import { ErrorFallback } from '@/components/Shared/ErrorFallback/ErrorFallback ';
import { fetcher } from '@/utils/swrFetcher';
import Loader from '@/components/Shared/Loader/Loader';



const SingleSubCategoryPage = ({ categoryId, subCategoryId }) => {
    // Ref for assets section to scroll to
    const assetsRef = useRef(null);
  
    const categoryNumber = parseInt(categoryId);
    const subCategoryNumber = parseInt(subCategoryId);


    

    // const subCategoriesByCategoryId = await getData(`categories/${categoryId}`);

    // const assetBySubCategoryId = await getData(`sub-categories/${subCategoryId}`);


    const { data: subCategoriesByCategoryId, isLoading: subCategoriesByCategoryIdLoading } = useSWR(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/categories/${categoryNumber}`,
        fetcher
    );

    const { data: assetBySubCategoryId, isLoading: assetBySubCategoryIdLoading } = useSWR(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/sub-categories/${subCategoryNumber}`,
        fetcher
    );

    // Auto scroll to assets section after data loads
    useEffect(() => {
        if (!subCategoriesByCategoryIdLoading && !assetBySubCategoryIdLoading && assetsRef.current) {
            const timer = setTimeout(() => {
                assetsRef.current.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 10); // Reduced delay for faster scrolling
            
            return () => clearTimeout(timer);
        }
    }, [subCategoriesByCategoryIdLoading, assetBySubCategoryIdLoading]);

    // Sort the assets in descending order based on id
    const sortedAssets = assetBySubCategoryId?.data?.assets?.slice().sort((a, b) => b.id - a.id);

    const getOriginalImageUrl = (imagePath) => {
        return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
    };


    // AdSense component to insert between cards
    const AdUnit = ({ slotId }) => {
        const adRef = useRef(null);
      
        useEffect(() => {
          if (typeof window !== "undefined" && window.adsbygoogle && adRef.current) {
            try {
              if (!adRef.current.getAttribute('data-adsbygoogle-status')) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
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
              data-ad-client="ca-pub-5557791257949251"
              data-ad-slot={9393509366}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        );
      };


     // Create array with assets and ads
     const assetsWithAds = [];
    
     if (sortedAssets) {
         sortedAssets.forEach((asset, index) => {
             // Add the asset
             assetsWithAds.push(
                 <div key={`asset-${asset.id}`}>
                     <div
                         className='lg:w-[300px] md:[w-200px] w-full lg:h-[308px] md:[h-200px] h-auto mx-auto mb-5 relative overflow-hidden'
                     >
                         <Link href={`/${slugify(assetBySubCategoryId?.data?.category?.name)}/${slugify(assetBySubCategoryId?.data?.name)}/${slugify(asset?.name)}-${asset?.id}`}>
                             {asset?.cover && <Image
                                 src={getOptimizedImageUrl(getOriginalImageUrl(asset?.cover))}
                                 height={400}
                                 width={400}
                                 alt={asset?.name}
                                 className='transform transition-transform duration-1000 hover:scale-150'
                                 style={{ transformOrigin: 'center' }}
                             />}
                         </Link>
                     </div>
                     <p className= 'text-white text-center font-semibold mt-2 z-10 relative'>
                         <Link href={`/${slugify(assetBySubCategoryId?.data?.category?.name)}/${slugify(assetBySubCategoryId?.data?.name)}/${slugify(asset?.name)}-${asset?.id}`}>
                             {asset?.name}
                         </Link>
                     </p>
                 </div>
             );
             
             // Insert an ad after every 4th asset
             if ((index + 1) % 4 === 0 && index < sortedAssets.length - 1) {
                 assetsWithAds.push(
                     <AdUnit 
                         key={`ad-${index}`} 
                         slotId="9393509366" 
                     />
                 );
             }
         });
     }




    if (subCategoriesByCategoryIdLoading || assetBySubCategoryIdLoading) {
        return <Loader/>
    }

    if (!subCategoriesByCategoryId || !assetBySubCategoryId) {
        return <ErrorFallback />
    }

    return (
        <div>
            <div className='bg-gradient-to-br from-gray-900 via-gray-900 to-black py-2'>
                <h1 className='bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white font-semibold text-2xl text-center'>{subCategoriesByCategoryId?.data?.name}</h1>
            </div>


            <div className='grid md:grid-cols-8 grid-cols-2 gap-4 bg-gradient-to-br from-gray-900 via-gray-900 to-black py-8 px-4 border-b-2 border-gray-500'>
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

            

                
                   {subCategoriesByCategoryId?.data?.sub_categories?.map((subCategory) => (
                    <div
                      className="cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-purple-600/40 rounded-md overflow-hidden"
                      key={subCategory?.id}
                    >
                      <Link href={`${slugify(subCategory?.name)}-${subCategory?.id}`}>
                        {subCategory?.image && (
                          <Image
                            src={getOptimizedImageUrl(getOriginalImageUrl(subCategory?.image))}
                            height={400}
                            width={500}
                            alt={subCategory?.name}
                            className="w-full h-28 object-cover"
                          />
                        )}
                  
                        <div className="bg-gradient-to-br from-black to-gray-900 py-1">
                          <p className="text-white font-semibold text-sm text-center">{subCategory?.name}</p>
                        </div>
                      </Link>
                    </div>
                  ))}    
            </div>

            <HorizontalBanner/>



         {/* Grid with assets and ads */}
         <div ref={assetsRef} className='bg-primary py-8 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 px-4'>
                {assetsWithAds}
            </div>


        </div>
    );
};

export default SingleSubCategoryPage;
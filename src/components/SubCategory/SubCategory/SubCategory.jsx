'use client'
import slugify from '@/utils/slugify';
import { fetcher } from '@/utils/swrFetcher';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import useSWR from 'swr';
import all_sub_cat_image from '../../../../public/assets/sub_category/all.png'

const SubCategory = ({ subCategoriesByCategoryId }) => {


    console.log("subCategoriesByCategoryId", subCategoriesByCategoryId);


    const [subCategoryId, setSubCategoryId] = useState(subCategoriesByCategoryId?.data?.sub_categories?.[0]?.id);

    const { data: assetBySubCategoryId, isLoading } = useSWR(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/sub-categories/${subCategoryId}`,
        fetcher
    );



    // Sort the assets in descending order based on id
    const sortedAssets = assetBySubCategoryId?.data?.assets?.slice().sort((a, b) => b.id - a.id);

    return (
        <div>
            <div className='bg-secondary py-2'>
                <h1 className='text-white font-semibold text-2xl text-center'>{subCategoriesByCategoryId?.data?.name}</h1>
            </div>

            <div className='grid md:grid-cols-8 grid-cols-2 gap-4 bg-thirdColor py-8 px-4'>
                <div className='cursor-pointer'>
                    <Link  href={`/${slugify(subCategoriesByCategoryId?.data?.name)}-${subCategoriesByCategoryId?.data?.id}`}>
                    <Image
                        src={all_sub_cat_image}
                        height={400}
                        width={500}
                        alt="all subcategories"
                        className='w-full h-28'
                    ></Image>

                    <div className='bg-secondary py-1'>
                        <p className='text-white font-semibold text-sm text-center'>All</p>
                    </div>
                    </Link>
                </div>

                {
                    subCategoriesByCategoryId?.data?.sub_categories?.map((subCategory) => (
                        <div className='cursor-pointer' key={subCategory?.id} onClick={() => setSubCategoryId(subCategory?.id)}>
                            <Link href={`${slugify(subCategoriesByCategoryId?.data?.name)}-${subCategoriesByCategoryId?.data?.id}/${slugify(subCategory?.name)}-${subCategory?.id}`}>
                                {subCategory?.image && <Image
                                    src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE + subCategory?.image}
                                    height={400}
                                    width={500}
                                    alt={subCategory?.name}
                                    className='w-full h-28'
                                ></Image>}

                                <div className='bg-secondary py-1'>
                                    <p className='text-white font-semibold text-sm text-center'>{subCategory?.name}</p>
                                </div>
                            </Link>
                        </div>
                    ))
                }
            </div>

            {/* <div className='mt-5 bg-primary py-8 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 px-4'>
                {
                    sortedAssets?.map((assets) => (
                        <div className='lg:w-[300px] md:[w-200px] w-full lg:h-[308px] md:[h-200px] h-auto mx-auto mb-5' key={assets?.id}>
                            <Link href={`/${slugify(assetBySubCategoryId?.data?.category?.name)}/${slugify(assetBySubCategoryId?.data?.name)}/${slugify(assets?.name)}-${assets?.id}`}>
                                {assets?.cover && <Image
                                    src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE + assets?.cover}
                                    height={400}
                                    width={400}
                                    alt={assets?.name}
                                    className=''
                                ></Image>}

                                <p className='text-white text-center font-semibold mt-1'>{assets?.name}</p>
                            </Link>
                        </div>
                    ))
                }
            </div> */}

            {
                subCategoriesByCategoryId?.data?.sub_categories?.map((subCategories) => (
                    <div
                        key={subCategories?.id}
                        className=' bg-primary py-8 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 px-4'>
                        {
                            subCategories?.assets?.map((asset) => (
                                <div className='lg:w-[300px] md:[w-200px] w-full lg:h-[308px] md:[h-200px] h-auto mx-auto mb-5' key={asset?.id}>
                                    <Link href={`/${slugify(asset?.sub_category?.category?.name)}/${slugify(asset?.sub_category?.name)}/${slugify(asset?.name)}-${asset?.id}`}>
                                        {asset?.cover && <Image
                                            src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE + asset?.cover}
                                            height={400}
                                            width={400}
                                            alt={asset?.name}
                                            className=''
                                        ></Image>}

                                        <p className='text-white text-center font-semibold mt-1'>{asset?.name}</p>
                                    </Link>
                                </div>
                            ))
                        }
                    </div>

                ))
            }







        </div>
    );
};

export default SubCategory;

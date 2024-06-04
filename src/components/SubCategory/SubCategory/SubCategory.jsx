'use client'
import slugify from '@/utils/slugify';
import { fetcher } from '@/utils/swrFetcher';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import useSWR from 'swr';



const SubCategory = ({ subCategoriesByCategoryId }) => {

    const { slug, slugId } = useParams()

    const [subCategoryId, setSubCategoryId] = useState(subCategoriesByCategoryId?.data?.sub_categories?.[0]?._id)


    const { data: assetBySubCategoryId, isLoading, } = useSWR(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/sub-categories/${subCategoryId}`,
        fetcher
    );


    console.log("assetBySubCategoryId", assetBySubCategoryId);



    return (
        <div>
            <div className='bg-secondary py-2'>
                <h1 className='text-white font-semibold text-2xl text-center'>{subCategoriesByCategoryId?.data?.name}</h1>
            </div>

            <div className='grid md:grid-cols-8 grid-cols-2 gap-4 bg-primary py-8'>
                {
                    subCategoriesByCategoryId?.data?.sub_categories?.map((subCategory) => (
                        <div className='cursor-pointer' key={subCategory?._id} onClick={() => setSubCategoryId(subCategory?._id)}>
                            {subCategory?.image && <Image
                                src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
                                    subCategory?.image}
                                height={400}
                                width={500}
                                alt={subCategory?.name}
                                className='w-full h-28'
                            ></Image>}

                            <div className='bg-secondary py-1'>
                                <p className='text-white font-semibold text-sm text-center'>{subCategory?.name}</p>
                            </div>
                        </div>

                    ))
                }
            </div>





            <div className='mt-5 bg-secondary py-8 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 px-1'>
                {
                    assetBySubCategoryId?.data?.assets?.map((assets) => (
                        <div className='lg:w-[300px] md:[1-200px]  w-full  lg:h-[308px]  md:[h-200px] h-auto mx-auto mb-5' key={assets?._id}>
                            <Link href={`/${slugify(assetBySubCategoryId?.data?.category?.name)}/${slugify(assetBySubCategoryId?.data?.name)}/${slugify(assets?.name)}-${assets?._id}`}>
                                {assets?.cover && <Image
                                    src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
                                        assets?.cover}
                                    height={400}
                                    width={400}
                                    alt={assets?.name}
                                    className=' rounded-full'
                                ></Image>}

                                <p className='text-white text-center font-semibold mt-1 '>{assets?.name}</p>
                            </Link>

                        </div>
                    ))
                }

            </div>

        </div>
    );
};

export default SubCategory;
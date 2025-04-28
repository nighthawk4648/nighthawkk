
import slugify from '@/utils/slugify';
import React from 'react';

import all_sub_cat_image from '../../../../public/assets/sub_category/all.png'
import Image from 'next/image';
import getData from '@/utils/getData';
import Link from 'next/link';
import { getOptimizedImageUrl } from '@/utils/cloudinary';



const SingleSubCategoryPage = async ({ categoryId, subCategoryId }) => {

    const subCategoriesByCategoryId = await getData(`categories/${categoryId}`);

    const assetBySubCategoryId = await getData(`sub-categories/${subCategoryId}`);



    // Sort the assets in descending order based on id
    const sortedAssets = assetBySubCategoryId?.data?.assets?.slice().sort((a, b) => b.id - a.id);

    const getOriginalImageUrl = (imagePath) => {
        return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
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
                            <p className='text-white font-semibold text-sm text-center'>All</p>
                        </div></Link>

                </div>

                {
                    subCategoriesByCategoryId?.data?.sub_categories?.map((subCategory) => (
                        <div className='cursor-pointer' key={subCategory?.id} >
                            <Link href={`${slugify(subCategory?.name)}-${subCategory?.id}`}>
                                {subCategory?.image && <Image
                                     src={getOptimizedImageUrl(getOriginalImageUrl(subCategory?.image))}
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



            <div className=' bg-primary py-8 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 px-4'>
                {
                    sortedAssets?.map((assets) => (
                        <div>
                            <div
                                className='lg:w-[300px] md:[w-200px] w-full lg:h-[308px] md:[h-200px] h-auto mx-auto mb-5 relative overflow-hidden'
                                key={assets?.id}>
                                <Link href={`/${slugify(assetBySubCategoryId?.data?.category?.name)}/${slugify(assetBySubCategoryId?.data?.name)}/${slugify(assets?.name)}-${assets?.id}`}>
                                    {assets?.cover && <Image
                                
                                        src={getOptimizedImageUrl(getOriginalImageUrl(assets?.cover))}
                                        height={400}
                                        width={400}
                                        alt={assets?.name}
                                        className='transform transition-transform duration-1000 hover:scale-150'
                                        style={{ transformOrigin: 'center' }}
                                    ></Image>}


                                </Link>
                            </div>
                            <p className='text-white text-center font-semibold mt-2 z-10 relative'><Link href={`/${slugify(assetBySubCategoryId?.data?.category?.name)}/${slugify(assetBySubCategoryId?.data?.name)}/${slugify(assets?.name)}-${assets?.id}`}>{assets?.name}</Link></p>
                        </div>
                    ))
                }
            </div>


        </div>
    );
};

export default SingleSubCategoryPage;
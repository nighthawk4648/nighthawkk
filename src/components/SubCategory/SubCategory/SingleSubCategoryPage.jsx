
import slugify from '@/utils/slugify';
import React from 'react';

import all_sub_cat_image from '../../../../public/assets/sub_category/all.png'
import Image from 'next/image';
import getData from '@/utils/getData';
import Link from 'next/link';


export async function generateMetadata({ params }) {

    const {category, subCategoryName} = params;

    const subCategoryId = subCategoryName?.split("-").slice(-1);

    const metaSettings = await getData(`sub-categories/${subCategoryId}`); // Replace with actual call to fetch site settings
    const metaTitle = metaSettings?.data?.meta_title;
    const metaDescription = metaSettings?.data?.meta_description;

    return {
        title: `${metaTitle}`,
        description: `${metaDescription}`,
    };
}



const SingleSubCategoryPage = async ({ categoryId, subCategoryId }) => {

    const subCategoriesByCategoryId = await getData(`categories/${categoryId}`);

    const assetBySubCategoryId = await getData(`sub-categories/${subCategoryId}`);

  

    // Sort the assets in descending order based on id
    const sortedAssets = assetBySubCategoryId?.data?.assets?.slice().sort((a, b) => b.id - a.id);


    return (
        <div>
            <div className='bg-secondary py-2'>
                <h1 className='text-white font-semibold text-2xl text-center'>{subCategoriesByCategoryId?.data?.name}</h1>
            </div>


            <div className='grid md:grid-cols-8 grid-cols-2 gap-4 bg-thirdColor py-8 px-4'>
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



            <div className='mt-5 bg-primary py-8 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 px-4'>
                {
                    sortedAssets?.map((assets) => (
                        <div
                            className='lg:w-[300px] md:[w-200px] w-full lg:h-[308px] md:[h-200px] h-auto mx-auto mb-5'
                            key={assets?.id}>
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
            </div>


        </div>
    );
};

export default SingleSubCategoryPage;
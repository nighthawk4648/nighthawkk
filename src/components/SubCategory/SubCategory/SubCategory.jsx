import slugify from '@/utils/slugify';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import all_sub_cat_image from '../../../../public/assets/sub_category/all.png'

const SubCategory = ({ subCategoriesByCategoryId }) => {


    console.log("subCategoriesByCategoryId", subCategoriesByCategoryId);


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
                                    src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE + subCategory?.image}
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




            {
    subCategoriesByCategoryId?.data?.sub_categories?.map((subCategories) => (
        <div
            key={subCategories?.id}
            className='bg-primary py-8 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 px-4'>
            {
                // Sort assets by ID in descending order (latest first)
                subCategories?.assets?.sort((a, b) => b.id - a.id).map((asset) => (
                   <div>
                     <div className='lg:w-[300px] md:w-[200px] w-full lg:h-[308px] md:h-[200px] h-auto mx-auto  relative overflow-hidden' key={asset?.id}>
                        <Link href={`/${slugify(asset?.sub_category?.category?.name)}/${slugify(asset?.sub_category?.name)}/${slugify(asset?.name)}-${asset?.id}`}>
                            <div className='relative'>
                                {asset?.cover && (
                                    <Image
                                        src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE + asset?.cover}
                                        height={400}
                                        width={400}
                                        alt={asset?.name}
                                        className='transform transition-transform duration-1000 hover:scale-150'
                                        style={{ transformOrigin: 'center' }} // Ensures scaling from the center
                                    />
                                )}
                               
                            </div>
                        </Link>
                    </div>
                    <h3 className='text-white text-center font-semibold mt-2 z-10 relative'><Link href={`/${slugify(asset?.sub_category?.category?.name)}/${slugify(asset?.sub_category?.name)}/${slugify(asset?.name)}-${asset?.id}`} >{asset?.name}</Link></h3>
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

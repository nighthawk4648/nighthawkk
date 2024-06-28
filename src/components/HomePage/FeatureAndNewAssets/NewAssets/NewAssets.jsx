import Image from 'next/image';
import React from 'react';
import slugify from '@/utils/slugify';
import Link from 'next/link';

const NewAssets = ({ categories }) => {


    return (
        <div className='mt-10  py-5 ' >
            <div className='bg-black border border-black'>
                <h1 className='text-center font-semibold text-2xl text-white p-2 '>New Assets</h1>
            </div>

            <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mt-10  md:w-[70%] mx-auto'>
                {
                    categories?.map((category) => (
                        <div key={category?.id} className=''>
                            {
                                category?.sub_categories?.[0]?.assets?.slice(0, 3)?.map((assets) => (
                                    <div key={assets?.id} className='mt-5'>
                                        <Link href={`/${slugify(category?.name)}/${slugify(category?.sub_categories?.[0]?.name)}/${slugify(assets?.name)}-${assets?.id}`}>
                                            {assets?.cover && <Image
                                                src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE +
                                                    assets?.cover}
                                                height={800}
                                                width={800}
                                                alt=''
                                                className='w-[300px] h-[300px] mx-auto rounded-md'
                                            ></Image>}
                                            <div className='bg-secondary text-white text-center py-2 rounded-md  w-[300px] mx-auto'>
                                                <p>{assets?.name}</p>
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            }

                        </div>
                    ))
                }

            </div>

        </div>
    );
};

export default NewAssets;
import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import slugify from '@/utils/slugify';

const Features = ({categories}) => {

    const features = [
        {
            id: 1,
            image: '/assets/homepage/secondSection/features.png',
            title: '3D Model',
            slug: '3d-model'
        },

        {
            id: 2,
            image: '/assets/homepage/secondSection/features.png',
            title: 'Texture',
            slug: 'texture-model'
        },

        {
            id: 3,
            image: '/assets/homepage/secondSection/features.png',
            title: 'Interior Design',
            slug: 'scenes-model'
        }
    ]

    return (
        <div className='mt-5 grid  md:grid-cols-3 grid-cols-1 gap-5'>

            {
                categories?.map((category) => (
                    <div key={category?._id} className=' '>
                        <Link href={`/${slugify(category?.name)}-${category?._id}`}>
                        { category?.image &&  <Image
                            src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
                                category?.image}
                            height={500}
                            width={500}
                            alt={category?.name}
                            className='md:w-[200px] md:h-[200px] w-[150px] h-[150px] mx-auto rounded-full'
                        ></Image>}
                        

                        <p className='text-center font-semibold text-xl mt-2'>{category?.name}</p>
                        </Link>
                    </div>
                ))
            }

        </div>
    );
};

export default Features;
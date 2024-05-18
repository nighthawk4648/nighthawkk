import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

const Features = () => {

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
            title: 'Scenes',
            slug: 'scenes-model'
        }
    ]


    return (
        <div className='mt-5 grid  md:grid-cols-3 grid-cols-1 gap-5'>

            {
                features?.map((feature) => (
                    <div key={feature?.id} className=' '>
                        <Link href={`/${feature?.slug}/${feature?.id}`}>
                        <Image
                            src={feature?.image}
                            height={500}
                            width={500}
                            alt='feattures'
                            className='md:w-[150px] md:h-[150px] w-[100px] h-[100px] mx-auto '
                        ></Image>
                        </Link>

                        <p className='text-center font-semibold text-xl mt-2'>{feature?.title}</p>

                    </div>
                ))
            }

        </div>
    );
};

export default Features;
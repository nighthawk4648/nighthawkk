import React from 'react';

import Image from 'next/image';

const Features = () => {

    const features = [
        {
            id: 1,
            image: '/assets/homepage/secondSection/features.png',
            title: '3D Model'
        },

        {
            id: 2,
            image: '/assets/homepage/secondSection/features.png',
            title: 'Texture'
        },

        {
            id: 3,
            image: '/assets/homepage/secondSection/features.png',
            title: 'Scenes'
        }
    ]


    return (
        <div className='mt-5 grid  md:grid-cols-3 grid-cols-1 gap-5'>

            {
                features?.map((feature) => (
                    <div key={feature?.id} className=' '>
                        <Image
                            src={feature?.image}
                            height={500}
                            width={500}
                            alt='feattures'
                            className='w-[150px] h-[150px] mx-auto '
                        ></Image>

                        <p className='text-center font-semibold text-xl mt-2'>{feature?.title}</p>

                    </div>
                ))
            }

        </div>
    );
};

export default Features;
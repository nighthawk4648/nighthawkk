import Image from 'next/image';
import React from 'react';
import image from '../../../../../public/assets/homepage/newassets/newAssets_1.webp'

const NewAssets = () => {
    const newAssets = [
        {
            id: 1,
            image: '/assets/homepage/newassets/newAssets_1.webp',
            title: '3D Model'
        },

        {
            id: 2,
            image: '/assets/homepage/newassets/newAssets_1.webp',
            title: 'Texture'
        },

        {
            id: 3,
            image: '/assets/homepage/newassets/newAssets_1.webp',
            title: 'Scenes'
        },
        {
            id: 4,
            image: '/assets/homepage/newassets/newAssets_1.webp',
            title: '3D Model'
        },

        {
            id: 5,
            image: '/assets/homepage/newassets/newAssets_1.webp',
            title: 'Texture'
        },

        {
            id: 6,
            image: '/assets/homepage/newassets/newAssets_1.webp',
            title: 'Scenes'
        },
        {
            id: 7,
            image: '/assets/homepage/newassets/newAssets_1.webp',
            title: '3D Model'
        },

        {
            id: 8,
            image: '/assets/homepage/newassets/newAssets_1.webp',
            title: 'Texture'
        },

    ]


    return (
        <div className='mt-10' >
            <h1 className='text-center font-semibold text-2xl '>New Assets</h1>

            <div className='grid md:grid-cols-4 grid-cols-2 gap-5 mt-5'>
            {
                newAssets?.map((newAsset) => (
                    <div key={newAsset?.id}>
                        <Image
                            src={newAsset?.image}
                            height={800}
                            width={800}
                            alt=''
                        ></Image>
                        <div className='bg-secondary text-white text-center py-2'>
                            <p>{newAsset?.title}</p>
                        </div>

                    </div>
                ))
            }

            </div>

        </div>
    );
};

export default NewAssets;
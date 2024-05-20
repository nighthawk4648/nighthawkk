'use client'
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';



const Models = () => {

    const { slug, slugId } = useParams()

    // console.log("params", params);


    const models = [
        {
            id: 1,
            image: '/assets/models/models1.jpeg',
            title: '3D Model',
            slug: '3d-model'
        },

        {
            id: 2,
            image: '/assets/models/models2.jpeg',
            title: 'Texture',
            slug: 'texture-model'
        },

        {
            id: 3,
            image: '/assets/models/models3.jpeg',
            title: 'Scenes',
            slug: 'scenes-model'
        },

        {
            id: 4,
            image: '/assets/models/models4.jpeg',
            title: 'Scenes',
            slug: 'scenes-model'
        },

        {
            id: 5,
            image: '/assets/models/models3.jpeg',
            title: 'Scenes',
            slug: 'scenes-model'
        },

        {
            id: 6,
            image: '/assets/models/models4.jpeg',
            title: 'Scenes',
            slug: 'scenes-model'
        },

        {
            id: 7,
            image: '/assets/models/models1.jpeg',
            title: '3D Model',
            slug: '3d-model'
        },

        {
            id: 8,
            image: '/assets/models/models2.jpeg',
            title: 'Texture',
            slug: 'texture-model'
        },

        {
            id: 9,
            image: '/assets/models/models3.jpeg',
            title: 'Scenes',
            slug: 'scenes-model'
        },

        {
            id: 10,
            image: '/assets/models/models4.jpeg',
            title: 'Scenes',
            slug: 'scenes-model'
        },

        {
            id: 11,
            image: '/assets/models/models3.jpeg',
            title: 'Scenes',
            slug: 'scenes-model'
        },

        {
            id: 12,
            image: '/assets/models/models4.jpeg',
            title: 'Scenes',
            slug: 'scenes-model'
        }


    ]


    const modelExs = [
        {
            id: 1,
            image: '/assets/models/features.png',
            title: '3D Model',
            slug: '3d-model'
        },

        {
            id: 2,
            image: '/assets/models/features.png',
            title: '3D Model',
            slug: '3d-model'
        },

        {
            id: 3,
            image: '/assets/models/features.png',
            title: '3D Model',
            slug: '3d-model'
        },

        {
            id: 4,
            image: '/assets/models/features.png',
            title: '3D Model',
            slug: '3d-model'
        },

        {
            id: 5,
            image: '/assets/models/features.png',
            title: '3D Model',
            slug: '3d-model'
        },

        {
            id: 6,
            image: '/assets/models/features.png',
            title: '3D Model',
            slug: '3d-model'
        },

        {
            id: 7,
            image: '/assets/models/features.png',
            title: '3D Model',
            slug: '3d-model'
        },


    ]


    return (
        <div>
            <div className='bg-secondary py-2'>
                <h1 className='text-white font-semibold text-2xl text-center'>TEXTURES</h1>
            </div>

            <div className='grid md:grid-cols-8 grid-cols-2 gap-4 bg-primary py-8'>
                {
                    models?.map((model) => (
                        <div className='cursor-pointer'>
                            <Image
                                src={model?.image}
                                height={400}
                                width={500}
                                alt=''
                                className='w-full h-28'
                            ></Image>

                            <div className='bg-secondary py-1'>
                                <p className='text-white font-semibold text-sm text-center'>{model?.title}</p>
                            </div>
                        </div>

                    ))
                }
            </div>

            <div className='mt-5 bg-secondary py-8 grid md:grid-cols-4 grid-cols-2 gap-4 px-1'>
                {
                    modelExs?.map((modelEx) => (
                        <div className='md:w-[300px] w-full h-auto md:h-[308px] mx-auto mb-5'>
                            <Link href={`/${slug}/${slugId}/${modelEx?.slug}/${modelEx?.id}`}>
                                <Image
                                    src={modelEx?.image}
                                    height={400}
                                    width={400}
                                    alt=''
                                    className=' rounded-full'
                                ></Image>

                                <p className='text-white text-center font-semibold mt-1 '>{modelEx?.title}</p>
                            </Link>

                        </div>
                    ))
                }

            </div>

        </div>
    );
};

export default Models;
import { getOptimizedImageUrl } from '@/utils/cloudinary';
import Image from 'next/image';
import React from 'react';

const AboutUs = ({ aboutUs }) => {

    const getOriginalImageUrl = (imagePath) => {
        return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
    }; 

    return (
        // <div className="bg-[url('/assets/bgImage/bgBlack.jpeg')] bg-cover bg-center w-full text-white p-5">
        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-5">
            {aboutUs?.title &&
                <div className=''>
                    <p className='text-center font-semibold text-2xl text-white p-2 '>{aboutUs?.title}</p>
                </div>
                // <p className='text-center font-semibold text-2xl text-white p-2 '>{aboutUs?.title}</p>

                }

            {
                aboutUs?.short_description && <p className='text-center mt-2 text-white'>{aboutUs?.short_description}</p>
            }

            <div className=' md:flex md:items-center md:gap-5  mt-5'>

                <div className='md:w-[50%] text-white text-justify'>
                    {aboutUs?.content && <div dangerouslySetInnerHTML={{ __html: aboutUs?.content }} ></div>}
                </div>

                <div className='md:w-[50%] mx-auto md:mt-0 mt-10 md:flex md:items-center md:justify-center gap-5'>
                    <div>
                        <Image
                                src={getOptimizedImageUrl(getOriginalImageUrl(aboutUs?.cover))}
                            height={800}
                            width={1300}
                            className='w-[300px] h-[300px] mx-auto rounded-full'
                            alt={aboutUs?.title}
                        ></Image>
                    </div>

                    {/* <p>{aboutUs?.name}</p> */}
                </div>

            </div>
        </div>
    );
};

export default AboutUs;

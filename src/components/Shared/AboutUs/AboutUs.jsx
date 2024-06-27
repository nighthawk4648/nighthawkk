import Image from 'next/image';
import React from 'react';

const AboutUs = ({ aboutUs }) => {
    return (
        <div className='bg-thirdColor p-5'>
            {aboutUs?.title && <h1 className='text-center font-semibold text-2xl'>{aboutUs?.title}</h1>}

            {
                aboutUs?.short_description && <p className='text-center mt-2'>{aboutUs?.short_description}</p>
            }

            <div className=' md:flex md:items-center md:gap-5  mt-5'>

                <div className='md:w-[50%]'>
                    {aboutUs?.content && <div dangerouslySetInnerHTML={{ __html: aboutUs?.content }} ></div>}
                </div>

                <div className='md:w-[50%] md:mt-0 mt-10'>
                    <Image
                        src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE +
                            aboutUs?.cover}
                        height={800}
                        width={1300}
                        className='w-[300px] h-[300px] mx-auto rounded-full'
                        alt={aboutUs?.title}
                    ></Image>
                </div>

            </div>
        </div>
    );
};

export default AboutUs;
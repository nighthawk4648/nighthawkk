import Image from 'next/image';
import React from 'react';

const AboutUs = ({ aboutUs }) => {
    return (
        <div className='bg-thirdColor py-5 px-5'>
            {aboutUs?.title &&
                <div className='bg-black border border-black'>
                    <h2 className='text-center font-semibold text-2xl text-white p-2 '>{aboutUs?.title}</h2>
                </div>}

            {
                aboutUs?.short_description && <p className='text-center mt-2 text-white'>{aboutUs?.short_description}</p>
            }

            <div className=' md:flex md:items-center md:gap-5  mt-5'>

                <div className='md:w-[50%] text-white'>
                    {aboutUs?.content && <div dangerouslySetInnerHTML={{ __html: aboutUs?.content }} ></div>}
                </div>

                <div className='md:w-[50%] mx-auto md:mt-0 mt-10 md:flex md:items-center md:justify-center gap-5'>
                    <div>
                        <Image
                            src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE +
                                aboutUs?.cover}
                            height={800}
                            width={1300}
                            className='w-[300px] h-[300px] mx-auto rounded-full'
                            alt={aboutUs?.title}
                        ></Image>
                    </div>

                    {/* <p>{aboutUs?.name}</p> */}
                    <div>
                        <p className='text-center md:mt-0 mt-3 text-white'><span className='font-semibold'>Founder: </span> {aboutUs?.name || 'Majharul Islam Asik'}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutUs;

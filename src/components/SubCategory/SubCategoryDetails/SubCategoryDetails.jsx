'use client'
import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

// import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';

const SubCategoryDetails = ({ assetDetails }) => {

    console.log("assetDetails", assetDetails);

    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <div className=''>
            <div className='bg-secondary py-5'>
                <Swiper
                    style={{
                        '--swiper-navigation-color': '#fff',
                        '--swiper-pagination-color': '#fff',
                    }}
                    loop={true}
                    spaceBetween={10}
                    // navigation={true}
                    thumbs={{ swiper: thumbsSwiper }}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mySwiper2"
                >
                    {
                        assetDetails?.images?.map((image) => (
                            <SwiperSlide key={image?.id}>
                                <Image
                                        src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE + image?.image}
                                        alt=''
                                        height={1000}
                                        width={1000}
                                        className='md:w-[1147px] mx-auto md:h-[578px] w-full h-[200px] rounded-md' 

                                    />
                            </SwiperSlide>

                        ))
                    }


                </Swiper>
            </div>

            <div className='bg-primary  py-5'>
                <div className='md:w-[60%] mx-auto '>
                    <Swiper
                        onSwiper={setThumbsSwiper}
                        loop={true}
                        // spaceBetween={10}
                        // slidesPerView={6}
                        breakpoints={{
                            0: {
                                slidesPerView: 3,
                            },

                            520: {
                                slidesPerView: 3,
                            },

                            768: {
                                slidesPerView: 5,
                            },

                            1000: {
                                slidesPerView: 5,
                            },

                            1100: {
                                slidesPerView: 6,
                            },
                        }}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="mySwiper"
                    >
                        {
                            assetDetails?.images?.map((image, index) => (
                                <SwiperSlide key={image?.id} className=''>
                                    <Image
                                        src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE + image?.image}
                                        alt=''
                                        height={150}
                                        width={150}
                                        className='md:w-28 w-20 mx-auto h-auto rounded-md'

                                    />

                                </SwiperSlide>

                            ))
                        }

                    </Swiper>
                </div>
            </div>


            <div className=' bg-secondary py-5 text-white px-5 '>
                <p className='md:text-2xl mb-1 font-semibold  '>ASSET DETAILS</p>
                <h1 className='text-sm'><span className='font-semibold'>Name - </span><span className='text-xs'>{assetDetails?.name}</span></h1>
                <h2 className='text-sm' > <span className='font-semibold'>Size - </span> <span className='text-xs'>{assetDetails?.size}</span></h2>
                <h3 className='text-sm'> <span className='font-semibold'>Resolution - </span> <span className='text-xs'>{assetDetails?.resolution}</span></h3>

                <div className='w-48 mx-auto p-1 bg-primary mt-10 rounded-md cursor-pointer'>
                   { assetDetails?.download_link && <Link href={assetDetails?.download_link} target="_blank" ><p className='font-semibold text-center'>DOWNLOAD</p></Link>}
                </div>
            </div>
        </div>
    );
};

export default SubCategoryDetails;
'use client'
import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Autoplay, Pagination, Navigation } from 'swiper/modules'

import Image from 'next/image';



const Carousel = ({carousels}) => {

    console.log("carousels", carousels);
   

    return (
        <div>

            <>
                <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="mySwiper"
                >
                    {
                        carousels?.map((carousel) => (
                            <SwiperSlide key={carousel?.id}>
                                <div className="relative">
                                  <Image
                                        src={ process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE +
                                            carousel?.image}
                                        height={800}
                                        width={1300}
                                        className='w-full md:h-[800px] h-[430px]'
                                        alt={carousel?.name}
                                    ></Image>

                                </div>
                                <div className="absolute inset-0 flex items-center justify-center ">
                                    <div>
                                       { carousel?.logo && <Image 
                                            src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE +
                                                carousel?.logo}
                                            height={500}
                                            width={500}
                                            className='md:w-48 w-24 mx-auto h-auto'
                                            alt={carousel?.name}
                                        ></Image>}
                                        <h1 className='text-white font-bold md:text-3xl text-xl text-center mt-1'> {carousel.name}</h1>
                                    </div>
                                </div>

                            </SwiperSlide>

                        ))
                    }

                </Swiper>
            </>

        </div>
    );
};

export default Carousel;
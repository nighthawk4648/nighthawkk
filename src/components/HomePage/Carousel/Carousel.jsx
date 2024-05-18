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



const Carousel = () => {
    const carousels = [
        {
            id: 1,
            image: '/assets/homepage/carousels/carousel_1.jpeg',
            logo: '/assets/homepage/carousels/carousel_Logo.png',
            title: 'Hello World'
        },

        {
            id: 2,
            image: '/assets/homepage/carousels/carousel_2.jpeg',
            logo: '/assets/homepage/carousels/carousel_Logo.png',
            title: 'Hello World 2'
        },

        {
            id: 3,
            image: '/assets/homepage/carousels/Carousel_3.jpeg',
            logo: '/assets/homepage/carousels/carousel_Logo.png',
            title: 'Hello World 3'
        }
    ]
    return (
        <div>

            <>
                <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                        delay: 2500,
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
                            <SwiperSlide>
                                <div className="relative">
                                    <Image
                                        src={carousel?.image}
                                        height={900}
                                        width={900}
                                        className='w-full md:h-[500px] h-[430px]'
                                        alt='carousels'
                                    ></Image>

                                </div>
                                <div className="absolute inset-0 flex items-center justify-center ">
                                    <div>
                                        <Image
                                            src={carousel?.logo}
                                            height={500}
                                            width={500}
                                            className='md:w-32 w-20 mx-auto h-auto'
                                            alt='carousels'
                                        ></Image>
                                        <p className='text-white font-bold md:text-3xl text-xl text-center mt-1'> {carousel.title}</p>
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
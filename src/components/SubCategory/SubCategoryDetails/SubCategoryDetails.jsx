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

const SubCategoryDetails = () => {

    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    const demos = [
        {
            id: 1,
            image: 'https://swiperjs.com/demos/images/nature-1.jpg',
        },

        {
            id: 2,
            image: 'https://swiperjs.com/demos/images/nature-2.jpg',
        },

        {
            id: 3,
            image: 'https://swiperjs.com/demos/images/nature-3.jpg',
        },

        {
            id: 4,
            image: 'https://swiperjs.com/demos/images/nature-4.jpg',
        },

        {
            id: 5,
            image: 'https://swiperjs.com/demos/images/nature-5.jpg',
        },

        {
            id: 6,
            image: 'https://swiperjs.com/demos/images/nature-6.jpg',
        },

        {
            id: 7,
            image: 'https://swiperjs.com/demos/images/nature-7.jpg',
        },

        {
            id: 8,
            image: 'https://swiperjs.com/demos/images/nature-8.jpg',
        },

        {
            id: 9,
            image: 'https://swiperjs.com/demos/images/nature-9.jpg',
        },

        {
            id: 10,
            image: 'https://swiperjs.com/demos/images/nature-10.jpg',
        },

    ]

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
                    demos?.map((demo) => (
                        <SwiperSlide key={demo?.id}>
                            <img src={demo?.image} className='md:w-[1147px] mx-auto md:h-[578px] w-full h-[200px] rounded-md' />
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
                            demos?.map((demo) => (
                                <SwiperSlide key={demo?.id} className=''>
                                    <img src={demo?.image} className='md:w-28 w-20 mx-auto h-auto rounded-md' />
                                </SwiperSlide>

                            ))
                        }

                    </Swiper>
                </div>
            </div>


            <div className=' bg-secondary py-5 text-white px-5 '>
                <h1 className='md:text-2xl mb-1 font-semibold  '>ASSET DETAILS</h1>
                <p className='text-sm'><span className='font-semibold'>Name - </span><span className='text-xs'>Lorem, ipsum dolor sit amet </span></p>
                <p className='text-sm' > <span className='font-semibold'>Size - </span> <span className='text-xs'>Lorem, ipsum </span></p>
                <p className='text-sm'> <span className='font-semibold'>Resolution - </span> <span className='text-xs'>Lorem, ipsum dolor</span></p>


                <div className='w-48 mx-auto p-1 bg-primary mt-10 rounded-md cursor-pointer'>
                    <p className='font-semibold text-center'>DOWNLOAD</p>
                </div>
            </div>
        </div>
    );
};

export default SubCategoryDetails;
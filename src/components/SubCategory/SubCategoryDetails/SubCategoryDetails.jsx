'use client'
import React, { useEffect, useState } from 'react';
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
import { getOptimizedImageUrl } from '@/utils/cloudinary';
import Script from 'next/script';


const SubCategoryDetails = ({ assetDetails }) => {

    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [showAds, setShowAds] = useState(false);

    useEffect(() => {
        // Check if window width is greater than mobile breakpoint
        // Only show ads on desktop/tablet
        const handleResize = () => {
            setShowAds(window.innerWidth >= 768);
        };

        // Initial check
        handleResize();

        // Add resize listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const getOriginalImageUrl = (imagePath) => {
        return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
    };


    return (
        <div className=''>
            <div className='bg-secondary py-5'>
                {/* AdSense Script */}

                <div className="flex justify-center items-center relative">
                    {/* Left Ad - Only visible on desktop/tablet */}
                    {showAds && (
                        <div className="hidden md:block w-48 h-[578px] mr-4">
                            <ins className="adsbygoogle"
                                style={{ display: 'block', width: '100%', height: '100%' }}
                                data-ad-client="ca-pub-5557791257949251"
                                data-ad-slot="2445550536"
                                data-ad-format="vertical"
                                data-full-width-responsive="false">
                            </ins>
                            <Script id="left-ad-script">
                                {`(adsbygoogle = window.adsbygoogle || []).push({});`}
                            </Script>
                        </div>
                    )}

                    {/* Main Swiper */}
                    <div className="max-w-[1147px] w-full">
                        <Swiper
                            style={{
                                '--swiper-navigation-color': '#fff',
                                '--swiper-pagination-color': '#fff',
                            }}
                            loop={true}
                            spaceBetween={10}
                            thumbs={{ swiper: thumbsSwiper }}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="mySwiper2"
                        >
                            {
                                assetDetails?.images?.map((image) => (
                                    <SwiperSlide key={image?.id}>
                                        <Image
                                            src={getOptimizedImageUrl(getOriginalImageUrl(image?.image))}
                                            alt=''
                                            height={1600}
                                            width={1600}
                                            className='md:w-[1147px] mx-auto md:h-[578px] w-full h-[200px] rounded-md'
                                        />
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </div>

                    {/* Right Ad - Only visible on desktop/tablet */}
                    {showAds && (
                        <div className="hidden md:block w-48 h-[578px] ml-4">
                            <ins className="adsbygoogle"
                                style={{ display: 'block', width: '100%', height: '100%' }}
                                data-ad-client="ca-pub-5557791257949251"
                                data-ad-slot="2445550536"
                                data-ad-format="vertical"
                                data-full-width-responsive="false">
                            </ins>
                            <Script id="right-ad-script">
                                {`(adsbygoogle = window.adsbygoogle || []).push({});`}
                            </Script>
                        </div>
                    )}
                </div>
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
                                        src={getOptimizedImageUrl(getOriginalImageUrl(image?.image))}
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

                <div className='w-48 mx-auto p-1 bg-primary mt-10 rounded-md cursor-pointer border-b-2 border-gray-500'>
                    {assetDetails?.download_link && <Link href={assetDetails?.download_link} target="_blank" ><p className='font-semibold text-center'>DOWNLOAD</p></Link>}
                </div>
            </div>
        </div>
    );
};

export default SubCategoryDetails;
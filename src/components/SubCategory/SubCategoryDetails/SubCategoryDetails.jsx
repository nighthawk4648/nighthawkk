'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { getOptimizedImageUrl } from '@/utils/cloudinary';
import { HorizontalBanner } from '@/components/Shared/GoogleAdsense/HorizontalBanner';

const SubCategoryDetails = ({ assetDetails }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [showAds, setShowAds] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [countdown, setCountdown] = useState(15);
    const [isCountdownActive, setIsCountdownActive] = useState(false);
    const modalAdRef = useRef(null);
    const leftAdRef = useRef(null);
    const rightAdRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            setShowAds(window.innerWidth >= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (showAds) {
            const loadAd = (ref) => {
                if (ref && ref.current) {
                    const width = ref.current.offsetWidth;
                    if (width > 0) {
                        try {
                            // Avoid double-initializing the same <ins> element
                            if (ref.current.getAttribute('data-adsbygoogle-status') !== 'done') {
                                (window.adsbygoogle = window.adsbygoogle || []).push({});
                            }
                        } catch (error) {
                            console.error('AdSense error:', error);
                        }
                    } else {
                        console.warn('Ad slot has zero width, skipping ad initialization.');
                    }
                }
            };
            loadAd(leftAdRef);
            loadAd(rightAdRef);
        }
    }, [showAds]);

    // Initialize ad inside modal when it opens
    useEffect(() => {
        if (isModalOpen && modalAdRef.current) {
            try {
                if (modalAdRef.current.getAttribute('data-adsbygoogle-status') !== 'done') {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                }
            } catch (error) {
                console.error('Modal AdSense error:', error);
            }
        }
    }, [isModalOpen]);

    // Countdown logic
    useEffect(() => {
        let timer = null;
        if (isCountdownActive && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }
        if (countdown === 0) {
            setIsCountdownActive(false);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isCountdownActive, countdown]);

    const getOriginalImageUrl = (imagePath) => {
        return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
    };

    return (
        <div className="">
            <div className="bg-secondary py-5">
                <div className="flex justify-center items-center relative">
                    {showAds && (
                        <div className="hidden md:block w-48 h-[578px] mr-4">
                            <ins
                                ref={leftAdRef}
                                className="adsbygoogle"
                                style={{ display: 'block', width: '100%', height: '100%' }}
                                data-ad-client="ca-pub-5557791257949251"
                                data-ad-slot="2445550536"
                                data-ad-format="vertical"
                                data-full-width-responsive="false"
                            ></ins>
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
                            {assetDetails?.images?.map((image) => (
                                <SwiperSlide key={image?.id}>
                                    <Image
                                        src={getOptimizedImageUrl(getOriginalImageUrl(image?.image))}
                                        alt={assetDetails?.name || "Asset Image"}
                                        height={1600}
                                        width={1600}
                                        className="md:w-[1147px] mx-auto md:h-[578px] w-full h-[200px] rounded-md"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {showAds && (
                        <div className="hidden md:block w-48 h-[578px] ml-4">
                            <ins
                                ref={rightAdRef}
                                className="adsbygoogle"
                                style={{ display: 'block', width: '100%', height: '100%' }}
                                data-ad-client="ca-pub-5557791257949251"
                                data-ad-slot="2445550536"
                                data-ad-format="vertical"
                                data-full-width-responsive="false"
                            ></ins>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-primary py-5">
                <div className="md:w-[60%] mx-auto">
                    <Swiper
                        onSwiper={setThumbsSwiper}
                        loop={true}
                        breakpoints={{
                            0: { slidesPerView: 3 },
                            520: { slidesPerView: 3 },
                            768: { slidesPerView: 5 },
                            1000: { slidesPerView: 5 },
                            1100: { slidesPerView: 6 },
                        }}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="mySwiper"
                    >
                        {assetDetails?.images?.map((image) => (
                            <SwiperSlide key={image?.id}>
                                <Image
                                    src={getOptimizedImageUrl(getOriginalImageUrl(image?.image))}
                                    alt={assetDetails?.name || "Thumbnail"}
                                    height={150}
                                    width={150}
                                    className="md:w-28 w-20 mx-auto h-auto rounded-md"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            <HorizontalBanner/>

            <div className="bg-secondary py-5 text-white px-5">
                <p className="md:text-2xl mb-1 font-semibold">ASSET DETAILS</p>
                <h1 className="text-sm">
                    <span className="font-semibold">Name - </span>
                    <span className="text-xs">{assetDetails?.name}</span>
                </h1>
                <h2 className="text-sm">
                    <span className="font-semibold">Size - </span>
                    <span className="text-xs">{assetDetails?.size}</span>
                </h2>
                <h3 className="text-sm">
                    <span className="font-semibold">Resolution - </span>
                    <span className="text-xs">{assetDetails?.resolution}</span>
                </h3>

                {assetDetails?.download_link && (
                    <div className="w-48 mx-auto p-1 bg-primary mt-10 rounded-md cursor-pointer border-b-2 border-gray-500">
                        <button
                            type="button"
                            onClick={() => {
                                // open modal interstitial
                                setCountdown(15); // reset
                                setIsModalOpen(true);
                                setIsCountdownActive(true);
                            }}
                            className="w-full"
                        >
                            <p className="font-semibold text-center">DOWNLOAD</p>
                        </button>
                    </div>
                )}
            </div>
              <HorizontalBanner/>

            {/* Full screen modal for ad + countdown */}
                {/* Centered 2/3 modal with modern look. Footer moved to fixed bottom bar. */}
                {isModalOpen && (
                    <>
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 p-4">
                            <div className="relative w-full max-w-[1200px] h-full sm:w-[90vw] sm:h-[80vh] md:w-[66vw] md:h-[66vh] bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-none sm:rounded-2xl shadow-2xl overflow-hidden border border-gray-200 backdrop-blur-md">

                                {/* Ad area fills panel */}
                                <div className="absolute inset-0 w-full h-full">
                                    <ins
                                        ref={modalAdRef}
                                        className="adsbygoogle"
                                        style={{ display: 'block', width: '100%', height: '100%', margin: 0, padding: 0 }}
                                        data-ad-client="ca-pub-5557791257949251"
                                         data-ad-slot="2114378043"
                                         data-ad-format="auto"
                                         data-full-width-responsive="true"
                                        data-vignette-ad="true"
                                    ></ins>
                                </div>

                                {/* Top bar: title + countdown */}
                                <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gray-800 text-white">
                                    <div className="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                                        </svg>
                                        <h3 className="text-lg font-semibold">Preparing your download</h3>
                                    </div>
                                    <div className="text-sm font-medium">{countdown > 0 ? `Please wait ${countdown}s` : 'Ready'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Fixed bottom action bar so buttons are always reachable */}
                        <div className="fixed bottom-0 sm:bottom-4 left-0 right-0 z-[10000] flex items-center justify-center pointer-events-none px-2 sm:px-4">
                            <div className="pointer-events-auto max-w-[1200px] w-full mx-auto px-2">
                                <div className="bg-gray-800 rounded-t-lg sm:rounded-full shadow-lg px-3 sm:px-4 py-3 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            setIsCountdownActive(false);
                                        }}
                                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                                    >
                                        Close
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (countdown === 0) {
                                                window.open(assetDetails.download_link, '_blank');
                                                setIsModalOpen(false);
                                            }
                                        }}
                                        className={`px-4 py-2 rounded-md font-semibold ${countdown === 0 ? 'bg-primary text-white' : 'bg-gray-600 text-gray-500 cursor-not-allowed'}`}
                                        disabled={countdown !== 0}
                                    >
                                        {countdown === 0 ? 'Proceed to Download' : `Please wait ${countdown}s`}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
        </div>
    );
};

export default SubCategoryDetails;

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
import { CategoryAds } from '@/components/Shared/GoogleAdsense/categoryads';
import useSWR from 'swr';
import { fetcher } from '@/utils/swrFetcher';
import slugify from '@/utils/slugify';

const SubCategoryDetails = ({ assetDetails }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [showAds, setShowAds] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [countdown, setCountdown] = useState(15);
    const [isCountdownActive, setIsCountdownActive] = useState(false);
    const modalAdRef = useRef(null);
    const leftAdRef = useRef(null);
    const rightAdRef = useRef(null);

    // Fetch related assets from the same sub-category
    const { data: relatedAssetsData } = useSWR(
        assetDetails?.sub_category_id 
            ? `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/sub-categories/${assetDetails.sub_category_id}`
            : null,
        fetcher
    );

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

    // Filter related assets (exclude current asset and show 6 random assets)
    const relatedAssets = relatedAssetsData?.data?.assets
        ?.filter(asset => asset.id !== assetDetails?.id)
        ?.sort(() => Math.random() - 0.5) // Random shuffle
        ?.slice(0, 6) || [];

    return (
        <div className="">
            <div className="bg-secondary py-3 md:py-5">
                <div className="flex justify-center items-center relative px-2 md:px-4">
                    {showAds && (
                        <div className="hidden xl:block w-32 lg:w-40 h-[400px] lg:h-[500px] mr-2 lg:mr-4">
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
                    <div className="w-full max-w-6xl xl:max-w-[1147px]">
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
                                        className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[578px] object-cover rounded-md"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {showAds && (
                        <div className="hidden xl:block w-32 lg:w-40 h-[400px] lg:h-[500px] ml-2 lg:ml-4">
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

             <CategoryAds />

            <div className="bg-secondary py-5 text-white px-5">
                {/* <p className="md:text-2xl mb-1 font-semibold">ASSET DETAILS</p> */}
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
                <h4 className="text-sm max-w-md">
                    <span className="font-semibold">Short Description - </span>
                    <span className="text-xs">{assetDetails?.short_description}</span>
                </h4>

                {assetDetails?.id && (
                    <div className="w-48 mx-auto mt-10">
                        <button
                            type="button"
                            onClick={() => {
                                // open modal interstitial
                                setCountdown(10); // reset to 10 seconds
                                setIsModalOpen(true);
                                setIsCountdownActive(true);
                            }}
                            className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 active:scale-95"
                        >
                            <span className="relative z-10 font-semibold tracking-wide">DOWNLOAD</span>
                            <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
                        </button>
                    </div>
                )}

                {/* Related Assets Section */}
                {relatedAssets.length > 0 && (
                    <div className="mt-12 px-4 md:px-0">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 text-center">Related Assets</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-6 xl:grid-cols-6 gap-2 md:gap-3 lg:gap-4">
                            {relatedAssets.map((asset) => (
                                <div key={asset.id} className="group cursor-pointer">
                                    <div className="relative overflow-hidden rounded-lg mb-2 w-[300px] h-[300px] bg-gray-800">
                                        <Link 
                                            href={`/${slugify(relatedAssetsData?.data?.category?.name)}/${slugify(relatedAssetsData?.data?.name)}/${slugify(asset?.name)}-${asset?.id}`}
                                            className="block w-full h-full"
                                        >
                                            {asset?.cover && (
                                                <Image
                                                    src={getOptimizedImageUrl(getOriginalImageUrl(asset?.cover))}
                                                    height={300}
                                                    width={300}
                                                    alt={asset?.name}
                                                    className="w-full h-full object-cover transform transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </Link>
                                    </div>
                                    <p className="text-white text-center text-xs sm:text-sm font-medium line-clamp-2 group-hover:text-blue-400 transition-colors duration-200">
                                        <Link 
                                            href={`/${slugify(relatedAssetsData?.data?.category?.name)}/${slugify(relatedAssetsData?.data?.name)}/${slugify(asset?.name)}-${asset?.id}`}
                                            className="block w-full"
                                        >
                                            {asset?.name}
                                        </Link>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
               <CategoryAds />

           {/* Full screen modal for ad + countdown */}
{/* Centered modal with square ad format */}
{isModalOpen && (
    <>
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 p-4">
            <div className="relative w-full max-w-[min(90vw,600px)] bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-none sm:rounded-2xl shadow-2xl overflow-hidden border border-gray-200 backdrop-blur-md">

                {/* Top bar: title + countdown */}
                <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gray-800 text-white rounded-t-none sm:rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                        </svg>
                        <h3 className="text-lg font-semibold">Preparing your download</h3>
                    </div>
                    <div className="text-sm font-medium">{countdown > 0 ? `Please wait ${countdown}s` : 'Ready'}</div>
                </div>

                {/* Square ad area - aspect ratio 1:1 */}
                <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                    <div className="absolute inset-0 w-full h-full bg-gray-800/50 flex items-center justify-center">
                        <ins
                            ref={modalAdRef}
                            className="adsbygoogle"
                            style={{ display: 'block', width: '100%', height: '100%' }}
                            data-ad-client="ca-pub-5557791257949251"
                            data-ad-slot="2114378043"
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                        ></ins>
                    </div>
                </div>

                {/* Bottom action bar */}
                <div className="relative z-10 bg-gray-800 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-end gap-3 rounded-b-none sm:rounded-b-2xl border-t border-gray-700">
                    <button
                        type="button"
                        onClick={() => {
                            setIsModalOpen(false);
                            setIsCountdownActive(false);
                        }}
                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                        Close
                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (countdown === 0) {
                                                // Create a direct download link - this will show immediately in browser downloads
                                                const downloadUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/assets/${assetDetails.id}/download`;
                                                
                                                const a = document.createElement('a');
                                                a.style.display = 'none';
                                                a.href = downloadUrl;
                                                // The filename will be determined by the Content-Disposition header from the server
                                                a.download = ''; // Empty string lets browser use server's filename
                                                
                                                document.body.appendChild(a);
                                                a.click();
                                                
                                                setTimeout(() => {
                                                    document.body.removeChild(a);
                                                }, 100);
                                                
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

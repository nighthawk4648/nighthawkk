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

const SubCategoryDetails = ({ assetDetails }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [showAds, setShowAds] = useState(false);
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
            <Link href={assetDetails.download_link} target="_blank">
              <p className="font-semibold text-center">DOWNLOAD</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubCategoryDetails;

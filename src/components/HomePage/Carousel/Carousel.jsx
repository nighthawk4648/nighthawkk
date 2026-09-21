"use client";
import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";

import { Autoplay, EffectFade } from "swiper/modules";

import Image from "next/image";
import { getOptimizedImageUrl } from "@/utils/cloudinary";

const Carousel = ({ carousels }) => {
  const getOriginalImageUrl = (imagePath) => {
    return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
  };

  if (!carousels || carousels.length === 0) {
    return null;
  }

  return (
    <div>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        effect="fade"
        speed={3000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, EffectFade]}
        className="mySwiper"
      >
        {carousels.map((carousel, index) => (
          <SwiperSlide key={carousel?.id}>
            <div className="relative w-full md:h-[500px] sm:h-[350px] h-[250px] bg-gradient-to-r from-gray-950 via-slate-900 to-black overflow-hidden rounded-lg">
              {carousel?.image && (
                <Image
                  src={getOptimizedImageUrl(
                    getOriginalImageUrl(carousel?.image),
                  )}
                  fill
                  loading={index === 0 ? "eager" : "lazy"}
                  priority={index === 0}
                  className="w-full h-full object-cover opacity-80"
                  alt={carousel?.name || "Carousel Image"}
                />
              )}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="text-center px-4">
                  {carousel?.logo && (
                    <Image
                      src={getOptimizedImageUrl(
                        getOriginalImageUrl(carousel?.logo),
                      )}
                      height={200}
                      width={200}
                      loading={index === 0 ? "eager" : "lazy"}
                      priority={index === 0}
                      className="md:w-36 w-20 mx-auto h-auto mb-3"
                      alt={carousel?.name || "Logo"}
                    />
                  )}
                  <h1 className="text-white font-bold md:text-4xl text-2xl text-center tracking-wide drop-shadow-md">
                    {carousel?.name}
                  </h1>
                  {carousel?.short_description &&
                    carousel.short_description.trim().length > 1 && (
                      <p className="text-gray-300 md:text-base text-sm mt-2 max-w-xl mx-auto">
                        {carousel.short_description}
                      </p>
                    )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;

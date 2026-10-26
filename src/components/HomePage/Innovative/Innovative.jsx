import { getOptimizedImageUrl } from "@/utils/cloudinary";
import Image from "next/image";
import React from "react";

const Innovative = ({ innovatives = [] }) => {
  if (!innovatives || innovatives.length === 0) {
    return null;
  }

  const getOriginalImageUrl = (imagePath) => {
    return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE || ""}${imagePath}`;
  };

  return (
    <section className="w-full px-4 md:px-[0.5in] py-8 sm:py-12 space-y-8">
      {innovatives.map((innovative, index) => {
        const bgUrl = innovative?.bgImg
          ? getOptimizedImageUrl(getOriginalImageUrl(innovative.bgImg))
          : null;

        return (
          <div
            key={innovative?.id ?? index}
            className="relative w-full min-h-[360px] sm:min-h-[420px] rounded-panel overflow-hidden border border-line bg-surface shadow-2xl flex flex-col justify-center items-center text-center p-6 sm:p-12 group"
          >
            {/* Background Image */}
            {bgUrl && (
              <Image
                src={bgUrl}
                alt={innovative?.title || "SketchShaper Highlight"}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority={index === 0}
              />
            )}

            {/* Dark CAD Viewport Gradient Wash */}
            <div className="absolute inset-0 bg-gradient-to-t from-canvas/95 via-canvas/60 to-canvas/30 z-10" />

            {/* Centered Content */}
            <div className="relative z-20 max-w-2xl mx-auto flex flex-col items-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight-title text-fg font-sans mb-4">
                {innovative?.title || "SketchShaper"}
              </h2>

              <p className="text-sm sm:text-base lg:text-lg text-fg-secondary leading-relaxed font-sans max-w-xl">
                {innovative?.short_description && innovative.short_description.trim() !== "-"
                  ? innovative.short_description
                  : innovative?.description ||
                    "Premium quality 3D models and textures for your projects."}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default Innovative;

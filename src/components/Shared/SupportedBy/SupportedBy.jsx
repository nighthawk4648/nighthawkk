import React from "react";
import Image from "next/image";
import { getOptimizedImageUrl } from "@/utils/cloudinary";

const SupportedBy = ({ supportedby = [] }) => {
  if (!supportedby || supportedby.length === 0) {
    return null;
  }

  const getOriginalImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE || ""}${imagePath}`;
  };

  return (
    <section
      id="community-partners"
      className="w-full py-8 sm:py-20 lg:py-24 border-t border-line/60 bg-transparent text-fg relative overflow-hidden"
    >
      {/* Ambient soft radial glow to accentuate the background CAD grid lines and color gradient */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-action/5 rounded-full blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {supportedby.map((support, idx) => {
        const partnerImages = [
          support?.imageOne,
          support?.imageTwo,
          support?.imageThree,
          support?.imageFour,
          support?.imageFive,
        ].filter(Boolean);

        if (partnerImages.length === 0 && !support?.title) {
          return null;
        }

        return (
          <div key={support?.id ?? idx} className="w-full max-w-7xl mx-auto px-4 md:px-[0.5in]">
            {/* Section Header */}
            <div className="max-w-3xl mx-auto text-center mb-6 sm:mb-12 lg:mb-16">
              {support?.title && (
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-fg font-sans">
                  {support.title}
                </h2>
              )}

              {support?.short_description && (
                <p className="text-xs sm:text-base text-fg-secondary max-w-xl mx-auto leading-relaxed mt-2 sm:mt-3 font-sans">
                  {support.short_description}
                </p>
              )}
            </div>

            {/* Static, Balanced Showcase Cards - Single Row 5-Col Grid on Mobile */}
            <div className="grid grid-cols-5 items-center justify-center gap-1.5 xs:gap-2.5 sm:gap-6 lg:gap-8 w-full">
              {partnerImages.map((imgPath, imgIdx) => (
                <div
                  key={imgIdx}
                  className="group/card relative flex items-center justify-center w-full h-12 xs:h-14 sm:h-32 lg:h-40 px-1.5 py-1 sm:px-6 sm:py-5 rounded-lg sm:rounded-2xl border border-line/60 bg-surface/25 backdrop-blur-md hover:bg-surface/60 hover:border-action/50 transition-all duration-300 shadow-sm hover:shadow-[0_0_30px_-4px_rgba(79,219,134,0.24)]"
                >
                  {/* Blueprint CAD corner ticks (desktop only to keep mobile logo area clean) */}
                  <span className="hidden sm:inline absolute top-2.5 left-2.5 text-[11px] font-mono leading-none text-line group-hover/card:text-action/50 transition-colors pointer-events-none select-none">
                    +
                  </span>
                  <span className="hidden sm:inline absolute top-2.5 right-2.5 text-[11px] font-mono leading-none text-line group-hover/card:text-action/50 transition-colors pointer-events-none select-none">
                    +
                  </span>
                  <span className="hidden sm:inline absolute bottom-2.5 left-2.5 text-[11px] font-mono leading-none text-line group-hover/card:text-action/50 transition-colors pointer-events-none select-none">
                    +
                  </span>
                  <span className="hidden sm:inline absolute bottom-2.5 right-2.5 text-[11px] font-mono leading-none text-line group-hover/card:text-action/50 transition-colors pointer-events-none select-none">
                    +
                  </span>

                  <Image
                    src={getOptimizedImageUrl(getOriginalImageUrl(imgPath))}
                    alt={support?.short_description || "Partner logo"}
                    width={280}
                    height={100}
                    className="max-h-6 xs:max-h-7 sm:max-h-16 lg:max-h-24 w-auto max-w-[90%] sm:max-w-[85%] object-contain opacity-80 group-hover/card:opacity-100 group-hover/card:scale-105 transition-all duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default SupportedBy;

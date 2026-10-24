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
      className="w-full py-16 sm:py-24 border-t border-line/60 bg-transparent text-fg relative overflow-hidden"
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
            <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
              {support?.title && (
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight-h2 text-fg font-sans">
                  {support.title}
                </h2>
              )}

              {support?.short_description && (
                <p className="text-sm sm:text-base text-fg-secondary max-w-xl mx-auto leading-relaxed mt-3 font-sans">
                  {support.short_description}
                </p>
              )}
            </div>

            {/* Static, Balanced Showcase Cards */}
            <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 lg:gap-8">
              {partnerImages.map((imgPath, imgIdx) => (
                <div
                  key={imgIdx}
                  className="group/card relative flex items-center justify-center w-[calc(50%-0.75rem)] sm:w-[calc(33.333%-1rem)] lg:w-[calc(20%-1.6rem)] min-w-[150px] h-32 sm:h-36 lg:h-40 px-6 py-5 rounded-2xl border border-line/60 bg-surface/25 backdrop-blur-md hover:bg-surface/60 hover:border-action/50 transition-all duration-300 shadow-sm hover:shadow-[0_0_30px_-4px_rgba(79,219,134,0.24)]"
                >
                  {/* Blueprint CAD corner ticks */}
                  <span className="absolute top-2.5 left-2.5 text-[11px] font-mono leading-none text-line group-hover/card:text-action/50 transition-colors pointer-events-none select-none">
                    +
                  </span>
                  <span className="absolute top-2.5 right-2.5 text-[11px] font-mono leading-none text-line group-hover/card:text-action/50 transition-colors pointer-events-none select-none">
                    +
                  </span>
                  <span className="absolute bottom-2.5 left-2.5 text-[11px] font-mono leading-none text-line group-hover/card:text-action/50 transition-colors pointer-events-none select-none">
                    +
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 text-[11px] font-mono leading-none text-line group-hover/card:text-action/50 transition-colors pointer-events-none select-none">
                    +
                  </span>

                  <Image
                    src={getOptimizedImageUrl(getOriginalImageUrl(imgPath))}
                    alt={support?.short_description || "Partner logo"}
                    width={280}
                    height={100}
                    className="max-h-16 sm:max-h-20 lg:max-h-24 w-auto max-w-[85%] object-contain opacity-80 group-hover/card:opacity-100 group-hover/card:scale-105 transition-all duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
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

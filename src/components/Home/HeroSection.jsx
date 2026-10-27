"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getOptimizedImageUrl } from "@/utils/cloudinary";

export default function HeroSection({
  totalModels = 4280,
  sliders = [],
  onOpenSearch,
}) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Auto-advance slides every 6 seconds if multiple sliders exist
  useEffect(() => {
    if (!sliders || sliders.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % sliders.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [sliders]);

  // Touch swipe gesture handlers for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) {
      touchStartX.current = null;
      touchEndX.current = null;
      return;
    }
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance && sliders.length > 1) {
      // Swiped left -> next slide
      setActiveSlideIndex((prev) => (prev + 1) % sliders.length);
    } else if (distance < -minSwipeDistance && sliders.length > 1) {
      // Swiped right -> prev slide
      setActiveSlideIndex((prev) => (prev - 1 + sliders.length) % sliders.length);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const getOriginalImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
  };

  const hasRealSlides = Array.isArray(sliders) && sliders.length > 0;
  const currentSlide = hasRealSlides ? sliders[activeSlideIndex] : null;
  const currentSlideImage = currentSlide?.image
    ? getOptimizedImageUrl(getOriginalImageUrl(currentSlide.image))
    : null;
  const currentSlideLogo = currentSlide?.logo
    ? getOptimizedImageUrl(getOriginalImageUrl(currentSlide.logo))
    : null;

  return (
    <section className="relative min-h-0 lg:min-h-[calc(100vh-5.5rem)] flex flex-col justify-center pt-4 sm:pt-6 pb-12 sm:pb-16 lg:pb-20 px-4 md:px-[0.5in] w-full overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.618fr] gap-8 sm:gap-10 lg:gap-16 items-center relative z-10 w-full my-auto">
        {/* Left Minor Column (Text & Search) */}
        <div className="flex flex-col items-start w-full max-w-2xl">
          {/* Main H1 Headline */}
          <h1 className="text-[2rem] sm:text-5xl lg:text-[3.5rem] xl:text-[3.85rem] font-semibold tracking-tight-title leading-[1.08] sm:leading-[1.03] text-fg mb-4 sm:mb-5 font-sans">
            3D models for SketchUp,{" "}
            <span className="text-action">ready to use.</span>
          </h1>

          {/* Lead Paragraph */}
          {(currentSlide?.short_description || currentSlide?.description) && (
            <p className="text-sm sm:text-lg lg:text-xl text-fg-secondary leading-relaxed mb-6 sm:mb-8 max-w-lg transition-opacity duration-300">
              {currentSlide?.short_description || currentSlide?.description}
            </p>
          )}

          {/* Search Pill */}
          <div className="w-full relative mb-4 sm:mb-5 max-w-xl">
            <div
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-search-modal"));
                }
                onOpenSearch?.();
              }}
              onMouseEnter={() => {
                import("@/components/Shared/Navbar/SearchModal");
              }}
              onFocus={() => {
                import("@/components/Shared/Navbar/SearchModal");
              }}
              className="h-14 sm:h-[60px] w-full rounded-full glass-panel pl-4 sm:pl-6 pr-1.5 sm:pr-2 flex items-center justify-between border border-line-control hover:border-action focus-within:border-action transition-all shadow-xl cursor-pointer group"
            >
              <div className="flex items-center gap-3 sm:gap-3.5 flex-1 min-w-0">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-fg-secondary group-hover:text-action transition-colors flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search models..."
                  readOnly
                  className="bg-transparent border-none outline-none text-fg placeholder:text-fg-secondary w-full cursor-pointer text-sm sm:text-base font-normal pointer-events-none"
                />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("open-search-modal"));
                  }
                  onOpenSearch?.();
                }}
                aria-label="Submit search"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-action hover:bg-action-hover active:bg-action-pressed text-canvas flex items-center justify-center transition-all hover:scale-105 shadow-md flex-shrink-0"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Quiet "Try:" Category Hints (Touch-friendly pill chips) */}
          <div className="flex items-center gap-2 text-xs text-fg-secondary font-mono flex-wrap">
            <span className="text-fg-secondary/70">Try:</span>
            {["Sofa", "Chair", "Table"].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(
                      new CustomEvent("open-search-modal", {
                        detail: { query: term },
                      }),
                    );
                  }
                  onOpenSearch?.(term);
                }}
                className="px-2.5 py-1 rounded-full bg-surface-raised/80 hover:bg-surface-raised border border-line text-xs font-mono text-fg-secondary hover:text-action transition-all cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Right Major Column: Viewport Frame (Real Slider OR Designed Typographic CAD Empty State) */}
        <div className="relative w-full">
          {hasRealSlides && currentSlideImage ? (
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] min-h-[220px] sm:min-h-[440px] lg:min-h-[490px] w-full rounded-2xl sm:rounded-[28px] overflow-hidden border border-line bg-surface relative group shadow-2xl touch-pan-y"
            >
              <Image
                src={currentSlideImage}
                alt={currentSlide.name || "Curated scene"}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-canvas/90 via-canvas/25 to-transparent pointer-events-none" />

              {/* Center Brand Overlay (Logo & Title) */}
              {(currentSlideLogo || currentSlide.name) && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 sm:p-6 text-center pointer-events-none">
                  {currentSlideLogo && (
                    <div className="mb-2 sm:mb-3 drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)]">
                      {currentSlideLogo.startsWith("http") ? (
                        <img
                          src={currentSlideLogo}
                          alt={currentSlide.name ? `${currentSlide.name} logo` : "Collection logo"}
                          className="h-12 sm:h-20 lg:h-24 w-auto max-w-[220px] sm:max-w-[340px] object-contain"
                        />
                      ) : (
                        <Image
                          src={currentSlideLogo}
                          alt={currentSlide.name ? `${currentSlide.name} logo` : "Collection logo"}
                          width={320}
                          height={80}
                          className="h-12 sm:h-20 lg:h-24 w-auto max-w-[220px] sm:max-w-[340px] object-contain"
                        />
                      )}
                    </div>
                  )}
                  {currentSlide.name && (
                    <h3 className="text-lg sm:text-2xl lg:text-3xl font-semibold text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] tracking-tight font-sans">
                      {currentSlide.name}
                    </h3>
                  )}
                </div>
              )}

              {/* Carousel Pagination Indicator Dots (Thumb accessible) */}
              {sliders.length > 1 && (
                <div className="absolute bottom-4 right-4 sm:top-6 sm:right-6 sm:bottom-auto flex items-center gap-2 glass-panel px-3 py-1.5 rounded-full z-10 shadow-lg">
                  {sliders.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSlideIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`rounded-full transition-all cursor-pointer ${
                        idx === activeSlideIndex
                          ? "w-4 h-2 bg-action"
                          : "w-2 h-2 bg-fg-secondary/50 hover:bg-fg-secondary"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Designed Typographic CAD Empty State */
            <div className="aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] min-h-[220px] sm:min-h-[440px] lg:min-h-[490px] w-full rounded-2xl sm:rounded-[28px] overflow-hidden border border-line bg-surface relative flex flex-col justify-between p-4 sm:p-8 lg:p-10 shadow-2xl">
              {/* Top Viewport Header Row */}
              <div className="flex items-center justify-between border-b border-line pb-3 sm:pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-action" />
                  <span className="text-[11px] sm:text-xs font-mono text-fg-secondary uppercase tracking-wider">
                    CAD Viewport &bull; .SKP
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs font-mono text-action bg-action-tintBg px-2 sm:px-2.5 py-0.5 rounded border border-action-tintLine">
                  Native Geometry
                </span>
              </div>

              {/* Center Typographic Focal Content */}
              <div className="my-auto py-3 sm:py-8">
                <div className="text-[11px] sm:text-xs font-mono text-action mb-1 sm:mb-2 uppercase tracking-wider">
                  SketchUp Library
                </div>
                <div className="text-xl sm:text-3xl lg:text-4xl font-semibold text-fg tracking-tight leading-tight font-sans">
                  Architectural Component Library
                </div>
                <p className="text-xs sm:text-sm text-fg-secondary mt-2 sm:mt-3 max-w-lg leading-relaxed">
                  Curated 3D models and materials formatted for SketchUp 2022 &ndash; 2026. Scaled 1:1 for architectural scenes.
                </p>
              </div>

              {/* Bottom Technical Specifications Bar */}
              <div className="glass-panel p-2.5 sm:p-3.5 rounded-card border border-line-strong flex items-center justify-between text-[11px] sm:text-xs font-mono text-fg-secondary flex-wrap gap-2">
                <span>SYSTEM: NATIVE_SKP</span>
                <span className="hidden sm:inline">&bull;</span>
                <span>SCALE: 1:1 METRIC</span>
                <span className="hidden sm:inline">&bull;</span>
                <span className="text-fg font-medium">CLEAN GEOMETRY</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

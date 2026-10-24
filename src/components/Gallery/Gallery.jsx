"use client";

import Image from "next/image";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { getOptimizedImageUrl } from "@/utils/cloudinary";
import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const Gallery = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const getOriginalImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE || ""}${imagePath}`;
  };

  const fetchGalleryImages = async (page, limit) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/gallery/pages?page=${page}&limit=${limit}&order=desc`
      );

      if (!response.ok) throw new Error("Failed to fetch gallery images");

      const data = await response.json();
      return {
        result: data.data?.result || [],
        pagination: data.data?.pagination || {
          total: 0,
          totalPage: 1,
          currentPage: page,
        },
      };
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      throw error;
    }
  };

  const {
    data: images,
    isLoading,
    hasMore,
    error,
    observerTarget,
  } = useInfiniteScroll(fetchGalleryImages, 12);

  const selectedImage =
    selectedImageIndex !== null ? images[selectedImageIndex] : null;

  const closeModal = () => setSelectedImageIndex(null);

  const handleNext = useCallback(
    (e) => {
      e?.stopPropagation?.();
      if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
        setSelectedImageIndex((prev) => prev + 1);
      }
    },
    [selectedImageIndex, images.length]
  );

  const handlePrev = useCallback(
    (e) => {
      e?.stopPropagation?.();
      if (selectedImageIndex !== null && selectedImageIndex > 0) {
        setSelectedImageIndex((prev) => prev - 1);
      }
    },
    [selectedImageIndex]
  );

  // Keyboard controls for modal
  useEffect(() => {
    if (selectedImageIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, handleNext, handlePrev]);

  // Bento Span Pattern Helper (12-item repeating gapless architectural mosaic)
  const getBentoSpan = (index) => {
    const mod = index % 12;
    switch (mod) {
      case 0:
        // Featured Hero Anchor (2 cols, 2 rows)
        return "col-span-1 sm:col-span-2 lg:col-span-2 row-span-2 min-h-[380px] sm:min-h-[460px] lg:min-h-[520px]";
      case 1:
        // Standard Cell
        return "col-span-1 sm:col-span-1 lg:col-span-1 row-span-1 min-h-[220px] sm:min-h-[250px]";
      case 2:
        // Tall Vertical Architectural Card (1 col, 2 rows)
        return "col-span-1 sm:col-span-1 lg:col-span-1 row-span-2 min-h-[380px] sm:min-h-[460px] lg:min-h-[520px]";
      case 3:
        // Standard Cell
        return "col-span-1 sm:col-span-1 lg:col-span-1 row-span-1 min-h-[220px] sm:min-h-[250px]";
      case 4:
        // Wide Panoramic Card (2 cols, 1 row)
        return "col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 min-h-[240px] sm:min-h-[260px]";
      case 5:
        // Standard Cell
        return "col-span-1 sm:col-span-1 lg:col-span-1 row-span-1 min-h-[220px] sm:min-h-[250px]";
      case 6:
        // Standard Cell
        return "col-span-1 sm:col-span-1 lg:col-span-1 row-span-1 min-h-[220px] sm:min-h-[250px]";
      case 7:
        // Standard Cell
        return "col-span-1 sm:col-span-1 lg:col-span-1 row-span-1 min-h-[220px] sm:min-h-[250px]";
      case 8:
        // Tall Vertical Architectural Card (1 col, 2 rows)
        return "col-span-1 sm:col-span-1 lg:col-span-1 row-span-2 min-h-[380px] sm:min-h-[460px] lg:min-h-[520px]";
      case 9:
        // Secondary Featured Anchor (2 cols, 2 rows)
        return "col-span-1 sm:col-span-2 lg:col-span-2 row-span-2 min-h-[380px] sm:min-h-[460px] lg:min-h-[520px]";
      case 10:
        // Standard Cell
        return "col-span-1 sm:col-span-1 lg:col-span-1 row-span-1 min-h-[220px] sm:min-h-[250px]";
      case 11:
        // Wide Panoramic Base Card (2 cols, 1 row)
        return "col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 min-h-[240px] sm:min-h-[260px]";
      default:
        return "col-span-1 row-span-1 min-h-[240px]";
    }
  };

  return (
    <div className="min-h-screen text-fg w-full px-4 md:px-[0.5in] pt-8 sm:pt-14 pb-20 sm:pb-28">
      {/* 1. Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight-title text-fg font-sans mb-5">
          Render <span className="text-action">Gallery</span>
        </h1>

        <p className="text-base sm:text-lg text-fg-secondary leading-relaxed max-w-2xl mx-auto font-sans">
          Curated visual artwork and architectural scenes submitted by our
          community, crafted using SketchShaper 3D models and calibrated textures.
        </p>
      </div>

      {/* 2. Error State */}
      {error && (
        <div className="mb-8 p-4 bg-red-950/30 border border-red-500/40 rounded-xl text-red-300 max-w-2xl mx-auto text-sm font-mono flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>Error loading render archive: {error}</span>
        </div>
      )}

      {/* 3. Architectural Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 grid-flow-dense max-w-[1600px] mx-auto">
        {images.map((image, index) => {
          const rawImagePath = image.image || image.image_url || image.url;
          const optimizedUrl = getOptimizedImageUrl(getOriginalImageUrl(rawImagePath));
          const spanClass = getBentoSpan(index);
          const isFeatured = (index % 12 === 0) || (index % 12 === 9);

          return (
            <div
              key={image.id ?? index}
              onClick={() => setSelectedImageIndex(index)}
              className={`group relative overflow-hidden rounded-[20px] sm:rounded-[24px] border border-line bg-surface/60 hover:border-action/60 hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-between ${spanClass}`}
            >
              {/* Image Frame */}
              {rawImagePath && (
                <Image
                  src={optimizedUrl}
                  alt={image.title || `Gallery render ${image.id}`}
                  fill
                  sizes={
                    isFeatured
                      ? "(max-width: 768px) 100vw, 50vw"
                      : "(max-width: 768px) 100vw, 25vw"
                  }
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  priority={index < 4}
                />
              )}

              {/* Subtle Dark Hover Wash */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 pointer-events-none" />

              {/* Minimal Hover Zoom Pill */}
              <div className="relative z-10 p-3.5 sm:p-4 flex items-center justify-end w-full">
                <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 shadow-md">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                </div>
              </div>

              {/* Optional Title if present */}
              {image.title && (
                <div className="relative z-10 p-3.5 sm:p-4">
                  <div className="p-2.5 sm:p-3 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md">
                    <h3 className="text-xs sm:text-sm font-semibold text-white font-sans line-clamp-1">
                      {image.title}
                    </h3>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Loading Skeleton / Indicator */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center mt-12 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-line border-t-action animate-spin" />
          <span className="text-xs font-mono text-fg-secondary">
            Streaming community renders...
          </span>
        </div>
      )}

      {/* 5. Infinite Scroll Intersection Target */}
      {hasMore && (
        <div
          ref={observerTarget}
          className="h-14 mt-8 flex items-center justify-center"
        />
      )}

      {/* 7. Empty State */}
      {!isLoading && images.length === 0 && !error && (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto glass-panel p-8 rounded-2xl border border-line">
            <svg
              className="w-12 h-12 text-fg-secondary mx-auto mb-4 stroke-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-fg mb-1">
              No Renders Found
            </h3>
            <p className="text-sm text-fg-secondary">
              Community artwork will appear here once submitted.
            </p>
          </div>
        </div>
      )}

      {/* 8. CAD Studio Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-canvas/95 backdrop-blur-xl z-50 flex flex-col justify-between p-4 sm:p-6 transition-all animate-fadeIn"
          onClick={closeModal}
        >
          {/* Top Modal Navigation Header */}
          <div
            className="w-full flex items-center justify-between z-10 px-4 py-3 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl max-w-7xl mx-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-action" />
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-white font-sans line-clamp-1">
                  {selectedImage.title || "Render Preview"}
                </h4>
                <div className="text-xs font-mono text-zinc-300/80">
                  {selectedImageIndex + 1} of {images.length}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs font-mono text-zinc-300/80 mr-2">
                Use &larr; / &rarr; keys
              </span>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close modal"
                className="w-9 h-9 rounded-full bg-black/50 hover:bg-action hover:text-canvas border border-white/15 flex items-center justify-center text-white transition-all"
              >
                &times;
              </button>
            </div>
          </div>

          {/* Center Main Stage Viewport with Next/Prev Controls */}
          <div
            className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous Button */}
            {selectedImageIndex > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous render"
                className="absolute left-2 sm:left-6 z-20 w-11 h-11 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 flex items-center justify-center text-white hover:bg-action hover:text-canvas hover:border-action transition-all shadow-xl group"
              >
                <svg
                  className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Main Stage Image */}
            <div className="relative max-h-[80vh] max-w-full flex items-center justify-center">
              {(() => {
                const modalRawPath =
                  selectedImage.image ||
                  selectedImage.image_url ||
                  selectedImage.url;
                const modalUrl = getOptimizedImageUrl(
                  getOriginalImageUrl(modalRawPath)
                );

                return (
                  <img
                    src={modalUrl}
                    alt={selectedImage.title || "Full resolution render preview"}
                    className="max-h-[78vh] max-w-[92vw] sm:max-w-[85vw] object-contain rounded-xl sm:rounded-2xl border border-white/15 shadow-2xl"
                  />
                );
              })()}
            </div>

            {/* Next Button */}
            {selectedImageIndex < images.length - 1 && (
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next render"
                className="absolute right-2 sm:right-6 z-20 w-11 h-11 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 flex items-center justify-center text-white hover:bg-action hover:text-canvas hover:border-action transition-all shadow-xl group"
              >
                <svg
                  className="w-5 h-5 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Bottom Caption / Action Pill */}
          <div
            className="w-full max-w-3xl mx-auto px-4 py-2.5 rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl flex items-center justify-between text-xs font-mono text-zinc-300/80"
            onClick={(e) => e.stopPropagation()}
          >
            <span>SKETCHSHAPER CAD RENDER ARCHIVE</span>
            <button
              type="button"
              onClick={closeModal}
              className="text-action hover:underline cursor-pointer"
            >
              Press ESC to exit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
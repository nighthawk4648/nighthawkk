"use client";
import React, { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getOptimizedImageUrl } from "@/utils/cloudinary";
import cloudinaryLoader from "@/utils/cloudinaryLoader";
import useSWR from "swr";
import { fetcher } from "@/utils/swrFetcher";
import slugify from "@/utils/slugify";
import { usePatreonAuth } from "@/contexts/PatreonAuthContext";
import {
  FiDownload,
  FiBox,
  FiHardDrive,
  FiLayers,
  FiLock,
  FiArrowLeft,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
  FiZoomIn,
  FiZoomOut,
  FiMaximize,
  FiX,
  FiRotateCcw,
  FiShield,
  FiCheckCircle,
  FiZap,
  FiLoader,
} from "react-icons/fi";
import { sanitizeHtml } from "@/utils/sanitizeHtml";
import InFeedAd from "@/components/Shared/GoogleAdsense/InFeedAd";
import ResponsiveBannerAd from "@/components/Shared/GoogleAdsense/ResponsiveBannerAd";
import { formatAssetSize } from "@/utils/formatAssetSize";

const SubCategoryDetails = ({ assetDetails }) => {
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [shaderMode, setShaderMode] = useState("beauty"); // "beauty" | "clay" | "wireframe"
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAngleLoading, setIsAngleLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toast, setToast] = useState(null);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isLongDesc, setIsLongDesc] = useState(false);
  const descRef = useRef(null);

  const { token, user, login, logout } = usePatreonAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (descRef.current) {
      setIsLongDesc(descRef.current.scrollHeight > 160);
    }
  }, [assetDetails?.short_description]);

  const isAuthenticated = mounted && !!token && !!user;
  const isPatron = isAuthenticated && !!user?.is_active_patron;

  // Toast notification helper
  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 3200);
  };

  const getOriginalImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
    return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE || ""}${imagePath}`;
  };

  // Combine cover and gallery images so the primary cover is always slide #1
  const displayImages = useMemo(() => {
    if (!assetDetails) return [];
    const gallery = assetDetails?.images || [];
    const hasCoverInGallery =
      assetDetails?.cover &&
      gallery.some((img) => img?.image === assetDetails.cover);

    const list = [];
    if (assetDetails?.cover && !hasCoverInGallery) {
      list.push({
        id: "primary-cover",
        image: assetDetails.cover,
        alt:
          assetDetails?.cover_alt?.trim() ||
          assetDetails?.name ||
          "Model preview render",
      });
    }
    list.push(...gallery);
    return list.length > 0
      ? list
      : [
          {
            id: "fallback-cover",
            image: assetDetails?.cover || "",
            alt: assetDetails?.name || "3D Model",
          },
        ];
  }, [assetDetails]);

  // Unified angle switching handler with loading state and zoom reset
  const switchAngle = (newIndex) => {
    if (newIndex === activeImageIndex || newIndex < 0 || newIndex >= displayImages.length) return;
    setIsAngleLoading(true);
    setActiveImageIndex(newIndex);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  // Camera angle navigation (Left / Right)
  const handlePrevAngle = (e) => {
    e?.stopPropagation();
    const prevIdx = activeImageIndex > 0 ? activeImageIndex - 1 : displayImages.length - 1;
    switchAngle(prevIdx);
  };

  const handleNextAngle = (e) => {
    e?.stopPropagation();
    const nextIdx = activeImageIndex < displayImages.length - 1 ? activeImageIndex + 1 : 0;
    switchAngle(nextIdx);
  };

  // Idle-Time Background Preloader for remaining camera angles (Choice 4 - Hybrid)
  useEffect(() => {
    if (typeof window === "undefined" || displayImages.length <= 1) return;

    const preloadRemainingAngles = () => {
      const screenWidth = window.innerWidth;
      const targetWidth = screenWidth < 640 ? 640 : screenWidth < 1024 ? 828 : 1080;

      displayImages.slice(1).forEach((item) => {
        if (!item?.image) return;
        const rawUrl = getOriginalImageUrl(item.image);
        if (!rawUrl) return;

        // Use custom Cloudinary loader format to mirror Next.js <Image> request
        const optimizedUrl = cloudinaryLoader({
          src: rawUrl,
          width: targetWidth,
          quality: 75,
        });

        const preloadedImg = new window.Image();
        preloadedImg.src = optimizedUrl;
      });
    };

    if ("requestIdleCallback" in window) {
      const idleHandle = window.requestIdleCallback(preloadRemainingAngles, { timeout: 2500 });
      return () => window.cancelIdleCallback(idleHandle);
    } else {
      const timer = setTimeout(preloadRemainingAngles, 1000);
      return () => clearTimeout(timer);
    }
  }, [displayImages]);

  // Safety fallback: dismiss loading pill if network hangs
  useEffect(() => {
    if (!isAngleLoading) return;
    const safetyTimer = setTimeout(() => {
      setIsAngleLoading(false);
    }, 3500);
    return () => clearTimeout(safetyTimer);
  }, [isAngleLoading, activeImageIndex]);

  // Zoom handlers (1x to 3x)
  const handleZoomChange = (delta) => {
    setZoomLevel((prev) => {
      const next = Math.min(Math.max(Number((prev + delta).toFixed(1)), 1), 3);
      if (next === 1) setPanPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = (e) => {
    e?.stopPropagation();
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  // Drag-to-pan handlers
  const handleMouseDown = (e) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPanPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    if (zoomLevel <= 1 || !e.touches[0]) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - panPosition.x,
      y: e.touches[0].clientY - panPosition.y,
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || zoomLevel <= 1 || !e.touches[0]) return;
    setPanPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) => {
          const newIdx = prev > 0 ? prev - 1 : displayImages.length - 1;
          if (newIdx !== prev) setIsAngleLoading(true);
          return newIdx;
        });
        setZoomLevel(1);
        setPanPosition({ x: 0, y: 0 });
      } else if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) => {
          const newIdx = prev < displayImages.length - 1 ? prev + 1 : 0;
          if (newIdx !== prev) setIsAngleLoading(true);
          return newIdx;
        });
        setZoomLevel(1);
        setPanPosition({ x: 0, y: 0 });
      } else if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [displayImages.length]);

  // Download handler
  const handleDownload = () => {
    if (!assetDetails?.id) return;

    // If it is a paid asset and user is not an active patron, open the Patreon modal
    if (assetDetails?.access_type === "paid" && !isPatron) {
      setShowModal(true);
      return;
    }

    setIsDownloading(true);

    const tokenQuery =
      assetDetails?.access_type === "paid" && token ? `?token=${token}` : "";
    const downloadUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/assets/${assetDetails.id}/download${tokenQuery}`;

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = downloadUrl;
    a.download = "";
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      setIsDownloading(false);
    }, 1200);
  };

  // Fetch related assets from the same sub-category
  const { data: relatedAssetsData } = useSWR(
    assetDetails?.sub_category_id
      ? `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/sub-categories/${assetDetails.sub_category_id}`
      : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  // Filter related assets (exclude current asset and take up to 5 so slot #3 can be an in-feed ad)
  const relatedAssets = useMemo(() => {
    return (
      relatedAssetsData?.data?.assets
        ?.filter((asset) => asset.id !== assetDetails?.id)
        ?.sort(() => 0.5 - Math.random())
        ?.slice(0, 5) || []
    );
  }, [relatedAssetsData, assetDetails?.id]);

  // Breadcrumb taxonomy variables
  const categoryName =
    assetDetails?.sub_category?.category?.name ||
    relatedAssetsData?.data?.category?.name ||
    "Sketchup 3D models";
  const categoryId =
    assetDetails?.sub_category?.category?.id ||
    relatedAssetsData?.data?.category?.id ||
    "1";
  const subCategoryName =
    assetDetails?.sub_category?.name ||
    relatedAssetsData?.data?.name ||
    "3D Models";
  const subCategoryId =
    assetDetails?.sub_category?.id ||
    assetDetails?.sub_category_id ||
    relatedAssetsData?.data?.id ||
    "";

  // Formatted file size
  const formattedSize = formatAssetSize(assetDetails);

  // Shader filter style
  const shaderFilterStyle = useMemo(() => {
    if (shaderMode === "clay") {
      return { filter: "grayscale(100%) contrast(115%) brightness(110%)" };
    }
    if (shaderMode === "wireframe") {
      return { filter: "invert(90%) hue-rotate(180deg) contrast(170%)" };
    }
    return { filter: "none" };
  }, [shaderMode]);

  const activeImage = displayImages[activeImageIndex] || displayImages[0];

  return (
    <div className="w-full min-h-screen text-fg font-sans pt-6 sm:pt-10 pb-20 px-4 sm:px-6 md:px-[0.5in] relative overflow-hidden bg-transparent">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none animate-fadeIn">
          <div className="px-4 py-2.5 rounded-xl text-xs font-mono bg-surface-raised border border-line text-fg shadow-2xl flex items-center gap-2 pointer-events-auto">
            <span
              className={`w-2 h-2 rounded-full ${
                toast.type === "success" ? "bg-action" : "bg-action/60"
              }`}
            />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main 1600px Max-width Container */}
      <div className="max-w-[1600px] mx-auto space-y-8 sm:space-y-10">
        
        {/* 1. TOP BREADCRUMB BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs pb-1">
          {/* Left: Monospace Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-fg-secondary">
            <Link href="/" className="hover:text-action transition-colors">
              Home
            </Link>
            <span className="text-line-control">/</span>
            <Link
              href={`/${slugify(categoryName)}-${categoryId}`}
              className="hover:text-action transition-colors truncate max-w-[150px] sm:max-w-none"
            >
              {categoryName}
            </Link>
            <span className="text-line-control">/</span>
            <Link
              href={`/${slugify(categoryName)}-${categoryId}/${slugify(subCategoryName)}-${subCategoryId}`}
              className="hover:text-action transition-colors truncate max-w-[170px] sm:max-w-none"
            >
              {subCategoryName}
            </Link>
            <span className="text-line-control">/</span>
            <span className="text-fg font-medium truncate max-w-[220px] sm:max-w-none">
              {assetDetails?.name}
            </span>
          </nav>

          {/* Right: Back to Models Button */}
          <Link
            href={`/${slugify(categoryName)}-${categoryId}/${slugify(subCategoryName)}-${subCategoryId}`}
            className="inline-flex items-center gap-1.5 bg-surface hover:bg-surface-raised border border-line hover:border-action/40 text-fg-secondary hover:text-fg rounded-lg px-3.5 py-1.5 text-xs font-mono transition-all shadow-sm"
          >
            <FiArrowLeft className="w-3.5 h-3.5 text-action" />
            <span>Back to {subCategoryName}</span>
          </Link>
        </div>

        {/* 2. TOP LEADERBOARD AD BANNER */}
        <ResponsiveBannerAd className="mb-2" />

        {/* 3. MAIN 12-COLUMN ASYMMETRIC SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ============================================================== */}
          {/* A. LEFT COLUMN (lg:col-span-8): Viewport & Specifications Sheet */}
          {/* ============================================================== */}
          <div className="lg:col-span-8 flex flex-col gap-5">

            {/* 3D Viewport Stage Container */}
            <div className="bg-surface/50 border border-line rounded-2xl overflow-hidden shadow-2xl relative">
              
              {/* Top Floating Controls */}
              <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-start pointer-events-none">
                
                {/* Top-Left Floating Control Bar (Shader modes) */}
                <div className="bg-surface-raised/90 backdrop-blur-md border border-line p-1 rounded-xl flex items-center gap-1 shadow-lg pointer-events-auto">
                  {/* Render Mode */}
                  <button
                    type="button"
                    onClick={() => {
                      setShaderMode("beauty");
                      showToast("Mode: Render");
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                      shaderMode === "beauty"
                        ? "bg-fg text-canvas shadow-sm font-semibold"
                        : "text-fg-secondary hover:text-fg hover:bg-surface/60"
                    }`}
                  >
                    Render
                  </button>

                  {/* Viewport Mode */}
                  <button
                    type="button"
                    onClick={() => {
                      setShaderMode("clay");
                      showToast("Mode: Viewport");
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                      shaderMode === "clay"
                        ? "bg-fg text-canvas shadow-sm font-semibold"
                        : "text-fg-secondary hover:text-fg hover:bg-surface/60"
                    }`}
                  >
                    Viewport
                  </button>

                  {/* Wireframe Mode */}
                  <button
                    type="button"
                    onClick={() => {
                      setShaderMode("wireframe");
                      showToast("Mode: Wireframe");
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                      shaderMode === "wireframe"
                        ? "bg-fg text-canvas shadow-sm font-semibold"
                        : "text-fg-secondary hover:text-fg hover:bg-surface/60"
                    }`}
                  >
                    Wireframe
                  </button>
                </div>
              </div>

              {/* Main Canvas Stage */}
              <div
                className={`aspect-[16/10] sm:aspect-[16/9] bg-gradient-to-b from-surface/20 to-canvas/80 flex items-center justify-center relative overflow-hidden select-none group/canvas ${
                  zoomLevel > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""
                }`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Subtle radial center glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,219,134,0.06)_0%,transparent_70%)] pointer-events-none" />

                {/* Blurred Floor Shadow (only visible at 1x for crisp CAD render) */}
                <div
                  className={`absolute bottom-12 w-3/4 h-8 bg-black/80 blur-xl rounded-full transform scale-y-50 pointer-events-none transition-opacity duration-300 ${
                    zoomLevel > 1 ? "opacity-0" : "opacity-100"
                  }`}
                />

                {/* Left Navigation Arrow */}
                {displayImages.length > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevAngle}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all shadow-xl hover:scale-110 active:scale-95 cursor-pointer"
                    aria-label="Previous camera angle"
                    title="Previous Angle (← key)"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                )}

                {/* Right Navigation Arrow */}
                {displayImages.length > 1 && (
                  <button
                    type="button"
                    onClick={handleNextAngle}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all shadow-xl hover:scale-110 active:scale-95 cursor-pointer"
                    aria-label="Next camera angle"
                    title="Next Angle (→ key)"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                )}

                {/* Stage Zoom & Fullscreen Toolbar */}
                <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-white/15 rounded-lg p-1 shadow-2xl">
                  {/* Zoom Out */}
                  <button
                    type="button"
                    onClick={() => handleZoomChange(-0.5)}
                    disabled={zoomLevel <= 1}
                    className="p-1.5 rounded-md text-fg-secondary hover:text-fg hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    title="Zoom Out"
                  >
                    <FiZoomOut className="w-4 h-4" />
                  </button>

                  {/* Zoom Percentage */}
                  <span className="text-[11px] font-mono px-1.5 text-fg min-w-[42px] text-center select-none font-medium">
                    {Math.round(zoomLevel * 100)}%
                  </span>

                  {/* Zoom In */}
                  <button
                    type="button"
                    onClick={() => handleZoomChange(0.5)}
                    disabled={zoomLevel >= 3}
                    className="p-1.5 rounded-md text-fg-secondary hover:text-fg hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    title="Zoom In"
                  >
                    <FiZoomIn className="w-4 h-4" />
                  </button>

                  {/* Reset Zoom */}
                  {zoomLevel > 1 && (
                    <button
                      type="button"
                      onClick={handleResetZoom}
                      className="p-1.5 rounded-md text-fg-secondary hover:text-fg hover:bg-white/10 transition-colors cursor-pointer"
                      title="Reset Zoom"
                    >
                      <FiRotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <div className="w-px h-4 bg-white/20 my-auto mx-0.5" />

                  {/* Fullscreen Inspect Button */}
                  <button
                    type="button"
                    onClick={() => setIsFullscreen(true)}
                    className="p-1.5 rounded-md text-fg-secondary hover:text-action hover:bg-white/10 transition-colors cursor-pointer"
                    title="Fullscreen Lightbox Inspection"
                  >
                    <FiMaximize className="w-4 h-4" />
                  </button>
                </div>

                {/* Model Render Image Container with Zoom & Pan Transforms */}
                <div
                  className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                    transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <Image
                    key={activeImage?.image || activeImageIndex}
                    src={getOriginalImageUrl(activeImage?.image)}
                    alt={activeImage?.alt?.trim() || assetDetails?.name || "3D Model Render"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    priority
                    loading="eager"
                    onLoad={() => setIsAngleLoading(false)}
                    onError={() => setIsAngleLoading(false)}
                    style={shaderFilterStyle}
                    className={`object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.85)] select-none transition-all duration-300 ${
                      isAngleLoading ? "opacity-30 scale-[0.98]" : "opacity-100 scale-100"
                    }`}
                  />
                </div>

                {/* Angle Switching Loading Pill Indicator */}
                {isAngleLoading && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 shadow-2xl flex items-center gap-2 text-xs font-mono text-fg animate-in fade-in duration-150">
                      <FiLoader className="w-3.5 h-3.5 animate-spin text-action" />
                      <span>Loading angle...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Angle Carousel */}
              <div className="p-3 bg-surface/70 border-t border-line flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-fg-secondary/70 mr-1 hidden sm:inline">
                  Camera:
                </span>
                {displayImages.slice(0, 5).map((img, idx) => (
                  <button
                    key={img?.id || idx}
                    type="button"
                    onClick={() => {
                      if (activeImageIndex !== idx) {
                        switchAngle(idx);
                        showToast(`Switched to Camera Angle #${idx + 1}`);
                      }
                    }}
                    className={`w-12 h-9 rounded overflow-hidden border-2 transition-all hover:scale-105 relative bg-canvas ${
                      activeImageIndex === idx
                        ? "border-action shadow-md"
                        : "border-line hover:border-line-control"
                    }`}
                    title={img?.alt || `Angle #${idx + 1}`}
                  >
                    <Image
                      src={getOptimizedImageUrl(getOriginalImageUrl(img?.image))}
                      alt={img?.alt || `Angle #${idx + 1}`}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Model Description & Specifications Card */}
            {assetDetails?.short_description && (
              <div className="bg-surface/30 backdrop-blur-2xl rounded-panel border border-white/[0.08] p-5 sm:p-7 shadow-2xl shadow-black/40 overflow-hidden relative space-y-3.5">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-action/[0.02] pointer-events-none" />
                {/* Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08] relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-action" />
                    <h2 className="text-xs font-mono uppercase tracking-wider text-action font-semibold flex items-center gap-2">
                      <FiFileText className="w-3.5 h-3.5" />
                      Model Description
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-fg-secondary/70 uppercase">
                    Overview
                  </span>
                </div>

                {/* Body Content with Collapsible Container */}
                <div className="relative z-10">
                  <div
                    ref={descRef}
                    className={`text-sm text-fg-secondary leading-relaxed font-sans prose prose-invert max-w-none [&_p]:mb-2.5 [&_a]:text-action hover:[&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:text-fg [&_b]:text-fg [&_h1]:text-fg [&_h2]:text-fg [&_h3]:text-fg transition-all duration-300 ${
                      !isDescExpanded && isLongDesc
                        ? "max-h-[140px] overflow-hidden sm:max-h-none sm:overflow-visible"
                        : "max-h-none"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(assetDetails.short_description),
                    }}
                  />

                  {/* Gradient Fade Overlay on Mobile when Collapsed */}
                  {!isDescExpanded && isLongDesc && (
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#111317]/95 via-[#111317]/60 to-transparent pointer-events-none sm:hidden" />
                  )}
                </div>

                {/* See More / See Less Toggle Button (Phone Only) */}
                {isLongDesc && (
                  <div className="pt-1 sm:hidden relative z-10">
                    <button
                      type="button"
                      onClick={() => setIsDescExpanded((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/10 border border-white/10 text-xs font-mono font-medium text-action transition-all cursor-pointer active:scale-95"
                      aria-expanded={isDescExpanded}
                    >
                      <span>{isDescExpanded ? "See less" : "See more"}</span>
                      {isDescExpanded ? (
                        <FiChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <FiChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* ============================================================== */}
          {/* B. RIGHT COLUMN (Sticky Download Hub - lg:col-span-4)           */}
          {/* ============================================================== */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">

            {/* Primary Download Card */}
            <div className="bg-surface/30 backdrop-blur-2xl rounded-panel border border-white/[0.08] p-6 sm:p-7 shadow-2xl shadow-black/40 overflow-hidden relative">
              
              {/* Subtle Specular Sheen & Glass Refraction */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-action/[0.02] pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-action/[0.06] rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-action/[0.04] rounded-full blur-3xl pointer-events-none" />

              {/* Top Meta Row */}
              <div className="flex items-center justify-between text-xs font-mono text-fg-secondary pb-3.5 border-b border-white/[0.08] relative z-10">
                <span className="glass-panel px-3 py-1 rounded-full text-xs text-fg-secondary border border-white/10">
                  ASSET #{assetDetails?.id || "SKP"}
                </span>
                {assetDetails?.access_type === "paid" ? (
                  <span className="glass-panel px-3 py-1 rounded-full text-xs font-semibold text-extension border border-extension-tintLine bg-extension-tintBg/80 font-mono">
                    PRO
                  </span>
                ) : (
                  <span className="glass-panel px-3 py-1 rounded-full text-xs font-semibold text-action border border-action-tintLine bg-action-tintBg font-mono">
                    FREE
                  </span>
                )}
              </div>

              {/* Product Title */}
              <div className="mt-5 relative z-10">
                <h1 className="text-2xl sm:text-3xl font-bold text-fg tracking-tight font-sans">
                  {assetDetails?.name}
                </h1>
              </div>

              {/* 3-Row Technical Summary Stack */}
              <div className="mt-5 pt-4 border-t border-white/[0.08] space-y-2.5 font-mono text-xs relative z-10">
                {/* Row 1: Size */}
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] py-2.5 px-3.5 rounded-xl flex items-center justify-between hover:bg-white/[0.05] transition-colors">
                  <div className="flex items-center gap-2 text-fg-secondary">
                    <FiHardDrive className="w-3.5 h-3.5 text-action" />
                    <span>Size</span>
                  </div>
                  <span className="font-bold text-fg">{formattedSize}</span>
                </div>

                {/* Row 2: Resolution */}
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] py-2.5 px-3.5 rounded-xl flex items-center justify-between hover:bg-white/[0.05] transition-colors">
                  <div className="flex items-center gap-2 text-fg-secondary">
                    <FiLayers className="w-3.5 h-3.5 text-action" />
                    <span>Resolution</span>
                  </div>
                  <span className="font-bold text-action">
                    {assetDetails?.resolution || "4K PBR (Seamless)"}
                  </span>
                </div>

                {/* Row 3: Format */}
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] py-2.5 px-3.5 rounded-xl flex items-center justify-between hover:bg-white/[0.05] transition-colors">
                  <div className="flex items-center gap-2 text-fg-secondary">
                    <FiBox className="w-3.5 h-3.5 text-action" />
                    <span>Format</span>
                  </div>
                  <span className="font-bold text-fg">.SKP Native / Universal</span>
                </div>
              </div>

              {/* Render Engine Compatibility Badges */}
              <div className="mt-4 relative z-10">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-fg-secondary/70 mb-1.5">
                  TESTED &amp; CALIBRATED FOR
                </span>
                <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                  <span className="glass-panel px-2.5 py-1 rounded-lg text-fg-secondary border border-white/10 text-xs font-mono bg-white/[0.02]">
                    V-Ray 6/7
                  </span>
                  <span className="glass-panel px-2.5 py-1 rounded-lg text-fg-secondary border border-white/10 text-xs font-mono bg-white/[0.02]">
                    Enscape 4.0+
                  </span>
                  <span className="glass-panel px-2.5 py-1 rounded-lg text-fg-secondary border border-white/10 text-xs font-mono bg-white/[0.02]">
                    D5 Render
                  </span>
                  <span className="glass-panel px-2.5 py-1 rounded-lg text-fg-secondary border border-white/10 text-xs font-mono bg-white/[0.02]">
                    Lumion 3D
                  </span>
                </div>
              </div>

              {/* Primary Download CTA Button */}
              <div className="mt-6 pt-2 space-y-2 relative z-10">
                {assetDetails?.access_type === "paid" ? (
                  isPatron ? (
                    <button
                      type="button"
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="w-full bg-gradient-to-r from-extension to-action hover:brightness-110 active:scale-[0.99] text-canvas font-semibold text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-extension/10 flex items-center justify-center gap-2 transition-all cursor-pointer font-sans"
                    >
                      <FiDownload className="w-4 h-4" />
                      <span>{isDownloading ? "Downloading..." : "Download PRO .SKP Model"}</span>
                    </button>
                  ) : isAuthenticated ? (
                    <button
                      type="button"
                      onClick={() => setShowModal(true)}
                      className="w-full bg-[#FF424D] hover:bg-[#E63A42] active:scale-[0.99] text-white font-semibold text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer font-sans"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.386.524c-4.764 0-8.64 3.876-8.64 8.64 0 4.75 3.876 8.613 8.64 8.613 4.75 0 8.614-3.864 8.614-8.613C24 4.4 20.136.524 15.386.524M.003 23.537h4.22V.524H.003" />
                      </svg>
                      <span>Subscribe on Patreon to Unlock</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowModal(true)}
                      className="w-full bg-[#FF424D] hover:bg-[#E63A42] active:scale-[0.99] text-white font-semibold text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer font-sans"
                    >
                      <FiLock className="w-4 h-4" />
                      <span>Unlock with Patreon</span>
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="w-full bg-action hover:bg-action-hover active:bg-action-pressed text-canvas font-semibold text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-action/20 flex items-center justify-center gap-2 transition-all cursor-pointer font-sans"
                  >
                    <FiDownload className="w-4 h-4" />
                    <span>{isDownloading ? "Downloading..." : "Download"}</span>
                  </button>
                )}
              </div>
            </div>

            {/* 3D Asset License & Model Guarantee Card (Separates Download from Ad) */}
            <div className="bg-surface/30 backdrop-blur-2xl border border-white/[0.08] rounded-panel p-4 sm:p-5 shadow-xl relative space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <FiShield className="w-4 h-4 text-action" />
                  <span className="text-xs font-mono uppercase tracking-wider text-fg font-semibold">
                    License &amp; Geometry
                  </span>
                </div>
                <span className="text-[10px] font-mono text-action bg-action-tintBg border border-action-tintLine px-2 py-0.5 rounded-full">
                  Verified .SKP
                </span>
              </div>

              {/* Highlighted 100% Human-Made Guarantee Badge */}
              <div className="p-2.5 rounded-xl bg-action-tintBg/50 border border-action-tintLine flex items-start gap-2.5 shadow-xs">
                <FiCheckCircle className="w-4 h-4 text-action shrink-0 mt-0.5" />
                <span className="text-xs font-mono text-fg-secondary leading-relaxed">
                  <strong className="text-action font-semibold">100% Human-Made:</strong> Each model is handcrafted by 3D artists with clean quad topology — zero AI-generated meshes.
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono text-fg-secondary pt-0.5">
                <div className="flex items-start gap-2">
                  <FiCheckCircle className="w-3.5 h-3.5 text-action/70 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-fg font-medium">Commercial &amp; Personal Renders:</strong> Royalty-free for client projects.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <FiCheckCircle className="w-3.5 h-3.5 text-action shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-fg font-medium">Clean 3D Topology:</strong> 1:1 real-world scale, origin-centered axis.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <FiCheckCircle className="w-3.5 h-3.5 text-action shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-fg font-medium">Native SketchUp:</strong> Fully compatible with SketchUp 2017–2026.
                  </span>
                </div>
              </div>
            </div>

            {/* Right Rail In-Feed AdSense */}
            <InFeedAd />

          </div>
        </div>

        {/* 4. MID-CONTENT HORIZONTAL AD BANNER */}
        <ResponsiveBannerAd className="mt-8" />

        {/* 5. RELATED ASSETS & MATCHING FURNITURE SECTION */}
        {relatedAssets.length > 0 && (
          <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-line space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base sm:text-lg font-bold text-fg tracking-tight font-sans">
                Related Assets
              </h2>
              <Link
                href={`/${slugify(categoryName)}-${categoryId}/${slugify(subCategoryName)}-${subCategoryId}`}
                className="text-xs font-mono text-action hover:text-action-hover transition-colors flex items-center gap-1 font-medium"
              >
                <span>View All {subCategoryName}</span>
                <span>&rarr;</span>
              </Link>
            </div>

            {/* 6-Column Grid: 5 Models + 1 Native In-Feed Ad at Card #3 */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
              
              {/* Card #1 */}
              {relatedAssets[0] && (
                <RelatedAssetCard
                  asset={relatedAssets[0]}
                  categoryName={categoryName}
                  subCategoryName={subCategoryName}
                  getOriginalImageUrl={getOriginalImageUrl}
                  onDownloadClick={showToast}
                />
              )}

              {/* Card #2 */}
              {relatedAssets[1] && (
                <RelatedAssetCard
                  asset={relatedAssets[1]}
                  categoryName={categoryName}
                  subCategoryName={subCategoryName}
                  getOriginalImageUrl={getOriginalImageUrl}
                  onDownloadClick={showToast}
                />
              )}

              {/* Card #3: OFFICIAL EXTENSION PROMOTION CARD */}
              <ExtensionPromoCard />

              {/* Card #4 */}
              {relatedAssets[2] && (
                <RelatedAssetCard
                  asset={relatedAssets[2]}
                  categoryName={categoryName}
                  subCategoryName={subCategoryName}
                  getOriginalImageUrl={getOriginalImageUrl}
                  onDownloadClick={showToast}
                />
              )}

              {/* Card #5 */}
              {relatedAssets[3] && (
                <RelatedAssetCard
                  asset={relatedAssets[3]}
                  categoryName={categoryName}
                  subCategoryName={subCategoryName}
                  getOriginalImageUrl={getOriginalImageUrl}
                  onDownloadClick={showToast}
                />
              )}

              {/* Card #6 */}
              {relatedAssets[4] && (
                <RelatedAssetCard
                  asset={relatedAssets[4]}
                  categoryName={categoryName}
                  subCategoryName={subCategoryName}
                  getOriginalImageUrl={getOriginalImageUrl}
                  onDownloadClick={showToast}
                />
              )}

            </div>
          </div>
        )}

      </div>

      {/* Patreon Access Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-canvas/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-surface/95 backdrop-blur-2xl border border-line rounded-panel p-6 sm:p-8 max-w-md w-full mx-4 shadow-2xl relative text-fg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-raised hover:bg-surface text-fg-secondary hover:text-fg border border-line flex items-center justify-center transition-colors cursor-pointer text-sm font-mono z-10"
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-extension-tintLine bg-extension-tintBg px-3 py-1 font-mono text-xs text-extension">
                <span>Patreon Pro Asset</span>
              </div>

              <h2 className="text-2xl font-semibold tracking-tight-h2 font-sans text-fg">
                {isAuthenticated ? "Become an Active Patron" : "Unlock with Patreon"}
              </h2>

              <p className="text-xs sm:text-sm text-fg-secondary leading-relaxed">
                {isAuthenticated
                  ? "Your account is not linked to an active Patreon subscription. Subscribe now to unlock this model and all premium 3D assets!"
                  : "To access our premium 3D models, please login with your Patreon account. Your membership supports new daily SketchUp uploads."}
              </p>

              <div className="rounded-xl border border-line bg-canvas/50 p-4 space-y-2.5">
                <h3 className="font-mono text-xs uppercase tracking-wider text-action font-semibold">
                  What PRO Members Receive:
                </h3>
                <ul className="text-xs font-mono text-fg-secondary space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-action font-bold">✓</span> Direct .SKP download for all PRO models
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-action font-bold">✓</span> SketchUp native layers and clean textures
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-action font-bold">✓</span> Ad-free experience across the platform
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-action font-bold">✓</span> Priority model requests &amp; fast support
                  </li>
                </ul>
              </div>

              <div className="pt-2 flex flex-col space-y-2.5">
                {isAuthenticated ? (
                  <a
                    href="https://www.patreon.com/sketchshaper"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#FF424D] hover:bg-[#E63A42] text-white font-mono text-xs uppercase tracking-wider font-semibold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <span>Subscribe on Patreon</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      login(
                        typeof window !== "undefined"
                          ? window.location.pathname
                          : undefined
                      );
                    }}
                    className="w-full bg-[#FF424D] hover:bg-[#E63A42] text-white font-mono text-xs uppercase tracking-wider font-semibold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                  >
                    <span>Login with Patreon</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-fg-secondary hover:text-fg text-xs font-mono py-2 transition-colors cursor-pointer text-center"
                >
                  Close
                </button>

                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      logout();
                    }}
                    className="text-fg-secondary/60 hover:text-danger text-xs font-mono transition-colors cursor-pointer text-center"
                  >
                    Log out / Switch account
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. FULLSCREEN HIGH-RES LIGHTBOX MODAL */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 select-none">
          {/* Top Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-30">
            <div className="flex items-center gap-3 min-w-0">
              <h3 className="text-sm font-semibold text-fg truncate font-sans max-w-xs sm:max-w-md">
                {assetDetails?.name}
              </h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/10 text-fg-secondary shrink-0">
                Angle {activeImageIndex + 1} of {displayImages.length}
              </span>
            </div>

            {/* Shaders + Close Button */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1 bg-surface/60 border border-line rounded-lg p-1">
                {[
                  { id: "beauty", label: "Render" },
                  { id: "clay", label: "Viewport" },
                  { id: "wireframe", label: "Wireframe" },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setShaderMode(id)}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                      shaderMode === id
                        ? "bg-fg text-canvas font-semibold shadow-sm"
                        : "text-fg-secondary hover:text-fg"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsFullscreen(false);
                  setZoomLevel(1);
                  setPanPosition({ x: 0, y: 0 });
                }}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-fg transition-all cursor-pointer"
                aria-label="Close fullscreen"
                title="Close (Esc)"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Fullscreen Canvas Body */}
          <div
            className={`flex-1 relative flex items-center justify-center overflow-hidden my-4 ${
              zoomLevel > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Fullscreen Left Arrow */}
            {displayImages.length > 1 && (
              <button
                type="button"
                onClick={handlePrevAngle}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/70 hover:bg-black/95 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-2xl hover:scale-110 active:scale-95 cursor-pointer"
                aria-label="Previous angle"
                title="Previous Angle (← key)"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Fullscreen Right Arrow */}
            {displayImages.length > 1 && (
              <button
                type="button"
                onClick={handleNextAngle}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/70 hover:bg-black/95 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-2xl hover:scale-110 active:scale-95 cursor-pointer"
                aria-label="Next angle"
                title="Next Angle (→ key)"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* High-Res Image Transform Stage */}
            <div
              className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none"
              style={{
                transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <Image
                key={activeImage?.image || activeImageIndex}
                src={getOriginalImageUrl(activeImage?.image)}
                alt={activeImage?.alt?.trim() || assetDetails?.name || "3D Model Render"}
                fill
                sizes="100vw"
                onLoad={() => setIsAngleLoading(false)}
                onError={() => setIsAngleLoading(false)}
                style={shaderFilterStyle}
                className={`object-contain p-6 drop-shadow-[0_20px_48px_rgba(0,0,0,0.9)] select-none transition-all duration-300 ${
                  isAngleLoading ? "opacity-30 scale-[0.98]" : "opacity-100 scale-100"
                }`}
              />
            </div>

            {/* Lightbox Angle Loading Pill Indicator */}
            {isAngleLoading && (
              <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                <div className="bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 shadow-2xl flex items-center gap-2 text-xs font-mono text-fg animate-in fade-in duration-150">
                  <FiLoader className="w-3.5 h-3.5 animate-spin text-action" />
                  <span>Loading angle...</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Toolbar & Carousel */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-white/10 relative z-30">
            {/* Angle Thumbnails */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
              {displayImages.map((img, idx) => (
                <button
                  key={img?.id || idx}
                  type="button"
                  onClick={() => {
                    switchAngle(idx);
                  }}
                  className={`w-14 h-10 rounded overflow-hidden border-2 transition-all relative shrink-0 cursor-pointer ${
                    activeImageIndex === idx
                      ? "border-action shadow-lg scale-105"
                      : "border-white/20 hover:border-white/50 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={getOptimizedImageUrl(getOriginalImageUrl(img?.image))}
                    alt={`Angle #${idx + 1}`}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2 bg-black/60 border border-white/15 rounded-lg p-1.5 shadow-xl shrink-0">
              <button
                type="button"
                onClick={() => handleZoomChange(-0.5)}
                disabled={zoomLevel <= 1}
                className="p-1.5 rounded text-fg-secondary hover:text-fg hover:bg-white/10 disabled:opacity-30 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <FiZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono px-2 text-fg min-w-[48px] text-center font-medium">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => handleZoomChange(0.5)}
                disabled={zoomLevel >= 3}
                className="p-1.5 rounded text-fg-secondary hover:text-fg hover:bg-white/10 disabled:opacity-30 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <FiZoomIn className="w-4 h-4" />
              </button>
              {zoomLevel > 1 && (
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="p-1.5 rounded text-fg-secondary hover:text-fg hover:bg-white/10 transition-colors cursor-pointer"
                  title="Reset Zoom"
                >
                  <FiRotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for Extension Promotion Card inside Related Assets
function ExtensionPromoCard() {
  return (
    <article className="bg-surface border border-line hover:border-action/50 rounded-xl overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-md hover:shadow-xl relative">
      <div>
        <Link
          href="/extension"
          className="aspect-[4/3] w-full bg-canvas/60 overflow-hidden relative flex flex-col items-center justify-center p-2.5 group-hover:bg-canvas/80 transition-colors"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute w-32 h-32 rounded-full bg-action/15 blur-2xl pointer-events-none group-hover:bg-action/25 transition-all duration-500" />

          {/* Centered Extension Icon / Visual */}
          <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-action/10 border border-action/30 flex items-center justify-center text-action shadow-lg shadow-action/10 group-hover:scale-110 group-hover:border-action/60 transition-transform duration-300">
            <FiZap className="w-6 h-6 sm:w-7 sm:h-7 fill-action/20" />
          </div>

          {/* Top-Left Pricing Badge (matching Asset Card PRO/Free badge) */}
          <div className="absolute top-2 left-2 z-10 pointer-events-none">
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-action-tintBg text-action border border-action-tintLine shadow-sm flex items-center gap-1">
              <span>⚡</span> PLUGIN
            </span>
          </div>

          {/* Top-Right Version Chip */}
          <div className="absolute top-2 right-2 z-10 pointer-events-none">
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-white/5 text-fg-secondary/80 border border-white/10 shadow-sm">
              v1.5.0
            </span>
          </div>
        </Link>

        {/* Info Block (matches title + subtitle spacing of models) */}
        <div className="p-2.5">
          <Link href="/extension" className="block group">
            <h3
              className="text-xs font-semibold text-fg truncate group-hover:text-action transition-colors font-sans"
              title="SketchShaper Extension for SketchUp"
            >
              SketchShaper Plugin
            </h3>
            <p className="text-[10px] text-fg-secondary truncate mt-0.5 font-mono">
              Direct SketchUp Library
            </p>
          </Link>
        </div>
      </div>

      {/* Bottom CTA Button (matches Inspect Model button) */}
      <div className="p-2.5 pt-0">
        <Link
          href="/extension"
          className="w-full block text-center bg-action/10 hover:bg-action text-action hover:text-canvas border border-action/30 hover:border-action text-[11px] font-mono font-medium py-1.5 rounded-lg transition-all shadow-sm"
        >
          Free Extension &rarr;
        </Link>
      </div>
    </article>
  );
}

// Sub-component for individual Related Asset Cards
function RelatedAssetCard({
  asset,
  categoryName,
  subCategoryName,
  getOriginalImageUrl,
  onDownloadClick,
}) {
  const assetSize = formatAssetSize(asset);

  const href = `/${slugify(categoryName)}/${slugify(subCategoryName)}/${slugify(asset?.name)}-${asset?.id}`;

  return (
    <article className="bg-surface border border-line hover:border-action/40 rounded-xl overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-md hover:shadow-xl">
      <div>
        <Link
          href={href}
          className="aspect-[4/3] w-full bg-canvas/40 overflow-hidden relative flex items-center justify-center p-2.5"
        >
          {asset?.cover ? (
            <Image
              src={getOptimizedImageUrl(getOriginalImageUrl(asset.cover))}
              alt={asset?.cover_alt?.trim() || asset?.name || "Asset image"}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16.6vw"
              className="object-contain p-2 group-hover:scale-[1.15] transition-transform duration-500 ease-out drop-shadow-[0_6px_14px_rgba(0,0,0,0.65)]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-fg-secondary/40 font-mono text-[10px]">
              .SKP
            </div>
          )}

          {/* Top-Left Pricing Badge */}
          <div className="absolute top-2 left-2 z-10 pointer-events-none">
            {asset?.access_type === "paid" ? (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-extension-tintBg text-extension border border-extension-tintLine shadow-sm">
                PRO
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-action-tintBg text-action border border-action-tintLine shadow-sm">
                Free
              </span>
            )}
          </div>
        </Link>

        {/* Info */}
        <div className="p-2.5">
          <Link href={href} className="block group">
            <h3
              className="text-xs font-medium text-fg truncate group-hover:text-action transition-colors font-sans"
              title={asset?.name}
            >
              {asset?.name}
            </h3>
            <p className="text-[10px] text-fg-secondary truncate mt-0.5 font-mono">
              {assetSize}
            </p>
          </Link>
        </div>
      </div>

      <div className="p-2.5 pt-0">
        <Link
          href={href}
          className="w-full block text-center bg-surface-raised hover:bg-surface border border-line text-fg text-[11px] font-mono py-1.5 rounded-lg transition-colors"
        >
          Inspect Model &rarr;
        </Link>
      </div>
    </article>
  );
}

export default SubCategoryDetails;

"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { getOptimizedImageUrl } from "@/utils/cloudinary";
import { CategoryAds } from "@/components/Shared/GoogleAdsense/categoryads";
import useSWR from "swr";
import { fetcher } from "@/utils/swrFetcher";
import slugify from "@/utils/slugify";
import { usePatreonAuth } from "@/contexts/PatreonAuthContext";

const SubCategoryDetails = ({ assetDetails }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [showAds, setShowAds] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const leftAdRef = useRef(null);
  const rightAdRef = useRef(null);

  const { token, user, login, logout } = usePatreonAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthenticated = mounted && !!token && !!user;
  const isPatron = isAuthenticated && !!user?.is_active_patron;

  const handleDownload = () => {
    if (!assetDetails?.id) return;

    // If it is a paid asset and user is not an active patron, open the Patreon modal
    if (assetDetails?.access_type === "paid" && !isPatron) {
      setShowModal(true);
      return;
    }

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
    }, 100);
  };

  // Fetch related assets from the same sub-category
  const { data: relatedAssetsData } = useSWR(
    assetDetails?.sub_category_id
      ? `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/sub-categories/${assetDetails.sub_category_id}`
      : null,
    fetcher,
  );

  useEffect(() => {
    const handleResize = () => {
      setShowAds(window.innerWidth >= 768 && !isPatron);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isPatron]);

  useEffect(() => {
    if (showAds) {
      const loadAd = (ref) => {
        if (ref && ref.current) {
          const width = ref.current.offsetWidth;
          if (width > 0) {
            try {
              // Avoid double-initializing the same <ins> element
              if (
                ref.current.getAttribute("data-adsbygoogle-status") !== "done"
              ) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
              }
            } catch (error) {
              console.error("AdSense error:", error);
            }
          } else {
            console.warn("Ad slot has zero width, skipping ad initialization.");
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

  // Filter related assets (exclude current asset and show 6 random assets)
  const relatedAssets =
    relatedAssetsData?.data?.assets
      ?.filter((asset) => asset.id !== assetDetails?.id)
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
                style={{ display: "block", width: "100%", height: "100%" }}
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
                "--swiper-navigation-color": "#fff",
                "--swiper-pagination-color": "#fff",
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
                    src={getOptimizedImageUrl(
                      getOriginalImageUrl(image?.image),
                    )}
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
                style={{ display: "block", width: "100%", height: "100%" }}
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
        <div className="flex flex-col md:flex-row items-center md:justify-center gap-6">
          {/* Left: Asset Details */}
          <div className="md:flex-1 md:text-left text-center">
            <div className="flex items-center gap-2 md:justify-start justify-center">
              <p className="font-semibold text-sm">Name - </p>
              <h1 className="text-sm font-medium flex items-center gap-2">
                <span>{assetDetails?.name}</span>
                {assetDetails?.access_type === "paid" && (
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 border border-purple-400/30">
                    <span>💎</span> PRO
                  </span>
                )}
              </h1>
            </div>
            <p className="text-sm">
              <span className="font-semibold">Size - </span>
              <span className="text-xs">{assetDetails?.size}</span>
            </p>
            <p className="text-sm">
              <span className="font-semibold">Resolution - </span>
              <span className="text-xs">{assetDetails?.resolution}</span>
            </p>
            <p className="text-sm max-w-md">
              <span className="font-semibold">Short Description - </span>
              <span className="text-xs">{assetDetails?.short_description}</span>
            </p>
          </div>

          {/* Center: Action / Download Button */}
          {assetDetails?.id && (
            <div className="w-64 flex flex-col items-center">
              {assetDetails?.access_type === "paid" ? (
                isPatron ? (
                  /* Case 1: Active Patron */
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="w-full font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/30 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>💎</span> PRO DOWNLOAD
                  </button>
                ) : isAuthenticated ? (
                  /* Case 2: Logged in, but not an active patron */
                  <div className="w-full flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setShowModal(true)}
                      className="w-full font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 text-white bg-[#FF424D] hover:bg-[#E63A42] shadow-red-500/20 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M15.386.524c-4.764 0-8.64 3.876-8.64 8.64 0 4.75 3.876 8.613 8.64 8.613 4.75 0 8.614-3.864 8.614-8.613C24 4.4 20.136.524 15.386.524M.003 23.537h4.22V.524H.003" />
                      </svg>
                      SUBSCRIBE TO UNLOCK
                    </button>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <span className="truncate max-w-[140px]">
                        {user?.email || "Free Account"}
                      </span>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={logout}
                        className="hover:text-red-400 underline cursor-pointer"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Case 3: Not logged in */
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="w-full font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/30 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>🔒</span> UNLOCK WITH PATREON
                  </button>
                )
              ) : (
                /* Free asset */
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 text-white bg-[#379960] hover:bg-[#3c634c] shadow-emerald-500/20 cursor-pointer"
                >
                  DOWNLOAD
                </button>
              )}
            </div>
          )}
          {/* Right spacer for centering balance */}
          <div className="hidden md:block md:flex-1"></div>
        </div>

        {/* Related Assets Section */}
        {relatedAssets.length > 0 && (
          <div className="mt-12 px-4 md:px-0">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 text-center">
              Related Assets
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 lg:gap-4 px-2 md:px-0">
              {relatedAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="group cursor-pointer mx-auto max-w-[300px]"
                >
                  <div className="relative overflow-hidden rounded-lg mb-2 aspect-square bg-gray-800">
                    {asset?.access_type === "paid" && (
                      <span className="absolute top-1.5 right-1.5 z-10 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow border border-purple-400/30 flex items-center gap-0.5">
                        <span>💎</span> PRO
                      </span>
                    )}
                    <Link
                      href={`/${slugify(relatedAssetsData?.data?.category?.name)}/${slugify(relatedAssetsData?.data?.name)}/${slugify(asset?.name)}-${asset?.id}`}
                      className="block w-full h-full"
                    >
                      {asset?.cover && (
                        <Image
                          src={getOptimizedImageUrl(
                            getOriginalImageUrl(asset?.cover),
                          )}
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

      {/* Patreon Access Modal (Restored from old Pro section) */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-gray-900 p-6 md:p-8 rounded-xl max-w-md w-full mx-4 border border-gray-700 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold transition cursor-pointer"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-3 text-white flex items-center gap-2">
              <span>💎</span>
              {isAuthenticated ? "Become a Patron" : "Premium Access Required"}
            </h2>

            <p className="mb-5 text-gray-300 text-sm leading-relaxed">
              {isAuthenticated
                ? "Your account is not linked to an active Patreon subscription. Subscribe now to unlock this model and all premium 3D assets!"
                : "To access our premium 3D models, please login with Patreon. Your support helps us create more amazing assets!"}
            </p>

            <div className="bg-gray-800/70 rounded-lg p-4 mb-6 border border-gray-700/50">
              <h3 className="font-semibold text-xs uppercase tracking-wider mb-2.5 text-purple-300">
                What you get with PRO:
              </h3>
              <ul className="text-xs text-gray-300 space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> Access
                  to 1500+ premium 3D models
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> Direct
                  download & SketchUp compatibility
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> 100+ new
                  models added every month
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> Priority
                  model requests & support
                </li>
              </ul>
            </div>

            <div className="flex flex-col space-y-3">
              {isAuthenticated ? (
                <a
                  href="https://www.patreon.com/sketchshaper"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#FF424D] hover:bg-[#E63A42] text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-red-500/20"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15.386.524c-4.764 0-8.64 3.876-8.64 8.64 0 4.75 3.876 8.613 8.64 8.613 4.75 0 8.614-3.864 8.614-8.613C24 4.4 20.136.524 15.386.524M.003 23.537h4.22V.524H.003" />
                  </svg>
                  Subscribe on Patreon
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    login(
                      typeof window !== "undefined"
                        ? window.location.pathname
                        : undefined,
                    );
                  }}
                  className="w-full bg-[#FF424D] hover:bg-[#E63A42] text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-red-500/20 cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15.386.524c-4.764 0-8.64 3.876-8.64 8.64 0 4.75 3.876 8.613 8.64 8.613 4.75 0 8.614-3.864 8.614-8.613C24 4.4 20.136.524 15.386.524M.003 23.537h4.22V.524H.003" />
                  </svg>
                  Login with Patreon
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white text-xs font-medium py-2 transition-colors cursor-pointer"
              >
                Maybe later
              </button>

              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    logout();
                  }}
                  className="text-gray-500 hover:text-red-400 text-xs transition-colors cursor-pointer"
                >
                  Log out / Switch account
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubCategoryDetails;

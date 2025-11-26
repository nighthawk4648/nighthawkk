"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { getOptimizedImageUrl } from "@/utils/cloudinary";
import Link from "next/link";
import slugify from "@/utils/slugify";
import useSWR from "swr";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

const fetcher = (url) => fetch(url).then((res) => res.json());

export const Pro = () => {
  const [downloadCount, setDownloadCount] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const { data: downloadData, mutate: mutateDownloadData } = useSWR(
    `${API_BASE_URL}/extension-downloads/MyExtension`,
    fetcher,
    { revalidateOnFocus: false }
  );
  const getOriginalImageUrl = (imagePath) => {
    return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
  };

  const fetchCategories = async (page, limit) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sketchshaper-pro-categories/pages?page=${page}&limit=${limit}&order=desc`
      );

      if (!response.ok) throw new Error("Failed to fetch categories");

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
      console.error("Error fetching categories:", error);
      throw error;
    }
  };

  const {
    data: categories,
    isLoading,
    hasMore,
    error,
    observerTarget,
  } = useInfiniteScroll(fetchCategories, 12);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/extension-downloads/increment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ extensionName: "MyExtension" }),
        }
      );

      if (!response.ok) throw new Error("Failed to increment download count");

      await mutateDownloadData();

      const link = document.createElement("a");
      link.href = "/assets/rbz/sketchshaperpro.rbz";
      link.download = "sketchshaperpro.rbz";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error incrementing download count:", error);
    } finally {
      setIsDownloading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4 py-6 flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-1">
        SketchShaper Pro
      </h1>
      <div className="text-base text-gray-300 text-center max-w-4xl mb-6 space-y-4">
        <h2 className="text-xl font-bold text-blue-400">
          Supercharge Your SketchUp!
        </h2>
        <p className="text-sm mb-4">
          Access high-quality, ready-to-use 3D models directly inside SketchUp
          with SketchShaper Pro plugins. No manual downloads needed.
        </p>

        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-sm w-full">
          <h3 className="text-xl font-bold text-center mb-3 text-white">
            All-In-One Features —{" "}
            <span className="text-yellow-400">$5/month</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-x-6 gap-y-6">
            <ul className="text-left space-y-4">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Cloud Library (1500+ Models)</span>
              </li>

              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>15+ Categories</span>
              </li>

              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Pro Models included (Ikea, Wayfair, Crate & Barrel)</span>
              </li>

              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>100+ New Models Monthly</span>
              </li>
            </ul>
            <ul className="text-left space-y-4">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Patreon Integration</span>
              </li>

              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>One-Click Import</span>
              </li>

              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>SketchUp 2020-2025</span>
              </li>

              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Custom Model Requests</span>
              </li>
            </ul>

            <div>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="mt-4 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-700 text-gray-900 font-bold py-2 px-6 rounded-lg transition-colors duration-200"
              >
                {isDownloading ? "Downloading..." : "Download"}
              </button>
              
              <p className="mt-2 text-green-500 font-bold"> or try the <Link href="https://extensions.sketchup.com/extension/ac6a412b-69cf-4397-9e4c-aef489185e3d/sketchshaper" target="_blank" rel="noopener noreferrer" className="underline">Free Version</Link></p>

              <p className="mt-2 font-bold text-white">Downloaded: <span className="text-yellow-400">{downloadData?.data?.count || 0}</span> </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-300 max-w-2xl">
          Error loading categories: {error}
        </div>
      )}

      <div className="mt-10 text-center w-full">
        <div className="w-full mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {categories?.map((category) => {
              const imageUrl = category?.preview_image
                ? getOptimizedImageUrl(
                    getOriginalImageUrl(category.preview_image)
                  )
                : "https://placehold.co/300x200?text=Category";

              return (
                <div
                  key={category.id}
                  className="flex flex-col items-center bg-white/10 p-4 rounded-xl backdrop-blur-md shadow-lg hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative w-full h-60 rounded-lg overflow-hidden">
                    {category?.preview_image && (
                      <Image
                        src={imageUrl}
                        alt={category?.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>

                  <p className="mt-3 text-center text-white font-medium line-clamp-2">
                    {category?.name}
                  </p>

                  {category?.description && (
                    <p className="mt-2 text-center text-gray-400 text-xs line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  <Link href={`/pro/${slugify(category.name)}-${category?.id}`}>
                    <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-5 rounded-lg shadow-md transition cursor-pointer disabled:opacity-50 flex items-center justify-center w-full">
                      Browse Models
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>

          {isLoading && categories.length > 0 && (
            <div className="flex justify-center mt-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {hasMore && (
            <div
              ref={observerTarget}
              className="h-10 mt-8 flex items-center justify-center"
            >
              {isLoading && categories.length > 0 && (
                <span className="text-gray-400">
                  Loading more categories...
                </span>
              )}
            </div>
          )}

          {!hasMore && categories.length > 0 && (
            <div className="text-center mt-8 text-gray-400">
              No more categories to load
            </div>
          )}

          {!isLoading && categories.length === 0 && !error && (
            <div className="text-center mt-8 text-gray-400">
              No categories available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

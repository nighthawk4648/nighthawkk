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
      link.href = "/assets/rbz/sketchshaper(version 1.1.0).rbz";
      link.download = "sketchshaper(version 1.1.0).rbz";
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
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
        SketchShaper Pro
      </h1>
      
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-gray-700 rounded-xl p-12 text-center w-full md:max-w-none md:w-full max-w-lg mb-10 shadow-2xl">
        {/* <h2 className="text-2xl font-bold mb-6">Browse Extension</h2> */}
        <p className="text-gray-300 mb-8">Explore our powerful SketchUp free extension with premium features</p>
        <Link href="/extension">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg">
            Browse Extension
          </button>
        </Link>
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

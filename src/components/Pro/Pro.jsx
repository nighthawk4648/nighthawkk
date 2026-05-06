"use client";



import React, { useState } from "react";

import Image from "next/image";

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

import { getOptimizedImageUrl } from "@/utils/cloudinary";

import Link from "next/link";

import slugify from "@/utils/slugify";

import useSWR from "swr";

import { AllProFiles } from "./AllProFiles";



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



    return (

    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">

      {/* Header */}

      <div className="px-4 py-6 text-center border-b border-gray-800">

        <h1 className="text-3xl md:text-4xl font-bold mb-4">

          SketchShaper Pro

        </h1>

        

        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-gray-700 rounded-xl p-6 max-w-4xl mx-auto shadow-2xl">

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <p className="text-gray-300 text-center md:text-left">Explore our powerful SketchUp free extension with premium features</p>

            <Link href="/extension">

              <button className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg border border-gray-700">

                Browse Extension

              </button>

            </Link>

          </div>

        </div>

      </div>



      {/* Main Content - Two Column Layout */}

      <div className="flex flex-col lg:flex-row">

        {/* Left Side - Categories */}

        <div className="w-full lg:w-1/5 border-r border-gray-800 lg:fixed lg:h-screen lg:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 hover:scrollbar-thumb-gray-600">

          <div className="p-4">

            <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>

            

            {error && (

              <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-300">

                Error loading categories: {error}

              </div>

            )}



            {isLoading && categories.length === 0 ? (

              <div className="flex flex-col items-center justify-center py-20">

                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>

                <p className="text-gray-400">Loading categories...</p>

              </div>

            ) : (

              <div className="space-y-4">

                {categories?.map((category) => {

                  const imageUrl = category?.preview_image

                    ? getOptimizedImageUrl(getOriginalImageUrl(category.preview_image))

                    : "https://placehold.co/300x200?text=Category";



                  return (

                    <Link href={`/pro/${slugify(category.name)}-${category?.id}`} key={category.id}>

                      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 hover:bg-white/20 transition-all duration-300 cursor-pointer group">

                        <div className="flex items-center gap-3">

                          {category?.preview_image && (

                            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">

                              <Image

                                src={imageUrl}

                                alt={category?.name}

                                fill

                                className="object-cover group-hover:scale-105 transition-transform duration-300"

                              />

                            </div>

                          )}

                          <div className="flex-1 min-w-0">

                            <p className="text-white font-semibold text-xs leading-tight">

                              {category?.name}

                            </p>

                            {category?.description && (

                              <p className="text-gray-400 text-xs leading-tight mt-1 line-clamp-2">

                                {category.description}

                              </p>

                            )}

                          </div>

                          <button className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold py-1 px-2 rounded transition cursor-pointer flex-shrink-0 border border-gray-700">

                            Browse

                          </button>

                        </div>

                      </div>

                    </Link>

                  );

                })}

              </div>

            )}



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

            {/* Add extra padding at bottom to ensure last category is visible */}

            <div className="h-60"></div>

          </div>

        </div>



        {/* Right Side - All Pro Files */}

        <div className="w-full lg:w-4/5 lg:ml-auto">

          <AllProFiles />

        </div>

      </div>

    </div>

  );

};


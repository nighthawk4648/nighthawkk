'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getOptimizedImageUrl } from '@/utils/cloudinary';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const Page = () => {
  const router = useRouter();

  const getOriginalImageUrl = (imagePath) => {
    return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
  };

  // Fetch categories with pagination
  const fetchCategories = async (page, limit) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/sketchshaper-pro-categories/pages?page=${page}&limit=${limit}&order=desc`
      );
      
      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const data = await response.json();
      return {
        result: data.data?.result || [],
        pagination: data.data?.pagination || { total: 0, totalPage: 1, currentPage: page }
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  };

  const { data: categories, isLoading, hasMore, error, observerTarget } = useInfiniteScroll(fetchCategories, 12);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4 py-6 flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-1">SketchShaper Pro</h1>
      <div className="text-base text-gray-300 text-center max-w-2xl mb-6 space-y-4">
        <h2 className="text-xl font-bold text-blue-400">Supercharge Your SketchUp!</h2>
        <p className="text-sm mb-4">
          Access high-quality, ready-to-use 3D models directly inside SketchUp with SketchShaper Pro plugins. No manual downloads needed.
        </p>

        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-sm w-full">
          <h3 className="text-xl font-bold text-center mb-3 text-white">
            All-In-One Features — <span className="text-yellow-400">$5/month</span>
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-left">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Cloud Library (1500+ Models)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Patreon Integration</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>15+ Categories</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>One-Click Import</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Pro Models included (Ikea, Wayfair, Crate & Barrel)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>SketchUp 2020-2025</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>100+ New Models Monthly</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Custom Model Requests</span>
            </li>
          </ul>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-300 max-w-2xl">
          Error loading categories: {error}
        </div>
      )}

      <div className='mt-10 text-center w-full'>
        <div className='w-full mb-8'>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4'>
            {categories?.map((category) => {
              const imageUrl = category?.preview_image ? getOptimizedImageUrl(getOriginalImageUrl(category.preview_image)) : 'https://placehold.co/300x200?text=Category';
              
              return (
              <div
                key={category.id}
                className='flex flex-col items-center bg-white/10 p-4 rounded-xl backdrop-blur-md shadow-lg hover:bg-white/20 transition-all duration-300 cursor-pointer group'
              >
                <div className='relative w-full h-48 rounded-lg overflow-hidden'>
                  {category?.preview_image && (
                    <Image
                      src={imageUrl}
                      alt={category?.name}
                      fill
                      className='object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                  )}
                </div>

                <p className='mt-3 text-center text-white font-medium line-clamp-2'>
                  {category?.name}
                </p>

                {category?.description && (
                  <p className='mt-2 text-center text-gray-400 text-xs line-clamp-2'>
                    {category.description}
                  </p>
                )}

                <button
                  onClick={() => router.push(`/pro/${category?.id}`)}
                  className='mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-5 rounded-lg shadow-md transition cursor-pointer disabled:opacity-50 flex items-center justify-center w-full'
                >
                  Browse Models
                </button>
              </div>
            );
            })}
          </div>

          {/* Loading indicator */}
          {isLoading && categories.length > 0 && (
            <div className='flex justify-center mt-8'>
              <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500'></div>
            </div>
          )}

          {/* Infinite scroll trigger */}
          {hasMore && (
            <div
              ref={observerTarget}
              className='h-10 mt-8 flex items-center justify-center'
            >
              {isLoading && categories.length > 0 && (
                <span className='text-gray-400'>Loading more categories...</span>
              )}
            </div>
          )}

          {/* No more data message */}
          {!hasMore && categories.length > 0 && (
            <div className='text-center mt-8 text-gray-400'>
              No more categories to load
            </div>
          )}

          {/* Empty state */}
          {!isLoading && categories.length === 0 && !error && (
            <div className='text-center mt-8 text-gray-400'>
              No categories available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;

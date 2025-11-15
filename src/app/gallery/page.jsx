'use client';
import React, { useState } from 'react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const Page = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const closeModal = () => setSelectedImage(null);

  // Fetch gallery images with pagination
  const fetchGalleryImages = async (page, limit) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/gallery/pages?page=${page}&limit=${limit}&order=desc`
      );
      
      if (!response.ok) throw new Error('Failed to fetch gallery images');
      
      const data = await response.json();
      return {
        result: data.data?.result || [],
        pagination: data.data?.pagination || { total: 0, totalPage: 1, currentPage: page }
      };
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      throw error;
    }
  };

  const { data: images, isLoading, hasMore, error, observerTarget } = useInfiniteScroll(fetchGalleryImages, 12);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4 py-10">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">Render Gallery</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-300 max-w-2xl mx-auto">
          Error loading gallery: {error}
        </div>
      )}

      {/* Full-width large thumbnail grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="overflow-hidden rounded-xl border border-gray-700 shadow-md cursor-pointer hover:scale-105 transition-transform duration-300 group"
            onClick={() => setSelectedImage(image.image_url || image.url)}
          >
            <img
              src={image.image_url || image.url}
              alt={image.title || `Gallery image ${image.id}`}
              className="w-full h-64 object-cover group-hover:brightness-110 transition-all duration-300"
            />
            {image.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm font-semibold truncate">{image.title}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {isLoading && images.length > 0 && (
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div
          ref={observerTarget}
          className="h-10 mt-8 flex items-center justify-center"
        >
          {isLoading && images.length > 0 && (
            <span className="text-gray-400">Loading more images...</span>
          )}
        </div>
      )}

      {/* No more data message */}
      {!hasMore && images.length > 0 && (
        <div className="text-center mt-8 text-gray-400">
          No more images to load
        </div>
      )}

      {/* Empty state */}
      {!isLoading && images.length === 0 && !error && (
        <div className="text-center mt-8 text-gray-400">
          No gallery images available
        </div>
      )}

      {/* Modal for full image preview */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 text-white text-4xl font-bold hover:text-red-500 transition"
          >
            &times;
          </button>
          <img
            src={selectedImage}
            alt="Full Preview"
            className="max-w-full max-h-full rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default Page;

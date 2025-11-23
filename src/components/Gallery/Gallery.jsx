'use client';

import Image from 'next/image';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getOptimizedImageUrl } from '@/utils/cloudinary';
import { useState } from 'react';
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const Gallery = () => {
     const [selectedImage, setSelectedImage] = useState(null);
      const closeModal = () => setSelectedImage(null);
    
      const getOriginalImageUrl = (imagePath) => {
        return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
      };
    
      const fetchGalleryImages = async (page, limit) => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/gallery/pages?page=${page}&limit=${limit}&order=desc`
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
       
            
             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
               {images.map((image) => {
                 const imageUrl = image.image || image.image_url || image.url;
                 const optimizedUrl = getOptimizedImageUrl(getOriginalImageUrl(imageUrl));
                 
                 return (
                   <div
                     key={image.id}
                     className="overflow-hidden rounded-xl border border-gray-700 shadow-md cursor-pointer hover:scale-105 transition-transform duration-300 group relative"
                     onClick={() => setSelectedImage(optimizedUrl)}
                   >
                     {imageUrl && (
                       <Image
                         src={optimizedUrl}
                         alt={image.title || `Gallery image ${image.id}`}
                         width={400}
                         height={300}
                         className="w-full h-64 object-cover group-hover:brightness-110 transition-all duration-300"
                       />
                     )}
                     {image.title && (
                       <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                         <p className="text-sm font-semibold truncate">{image.title}</p>
                       </div>
                     )}
                   </div>
                 );
               })}
             </div>
       
             
             {isLoading && images.length > 0 && (
               <div className="flex justify-center mt-8">
                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
               </div>
             )}
       
            
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
       
            
             {!hasMore && images.length > 0 && (
               <div className="text-center mt-8 text-gray-400">
                 No more images to load
               </div>
             )}
       
            
             {!isLoading && images.length === 0 && !error && (
               <div className="text-center mt-8 text-gray-400">
                 No gallery images available
               </div>
             )}
       
             
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
                 <Image
                   src={selectedImage}
                   alt="Full Preview"
                   width={1200}
                   height={800}
                   className="max-w-full max-h-full rounded-xl shadow-2xl"
                   onClick={(e) => e.stopPropagation()}
                 />
               </div>
             )}
           </div>
    );
};
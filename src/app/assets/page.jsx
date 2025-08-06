'use client';
import React, { useState } from 'react';

export const previewImages = [
  '/assets/images/preview1.jpg',
  '/assets/images/preview2.png',
  '/assets/images/preview3.png ',
  '/assets/images/preview4.png',
  '/assets/images/preview5.png',
];

const Page = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const closeModal = () => setSelectedImage(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-zinc-200">
      <h1 className="text-4xl md:text-2xl font-bold text-center mb-12">Assets list</h1>

      {/* Full-width large thumbnail grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-10 px-8 gap-2 w-full">
        {previewImages.map((src, index) => (
          <div
            key={index}
            className="overflow-hidden shadow-md hover:shadow-2xl hover:shadow-blue-500/40 hover:ring-2 hover:ring-blue-400/40 transition-all duration-300 flex items-center justify-center w-[150px] h-[150px] rounded-lg"
          >
            <img
              src={src}
              alt={`Preview ${index + 1}`}
              className="w-[150px] h-[150px] object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;

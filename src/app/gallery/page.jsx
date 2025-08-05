'use client';
import React, { useState } from 'react';

const previewImages = [
  '/assets/images/preview1.jpg',
  '/assets/images/preview2.jpg',
];

const Page = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const closeModal = () => setSelectedImage(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4 py-10">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">Render Gallery</h1>

      {/* Full-width large thumbnail grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
        {previewImages.map((src, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-gray-700 shadow-md cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => setSelectedImage(src)}
          >
            <img
              src={src}
              alt={`Preview ${index + 1}`}
              className="w-full h-64 object-cover"
            />
          </div>
        ))}
      </div>

      {/* Modal for full image preview */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
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
          />
        </div>
      )}
    </div>
  );
};

export default Page;

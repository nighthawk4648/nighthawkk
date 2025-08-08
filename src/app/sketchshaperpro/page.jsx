'use client';
import React, { useEffect, useState } from 'react';
import { previewImages } from '../assets/page'; // Adjust the path if needed

const Page = () => {
  const [downloadCount, setDownloadCount] = useState(0);

  useEffect(() => {
    const savedCount = parseInt(localStorage.getItem('downloadCount')) || 0;
    setDownloadCount(savedCount);
  }, []);

  const handleDownloadClick = () => {
    const newCount = downloadCount + 1;
    setDownloadCount(newCount);
    localStorage.setItem('downloadCount', newCount.toString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4 py-10 flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-2">SketchShaper Pro</h1>
      <p className="text-lg text-gray-300 text-center max-w-2xl mb-10">
        Supercharge your SketchUp workflow with SketchShaper Pro — a powerful extension featuring an organized library of premium 3D interior and architectural assets. Quick, sleek, and made for pros.
      </p>

      {/* Full Width Image Row */}
      <div className="relative w-full mb-10 overflow-hidden">
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-4">
          {previewImages.slice(0, 5).map((src, index) => (
            <div
              key={index}
              className="w-[300px] h-[300px] flex-shrink-0 overflow-hidden rounded-xl  shadow-md hover:scale-105 transition-transform duration-300"
            >
              <img
                src={src}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {/* Arrow button */}
          <div className="w-[300px] h-[300px] flex-shrink-0 flex items-center justify-center">
            <button
              onClick={() => window.location.href = "/assets"}
              className="w-[80px] h-[80px]  hover:bg-blue-700 text-white rounded-full text-4xl shadow-lg transition flex items-center justify-center"
            >
              →
            </button>
          </div>
        </div>
      </div>

  

      {/* Download Button */}
      <a
        href=""
        download
        onClick={handleDownloadClick}
        className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-8 rounded-xl shadow-lg transition"
      >
        Download
      </a>

      {/* Free Version Text and Link */}
      <div className="mt-2 text-center">
        <span className="text-gray-300 text-sm">Free version available:&nbsp;</span>
        <a
          href="https://extensions.sketchup.com/extension/ac6a412b-69cf-4397-9e4c-aef489185e3d/sketchshaper"
          download
          className="text-green-400 underline text-sm hover:text-green-300"
        >
          Download Free Version
        </a>
      </div>

      {/* Download Count Display */}
      <p className="mt-4 text-gray-400 text-sm">
        Downloaded: <span className="text-white font-semibold">{downloadCount.toString().padStart(3, '0')}</span>
      </p>

      {/* Hide Scrollbars */}
      <style jsx>{`
        .no-scrollbar {
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Page;

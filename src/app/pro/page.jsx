'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Page = () => {

  const router = useRouter();

  const models = [
    {
      "image": "https://placehold.co/300x200?text=Mountain",
      "name": "Misty Mountain"
    },
    {
      "image": "https://placehold.co/300x200?text=Forest",
      "name": "Emerald Forest"
    },
    {
      "image": "https://placehold.co/300x200?text=Beach",
      "name": "Golden Beach"
    },
    {
      "image": "https://placehold.co/300x200?text=Cityscape",
      "name": "Night City"
    }
  ]



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
      <div className='mt-10 text-center'>
        <div className='w-full mb-8'>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {models?.map((model, index) => (
              <div
                key={index}
                className='flex flex-col items-center bg-white/10 p-4 rounded-xl backdrop-blur-md shadow-lg'
              >
                <div className='relative w-full h-48 rounded-lg overflow-hidden'>
                  <Image
                    src={model?.image}
                    alt={`Preview ${index + 1}`}
                    fill
                    className='object-cover'
                  />
                </div>

                <p className='mt-3 text-center text-white font-medium'>
                  {model?.name}
                </p>

                <button
                  onClick={() => router.push(`/pro/${model?.name}`)}
                  className='mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-5 rounded-lg shadow-md transition cursor-pointer disabled:opacity-50 flex items-center justify-center'
                >
                  Browse Model
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

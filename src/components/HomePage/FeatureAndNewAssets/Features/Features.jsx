import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import slugify from '@/utils/slugify';
import { getOptimizedImageUrl } from '@/utils/cloudinary';

const Features = ({ categories }) => {
    // Sort categories in ascending order by id
    const sortedCategories = categories.slice().sort((a, b) => a.id - b.id);

    const getOriginalImageUrl = (imagePath) => {
        return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
    }; 

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black p-4 lg:p-8 w-full">
            <div className="w-full max-w-full">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch">
                    {/* Features Section - 3/4 width */}
                    <div className="w-3/4">
                        <div className="text-center mb-4">
                            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                                Explore Our Features
                            </h2>
                            <p className="text-gray-400 text-sm lg:text-base max-w-2xl mx-auto">
                                Discover our comprehensive range of categories designed to meet your needs
                            </p>
                        </div>
                        
                        <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 lg:gap-4 mb-6'>
                            {sortedCategories.map((category) => (
                                <div 
                                    key={category.id} 
                                    className='group relative bg-gray-800 bg-opacity-30 backdrop-blur-sm border border-gray-600 rounded-lg p-4 lg:p-6 transition-all duration-500 hover:bg-gradient-to-br hover:from-blue-900 hover:to-purple-900 hover:border-transparent hover:shadow-2xl hover:shadow-blue-500/25'
                                >
                                    <Link 
                                        href={`/${slugify(category.name)}-${category.id}`}
                                        className="block rounded-lg"
                                        aria-label={`Explore ${category.name} category`}
                                    >
                                        <div className='text-center'>
                                            <div className="relative mb-4">
                                                {category.image && (
                                                    <div className="relative w-20 h-20 mx-auto">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-500 group-hover:scale-125"></div>
                                                        <Image
                                                            src={getOptimizedImageUrl(getOriginalImageUrl(category.image))}
                                                            height={120}
                                                            width={120}
                                                            alt={category.name}
                                                            className='w-full h-full object-cover rounded-full shadow-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-6'
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <h3 className='font-bold text-white text-base lg:text-lg mb-3 group-hover:text-cyan-300 transition-all duration-500'>
                                                {category.name}
                                            </h3>
                                            
                                        <div className="flex items-center justify-center space-x-1 text-gray-400 group-hover:text-cyan-300 transition-all duration-500">
                                                <span className="text-sm">Explore</span>
                                                <svg 
                                                    className="w-3 h-3 transform transition-all duration-500 group-hover:translate-x-2 group-hover:text-cyan-300" 
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Extensions Section - 1/4 width */}
                    <div className="w-1/4 flex flex-col">
                        <div className="text-center mb-4">
                            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                                Quick Access
                            </h2>
                            <p className="text-gray-400 text-sm lg:text-base max-w-2xl mx-auto">
                                Get instant access to our sketchshaper extensions
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3 lg:gap-4 flex-1 content-center">
                            <div className='group relative bg-gray-800 bg-opacity-30 backdrop-blur-sm border border-gray-600 rounded-lg p-4 lg:p-6 transition-all duration-500 hover:bg-gradient-to-br hover:from-blue-900 hover:to-purple-900 hover:border-transparent hover:shadow-2xl hover:shadow-blue-500/25 h-full flex flex-col justify-center'>
                                <Link 
                                    href="/extension"
                                    className="block rounded-lg"
                                    aria-label="Access sketchshaper extensions"
                                >
                                    <div className='text-center'>
                                        <div className="relative mb-4">
                                            <div className="relative w-16 h-16 mx-auto">
                                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-500 group-hover:scale-125"></div>
                                                <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:shadow-cyan-500/50">
                                                    <svg 
                                                        className="w-8 h-8 text-white" 
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <h3 className='font-bold text-white text-sm lg:text-base mb-2 group-hover:text-cyan-300 transition-all duration-500'>
                                            Extension
                                        </h3>
                                        
                                        <div className="flex items-center justify-center space-x-1 text-gray-400 group-hover:text-cyan-300 transition-all duration-500">
                                                <span className="text-xs">Explore</span>
                                                <svg 
                                                    className="w-3 h-3 transform transition-all duration-500 group-hover:translate-x-2 group-hover:text-cyan-300" 
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Features;

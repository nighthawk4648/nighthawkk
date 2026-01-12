'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getOptimizedImageUrl } from '@/utils/cloudinary';
import { formatDate } from '@/utils/formateDate';
import slugify from '@/utils/slugify';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

const BlogsPage = () => {
    const [selectedBlog, setSelectedBlog] = useState(null);
    const closeModal = () => setSelectedBlog(null);

    const getOriginalImageUrl = (imagePath) => {
        if (!imagePath) return '';
        return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
    };

    // Fetch blogs with pagination - wrapped in useCallback
    const fetchBlogs = useCallback(async (page, limit) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/blogs/pages?page=${page}&limit=${limit}&order=desc`
            );
            
            if (!response.ok) {
                throw new Error(`Failed to fetch blogs: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Make sure we're handling the response structure correctly
            const result = data.data?.result || [];
            const pagination = data.data?.pagination || {
                total: 0,
                totalPage: 1,
                currentPage: page
            };

            return {
                result,
                pagination
            };
        } catch (error) {
            console.error('Error in fetchBlogs:', error);
            throw error;
        }
    }, []); // Empty dependency array since we don't use any external values

    const { 
        data: blogs, 
        isLoading, 
        hasMore, 
        error, 
        observerTarget 
    } = useInfiniteScroll(fetchBlogs, 10);

    // Rest of your component remains the same...
    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white min-h-screen py-10 px-5">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">Our Blogs</h1>
                    <p className="text-gray-400 text-lg">Explore our latest articles and insights</p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-8">
                        <p>Error loading blogs: {error}</p>
                    </div>
                )}

                {/* Blogs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {blogs?.map((blog) => (
                        <div key={blog?.id} className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-700">
                            {/* Blog Image */}
                            {blog?.image && (
                                <Link href={`/blog/${slugify(blog?.title)}-${blog?.id}`} passHref>
                                    <div className="relative h-48 overflow-hidden cursor-pointer group">
                                        <Image
                                            src={getOptimizedImageUrl(getOriginalImageUrl(blog.image))}
                                            alt={blog?.title || 'Blog image'}
                                            width={500}
                                            height={300}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </Link>
                            )}

                            {/* Blog Content */}
                            <div className="p-5">
                                {/* Date and Author */}
                                <div className="flex gap-3 items-center mb-3 text-sm">
                                    <p className="text-amber-700 font-medium">
                                        {blog?.created_at ? formatDate(blog.created_at) : ''}
                                    </p>
                                    <p className="rounded-full bg-gray-600 w-1 h-1"></p>
                                    <p className="text-gray-400">{blog?.name || 'Unknown Author'}</p>
                                </div>

                                {/* Title */}
                                <h3 className="font-semibold text-lg mb-3 line-clamp-2 hover:text-amber-400 transition-colors">
                                    <Link href={`/blog/${slugify(blog?.title)}-${blog?.id}`} passHref>
                                        {blog?.title || 'Untitled Blog'}
                                    </Link>
                                </h3>

                                {/* Description */}
                                {blog?.short_description && (
                                    <p className="text-xs text-gray-300 mb-4 line-clamp-3">
                                        {blog.short_description}
                                    </p>
                                )}

                                {/* Read More Link */}
                                <Link 
                                    href={`/blog/${slugify(blog?.title)}-${blog?.id}`} 
                                    className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors"
                                >
                                    Read More →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                    </div>
                )}

                {/* Infinite Scroll Observer Target */}
                {hasMore && !isLoading && (
                    <div 
                        ref={observerTarget} 
                        className="flex justify-center items-center py-8"
                    >
                        <p className="text-gray-400">Loading more blogs...</p>
                    </div>
                )}

                {/* No More Content */}
                {!hasMore && blogs?.length > 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-400">No more blogs to load</p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && (!blogs || blogs.length === 0) && !error && (
                    <div className="text-center py-16">
                        <p className="text-gray-400 text-lg">No blogs found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogsPage;
import { getOptimizedImageUrl } from "@/utils/cloudinary";
import { formatDate } from "@/utils/formateDate";
import getData from "@/utils/getData";
import { sanitizeHtml } from "@/utils/sanitizeHtml";
import Image from "next/image";
import React from "react";
import { ErrorFallback } from "@/components/Shared/ErrorFallback/ErrorFallback ";
import { HorizontalBanner } from "@/components/Shared/GoogleAdsense/HorizontalBanner";
import Link from "next/link";
import slugify from "@/utils/slugify";

// Dynamic metadata generation
export async function generateMetadata({ params }) {
  const id = params?.blog?.split("-").pop();
  const blog = await getData(`blogs/${id}`);

  if (!blog?.data) {
    return {
      title: "Blog Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: blog.data.title,
    description: blog.data.short_description?.replace(/<[^>]*>/g, '').substring(0, 160) || "Read our blog",
    openGraph: {
      title: blog.data.title,
      description: blog.data.short_description?.replace(/<[^>]*>/g, '').substring(0, 160),
      images: blog.data.image ? [`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${blog.data.image}`] : [],
    },
  };
}

const Blogs = async ({ params }) => {
  const id = params?.blog?.split("-").pop();
  const blog = await getData(`blogs/${id}`);
  
  // Fetch all blogs for navigation
  const allBlogsResponse = await getData(`blogs/pages?page=1&limit=1000&order=desc`);
  const allBlogs = allBlogsResponse?.data?.result || [];
  
  // Find current blog index and determine prev/next
  const currentIndex = allBlogs.findIndex(b => b.id === parseInt(id));
  const prevBlog = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
  const nextBlog = currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;

  const getOriginalImageUrl = (imagePath) => {
    return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
  };

  if (!blog) {
    return <ErrorFallback />
  }

  return (
    <div className="bg-primary px-4 py-8 md:px-12 md:py-16">
      {/* Main content */}
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
          Blogs
        </h2>

        {/* Title and Date */}
        <div className="text-center">
          <h1 className="text-white text-2xl md:text-3xl font-bold mt-8">
            {blog?.data?.title}
          </h1>
          <p className="text-gray-500 mt-4 mb-10 text-sm md:text-base">
            {formatDate(blog?.data?.created_at)}
          </p>
        </div>

        {/* Cover Image */}
        <div className="mb-8">
          <Image
            src={getOptimizedImageUrl(getOriginalImageUrl(blog?.data?.image))}
            alt={blog?.data?.title || "Blog cover image"}
            width={1000}
            height={500}
            className="w-full max-w-4xl mx-auto rounded-md"
          />
        </div>
       <HorizontalBanner />

        {/* Blog Description */}
        <div className="blog-content text-white max-w-4xl mx-auto text-justify text-sm md:text-base px-2 md:px-0 mb-8">
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(blog?.data?.short_description),
            }}
          />
        </div>

        {/* Blog Paragraphs Part Before Image */}
        <div className="blog-content text-white max-w-4xl mx-auto space-y-6 text-justify text-sm md:text-base px-2 md:px-0">
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(blog?.data?.paragraph_one),
            }}
          />
           <HorizontalBanner />
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(blog?.data?.paragraph_two),
            }}
          />
        </div>
        <HorizontalBanner />
        
        {/* Middle Blog Image */}
        {blog?.data?.bgImage && (
          <div className="mb-8 mt-8">
            <Image
              src={getOptimizedImageUrl(getOriginalImageUrl(blog?.data?.bgImage))}
              alt={blog?.data?.title || "Blog image"}
              width={600}
              height={300}
              className="w-full max-w-4xl mx-auto rounded-md"
            />
          </div>
        )}
         <HorizontalBanner />

        {/* Blog Paragraph Part After Image */}
        <div className="blog-content text-white max-w-4xl mx-auto space-y-6 text-justify text-sm md:text-base px-2 md:px-0">
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(blog?.data?.paragraph_three),
            }}
          />
        </div>
         

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-12 mb-8 max-w-4xl mx-auto">
          {/* Previous Button */}
          {prevBlog && (
            <Link 
              href={`/blog/${slugify(prevBlog.title)}-${prevBlog.id}`}
              className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors p-4 w-full sm:w-80"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {prevBlog.image && (
                <Image
                  src={getOptimizedImageUrl(getOriginalImageUrl(prevBlog.image))}
                  alt={prevBlog.title}
                  width={80}
                  height={50}
                  className="rounded object-cover flex-shrink-0"
                />
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-gray-400">Previous</span>
                <span className="text-white text-sm font-medium">{prevBlog.title}</span>
              </div>
            </Link>
          )}

          {/* Next Button */}
          {nextBlog && (
            <Link 
              href={`/blog/${slugify(nextBlog.title)}-${nextBlog.id}`}
              className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors p-4 w-full sm:w-80 sm:ml-auto"
            >
              <div className="flex flex-col text-right min-w-0">
                <span className="text-xs text-gray-400">Next</span>
                <span className="text-white text-sm font-medium">{nextBlog.title}</span>
              </div>
              {nextBlog.image && (
                <Image
                  src={getOptimizedImageUrl(getOriginalImageUrl(nextBlog.image))}
                  alt={nextBlog.title}
                  width={80}
                  height={50}
                  className="rounded object-cover flex-shrink-0"
                />
              )}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          )}
        </div>
        <HorizontalBanner />
          <HorizontalBanner />
      </div>
    </div>
    
  );
};

export default Blogs;
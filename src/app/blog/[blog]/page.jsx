import { getOptimizedImageUrl } from "@/utils/cloudinary";
import { formatDate } from "@/utils/formateDate";
import getData from "@/utils/getData";
import { sanitizeHtml } from "@/utils/sanitizeHtml";
import Image from "next/image";
import React from "react";

export const metadata = {
  title: "Blogs",
  description: "Read our blog",
};

const Blogs = async ({ params }) => {
  const id = params?.blog?.split("-").pop();
  const blog = await getData(`blogs/${id}`);
  console.log(blog);

  const getOriginalImageUrl = (imagePath) => {
    return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
  };

  return (
    <div className="bg-black px-4 py-8 md:px-12 md:py-16">
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
            alt={blog?.title}
            width={1000}
            height={500}
            className="w-full max-w-4xl mx-auto rounded-md"
          />
        </div>

        {/* Blog Description */}
        <div className="text-white max-w-4xl mx-auto text-justify text-sm md:text-base px-2 md:px-0 mb-8">
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(blog?.data?.short_description),
            }}
          />
        </div>

        {/* Blog Paragraphs Part Before Image */}
        <div className="text-white max-w-4xl mx-auto space-y-6 text-justify text-sm md:text-base px-2 md:px-0">
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(blog?.data?.paragraph_one),
            }}
          />
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(blog?.data?.paragraph_two),
            }}
          />
        </div>

        {/* Middle Blog Image */}
        <div className="mb-8">
          <Image
            src={getOptimizedImageUrl(getOriginalImageUrl(blog?.data?.bgImage))}
            alt={blog?.title}
            width={600}
            height={300}
            className="mx-auto rounded-md"
          />
        </div>

        {/* Blog Paragraph Part After Image */}
        <div className="text-white max-w-4xl mx-auto space-y-6 text-justify text-sm md:text-base px-2 md:px-0">
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(blog?.data?.paragraph_three),
            }}
          />
          <div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit at
              libero doloremque itaque quo voluptatibus minus ex magni, fuga
              consectetur est, voluptates nulla explicabo totam dicta vero
              voluptate nostrum modi...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;

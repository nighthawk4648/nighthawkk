import { getOptimizedImageUrl } from "@/utils/cloudinary";
import { formatDate } from "@/utils/formateDate";
import getData from "@/utils/getData";
import { sanitizeHtml } from "@/utils/sanitizeHtml";
import Image from "next/image";
import React from "react";
import { ErrorFallback } from "@/components/Shared/ErrorFallback/ErrorFallback";

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

  const getOriginalImageUrl = (imagePath) => {
    return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
  };

  if (!blog) {
    return <ErrorFallback />
  }

  const contentSections = [
    { key: "short_description", html: blog?.data?.short_description },
    { key: "paragraph_one", html: blog?.data?.paragraph_one },
    { key: "paragraph_two", html: blog?.data?.paragraph_two },
    { key: "paragraph_three", html: blog?.data?.paragraph_three },
    { key: "content", html: blog?.data?.content || blog?.data?.body },
  ].filter((section) => Boolean(section.html));

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
       {/* <HorizontalBanner /> */}

        <div className="text-white max-w-4xl mx-auto px-2 md:px-0">
          {contentSections.map((section) => (
            <div key={section.key} className="blog-content mb-8 text-justify text-sm md:text-base">
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(section.html),
                }}
              />
            </div>
          ))}
        </div>

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
      </div>
    </div>
  );
};

export default Blogs;
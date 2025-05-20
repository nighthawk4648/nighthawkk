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

  const getOriginalImageUrl = (imagePath) => {
    return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
  };

  console.log("blog", blog);

  return (
    <div className="bg-black p-12">
      <div className="">
        <h2 className="text-3xl font-bold mb-4 text-white">Blogs</h2>

        {/* Title and Date */}
        <div className="mb-12 mt-8 flex flex-col w-full">
          <h1 className="text-white text-3xl font-bold mx-auto">
            {blog?.data?.title}
          </h1>
          <p className="text-gray-500 mt-4 mx-auto">
            {formatDate(blog?.data?.created_at)}
          </p>
        </div>

        {/* Cover Image */}
        <Image
          src={getOptimizedImageUrl(getOriginalImageUrl(blog?.data?.image))}
          alt={blog?.title}
          width={500}
          height={500}
          className="mx-auto w-[1000px] rounded-md"
        />

        {/* Blog Description */}
        <p className="text-white mx-24 my-12">
          {blog?.data?.short_description}
        </p>

        <div className="text-white mx-24 my-12 flex flex-col gap-8">
          <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog?.data?.paragraph_one) }}></p>
          <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog?.data?.paragraph_one) }}></p>
          <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog?.data?.paragraph_one) }}></p>
        </div>
      </div>
    </div>
  );
};

export default Blogs;

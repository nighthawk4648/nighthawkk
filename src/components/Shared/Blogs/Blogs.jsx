import { getOptimizedImageUrl } from "@/utils/cloudinary";
import { formatDate } from "@/utils/formateDate";
import { stripHtml } from "@/utils/sanitizeHtml";
import slugify from "@/utils/slugify";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Blogs = ({ blogs }) => {
  if (!blogs || blogs.length === 0) return null;
  const lastBlog = blogs[blogs.length - 1];

  const getOriginalImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
  };

  return (
    // <div className="bg-[url('/assets/bgImage/bgBlack.jpeg')] bg-cover bg-center w-full text-white p-5">
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white p-5 border-b-2 border-gray-500 ">
      <h2 className=" font-semibold text-2xl ">Visit Our Blogs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10 ">
        <div>
          <Link href={`/blog/${slugify(lastBlog?.title)}-${lastBlog?.id}`}>
            {lastBlog?.image ? (
              <Image
                src={getOptimizedImageUrl(getOriginalImageUrl(lastBlog.image))}
                alt={
                  lastBlog?.image_alt?.trim() || lastBlog?.title || "Blog cover"
                }
                width={500}
                height={500}
                className="w-full h-[260px] md:h-[360px] mx-auto object-cover rounded"
              />
            ) : (
              <div className="w-full h-[260px] md:h-[360px] mx-auto bg-zinc-800 rounded flex items-center justify-center text-zinc-400 font-medium">
                {lastBlog?.title || "Blog Article"}
              </div>
            )}
          </Link>
          <div className="flex gap-3 items-center mt-5 text-sm">
            <p className="text-amber-700">{formatDate(lastBlog?.created_at)}</p>
            <p className="rounded-full bg-white w-1 h-1"></p>
            <p>{lastBlog?.name || "SketchShaper"}</p>
          </div>

          <div className="mt-3">
            <h3 className="font-semibold text-lg">{lastBlog?.title}</h3>
            <p className="text-xs mt-3">
              {stripHtml(lastBlog?.short_description, 130)}
              {lastBlog?.short_description && (
                <Link
                  href={`/blog/${slugify(lastBlog?.title)}-${lastBlog?.id}`}
                  className="text-blue-500 hover:text-blue-700 ml-1"
                >
                  Read More
                </Link>
              )}
            </p>
          </div>
        </div>

        <div className="md:max-h-[560px] md:overflow-y-auto">
          {blogs
            ?.slice(-4, -1)
            .reverse()
            .map((blog, idx) => (
              <div key={blog?.id ?? idx} className="md:flex mb-3 gap-4">
                <div className="flex-shrink-0">
                  <Link href={`/blog/${slugify(blog?.title)}-${blog?.id}`}>
                    {blog?.image ? (
                      <Image
                        src={getOptimizedImageUrl(
                          getOriginalImageUrl(blog.image),
                        )}
                        alt={
                          blog?.image_alt?.trim() ||
                          blog?.title ||
                          "Blog thumbnail"
                        }
                        width={500}
                        height={500}
                        className="w-full md:w-[320px] md:h-[150px] h-[260px] object-cover rounded"
                      />
                    ) : (
                      <div className="w-full md:w-[320px] md:h-[150px] h-[260px] bg-zinc-800 rounded flex items-center justify-center text-zinc-400 text-xs">
                        {blog?.title || "Blog"}
                      </div>
                    )}
                  </Link>
                </div>

                <div className="mt-3 md:mt-0">
                  <p className="text-amber-700 text-sm ">
                    {formatDate(blog?.created_at)}
                  </p>
                  <h3 className="font-semibold text-lg">{blog?.title}</h3>
                  <p className="text-xs mt-3">
                    {stripHtml(blog?.short_description, 130)}
                    {blog?.short_description && (
                      <Link
                        href={`/blog/${slugify(blog?.title)}-${blog?.id}`}
                        className="text-blue-500 hover:text-blue-700 ml-1"
                      >
                        Read More
                      </Link>
                    )}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <Link href="/blog">
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200">
            See All Blogs
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Blogs;

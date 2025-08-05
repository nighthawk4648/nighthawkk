import { getOptimizedImageUrl } from "@/utils/cloudinary";
import { formatDate } from "@/utils/formateDate";
import getData from "@/utils/getData";
import { sanitizeHtml } from "@/utils/sanitizeHtml";
import Image from "next/image";
import React from "react";
import Script from "next/script";
import { ErrorFallback } from "@/components/Shared/ErrorFallback/ErrorFallback ";

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

  if (!blog) {
    return <ErrorFallback />
  }

  return (
    <div className="bg-black px-4 py-8 md:px-12 md:py-16">
      {/* Side advertisement - Left */}
      <div className="hidden lg:block fixed left-0 top-1/4 z-10 p-2">
        <div dangerouslySetInnerHTML={{
          __html: `
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5557791257949251" crossorigin="anonymous"></script>
            <!-- vertical for blog -->
            <ins class="adsbygoogle"
                style="display:block"
                data-ad-client="ca-pub-5557791257949251"
                data-ad-slot="9215525322"
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
            <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
          `
        }} />
      </div>

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
          
          {/* Google AdSense Script - In-article */}
          <div className="my-6">
            <div dangerouslySetInnerHTML={{
              __html: `
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5557791257949251" crossorigin="anonymous"></script>
                <ins class="adsbygoogle"
                    style="display:block; text-align:center;"
                    data-ad-layout="in-article"
                    data-ad-format="fluid"
                    data-ad-client="ca-pub-5557791257949251"
                    data-ad-slot="9153921937"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
              `
            }} />
          </div>
          
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
            className="w-full max-w-4xl mx-auto rounded-md"
          />
        </div>
        
        {/* Google AdSense Script - In-article */}
        <div className="my-6">
          <div dangerouslySetInnerHTML={{
            __html: `
              <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5557791257949251" crossorigin="anonymous"></script>
              <ins class="adsbygoogle"
                  style="display:block; text-align:center;"
                  data-ad-layout="in-article"
                  data-ad-format="fluid"
                  data-ad-client="ca-pub-5557791257949251"
                  data-ad-slot="9153921937"></ins>
              <script>
                  (adsbygoogle = window.adsbygoogle || []).push({});
              </script>
            `
          }} />
        </div>

        {/* Blog Paragraph Part After Image */}
        <div className="text-white max-w-4xl mx-auto space-y-6 text-justify text-sm md:text-base px-2 md:px-0">
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(blog?.data?.paragraph_three),
            }}
          />
          <div>
            {/* Google AdSense Script - In-article */}
            <div className="my-6">
              <div dangerouslySetInnerHTML={{
                __html: `
                  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5557791257949251" crossorigin="anonymous"></script>
                  <ins class="adsbygoogle"
                      style="display:block; text-align:center;"
                      data-ad-layout="in-article"
                      data-ad-format="fluid"
                      data-ad-client="ca-pub-5557791257949251"
                      data-ad-slot="9153921937"></ins>
                  <script>
                      (adsbygoogle = window.adsbygoogle || []).push({});
                  </script>
                `
              }} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Side advertisement - Right */}
      <div className="hidden lg:block fixed right-0 top-1/4 z-10 p-2">
        <div dangerouslySetInnerHTML={{
          __html: `
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5557791257949251" crossorigin="anonymous"></script>
            <!-- vertical for blog -->
            <ins class="adsbygoogle"
                style="display:block"
                data-ad-client="ca-pub-5557791257949251"
                data-ad-slot="9215525322"
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
            <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
          `
        }} />
      </div>
    </div>
  );
};

export default Blogs;
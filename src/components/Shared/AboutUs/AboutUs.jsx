import { getOptimizedImageUrl } from "@/utils/cloudinary";
import { sanitizeHtml } from "@/utils/sanitizeHtml";
import Image from "next/image";
import React from "react";

const AboutUs = ({ aboutUs }) => {
  if (!aboutUs) return null;

  const getOriginalImageUrl = (imagePath) => {
    return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE || ""}${imagePath}`;
  };

  const coverUrl = aboutUs?.cover
    ? getOptimizedImageUrl(getOriginalImageUrl(aboutUs.cover))
    : null;

  return (
    <section className="w-full px-4 md:px-[0.5in] py-8 sm:py-20 lg:py-24 border-t border-line text-fg relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Title */}
        {aboutUs?.title && (
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-fg font-sans mb-2.5 sm:mb-6">
            {aboutUs.title}
          </h2>
        )}

        {/* Short Description */}
        {aboutUs?.short_description && (
          <p className="text-xs sm:text-base lg:text-lg text-fg-secondary max-w-2xl mx-auto leading-relaxed mb-5 sm:mb-8 font-sans">
            {aboutUs.short_description}
          </p>
        )}

        {/* Rich HTML Content - Open Editorial Statement */}
        {aboutUs?.content && (
          <div className="mt-5 pt-5 sm:mt-8 sm:pt-8 border-t border-line/60 text-left max-w-3xl mx-auto">
            <div
              className="prose prose-invert max-w-none text-fg-secondary text-xs sm:text-base leading-relaxed prose-headings:text-fg prose-headings:font-sans prose-headings:tracking-tight prose-a:text-action prose-a:underline hover:prose-a:text-action-hover prose-strong:text-fg prose-strong:font-medium"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(aboutUs.content) }}
            />
          </div>
        )}
      </div>

      {/* Subtle Ambient Background Wash if cover exists */}
      {coverUrl && (
        <div className="absolute inset-0 -z-10 opacity-15 pointer-events-none">
          <Image
            src={coverUrl}
            alt={aboutUs?.title || "About SketchShaper"}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/80 to-canvas" />
        </div>
      )}
    </section>
  );
};

export default AboutUs;

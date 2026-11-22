import React from "react";
import Image from "next/image";
import img1 from "../../../public/assets/aboutus/img1.jpg";
import img2 from "../../../public/assets/aboutus/img2.jpg";
import img3 from "../../../public/assets/aboutus/img3.jpg";
import { buildPageMetadata } from "@/utils/seo";
import { JsonLd, generateBreadcrumbSchema } from "@/utils/schema";

export const metadata = buildPageMetadata({
  title: "About Us & Team",
  description:
    "Learn about Sketch shaper, our creative team, and our mission to provide high-quality SketchUp 3D models, textures, and plugins.",
  pathname: "/about-us",
});

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      name: "About Us & Team - Sketch shaper",
      url: "https://www.sketchshaper.com/about-us",
      description:
        "Learn about Sketch shaper, our creative team, and our mission to provide high-quality SketchUp 3D models, textures, and plugins.",
      mainEntity: {
        "@type": "Organization",
        name: "Sketch shaper",
        url: "https://www.sketchshaper.com",
        founder: {
          "@type": "Person",
          name: "Majharul Islam Asik",
          jobTitle: "Founder & Asset Creator",
        },
        employee: [
          {
            "@type": "Person",
            name: "Naimul Islam Shihab",
            jobTitle: "3D Artist",
          },
          {
            "@type": "Person",
            name: "Shafia Zaman Ema",
            jobTitle: "Textures Designer",
          },
        ],
      },
    },
  ],
};

const breadcrumbsSchema = generateBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "About Us", url: "/about-us" },
]);

const panelClass =
  "bg-surface/30 backdrop-blur-2xl rounded-panel border border-white/[0.08] p-6 sm:p-8 shadow-2xl shadow-black/40";

const AboutUs = async () => {
  return (
    <div className="w-full min-h-screen text-fg font-sans py-8 sm:py-12 px-4 md:px-[0.5in]">
      <JsonLd data={aboutPageSchema} />
      <JsonLd data={breadcrumbsSchema} />
      <div className="max-w-4xl mx-auto space-y-8">
        <p className="text-sm sm:text-base text-fg-secondary leading-relaxed">
          Sketch shaper offers a free library of high-quality SketchUp 3D models
          and textures. Our collection includes diverse textures and detailed
          models to enhance your creative projects. Whether you&apos;re an artist,
          designer, or developer, you&apos;ll find the assets you need to bring your
          ideas to life. Explore our library and start creating today!
        </p>

        {/* Team */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              img: img1,
              name: "Majharul Islam Asik",
              designation: "Founder & Asset Creator",
            },
            { img: img2, name: "Naimul Islam Shihab", designation: "3D Artist" },
            {
              img: img3,
              name: "Shafia Zaman Ema",
              designation: "Textures Designer",
            },
            // { img: img4, name: "Md Riaz", designation: "Lead Developer" },
            // { img: img5, name: "Shuvo", designation: "Frontend Developer" } // New team member
          ].map((item) => (
            <div key={item.name} className={`${panelClass} flex flex-col items-center text-center`}>
              <div className="relative w-[150px] h-[150px] rounded-card overflow-hidden border border-white/10">
                <Image
                  src={item.img}
                  alt={item.name}
                  fill
                  sizes="150px"
                  className="object-cover"
                />
              </div>
              <p className="mt-4 text-lg font-semibold text-fg">{item.name}</p>
              <p className="text-xs font-mono text-action mt-1">
                {item.designation}
              </p>
            </div>
          ))}
        </div>

        {/* Vision and contact */}
        <div className="grid grid-cols-1 md:grid-cols-[1.618fr_1fr] gap-4">
          <div className={panelClass}>
            <h3 className="text-xl font-semibold text-fg">Our Vision</h3>
            <p className="text-xs font-mono uppercase tracking-wider text-action mt-1">
              What We Offer
            </p>
            <p className="text-sm text-fg-secondary leading-relaxed mt-4">
              At Sketch shaper, we pride ourselves on the quality and diversity of
              our asset library. Our collection includes:
              <br />
              <br />
              <strong className="text-fg">3D Models:</strong> Explore a rich assortment of
              meticulously crafted 3D models for SketchUp that span various
              categories, including characters, environments, props, and more.
              Each model is designed with precision to ensure it meets the highest
              standards of detail and functionality.
              <br />
              <br />
              <strong className="text-fg">Textures:</strong> Our extensive texture library features a
              broad spectrum of high-resolution textures suitable for different
              applications. Whether you need realistic surface textures, intricate
              patterns, or abstract designs, our textures are ready to enhance the
              visual appeal of your 3D models.
              <br />
              <br />
              <strong className="text-fg">Regular Updates:</strong> We are continually expanding our
              library to include new and exciting assets. Our team of skilled
              designers and artists are dedicated to creating and curating assets
              that reflect current trends and technological advancements, ensuring
              you always have access to the latest resources.
            </p>
          </div>

          <div className={`${panelClass} self-start`}>
            <h3 className="text-xl font-semibold text-fg">Contact</h3>
            <p className="text-sm text-fg-secondary leading-relaxed mt-4">
              Got a question? Please read the Privacy Policy first.
              <br />
              <br />
              The easiest way to get in touch with us is via email:{" "}
              <strong className="text-fg">sketchshaper@gmail.com</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

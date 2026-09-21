import { getOptimizedImageUrl } from "@/utils/cloudinary";
import Image from "next/image";

import React from "react";

const Innovative = ({ innovatives }) => {
  const getOriginalImageUrl = (imagePath) => {
    return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
  };

  return (
    <div className="flex flex-col">
      {innovatives?.map((innovative, index) => (
        <div key={index} className="relative w-full h-[400px] overflow-hidden">
          {/* Background Image */}
          <Image
            src={getOptimizedImageUrl(getOriginalImageUrl(innovative?.bgImg))}
            alt={innovative?.title || "SketchShaper Pro"}
            fill
            className="object-cover"
            priority
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50 z-10" />

          {/* Centered Content */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center text-white px-6">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {innovative?.title || "SketchShaper"}
            </h2>
            <p className="text-sm md:text-lg max-w-2xl mb-6">
              {innovative?.description ||
                "Premium quality 3D models and textures for your projects."}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Innovative;

// import { getOptimizedImageUrl } from '@/utils/cloudinary';
// import Image from 'next/image';
// import Link from 'next/link';
// import React from 'react';
// import { FaCreativeCommonsSamplingPlus } from "react-icons/fa6";

// const Innovative = ({ innovatives }) => {

//     const getOriginalImageUrl = (imagePath) => {
//         return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
//     };

//   return (
//   <div>
//     {innovatives?.map((innovative, index) => (
//       <div key={index} className='relative'>
//         <div className='relative'>
//           <Image
//             src={getOptimizedImageUrl(getOriginalImageUrl(innovative?.bgImg))}
//             height={1600}
//             width={1600}
//             alt={innovative.title}
//             className='w-full h-[200px] md:h-[500px]'
//           />
//         </div>

//         {/* Icon positions */}
//         {[
//           { url: innovative?.urlOne, position: 'absolute right-[180px] top-[150px] md:top-1/2' },
//           { url: innovative?.urlTwo, position: 'absolute right-[100px] md:right-[200px] lg:right-[500px] top-1/2 md:top-3/4' },
//           { url: innovative?.urlThree, position: 'absolute left-[40px] md:left-[100px] lg:left-[130px] top-[60px] md:top-[170px]' },
//           { url: innovative?.urlFour, position: 'absolute left-[100px] md:left-[300px] top-3/4' },
//         ].map((item, i) => (
//           <div key={i} className={item.position}>
//             <Link href={item.url || '/'}>
//               <div className='relative flex items-center'>
//                 <FaCreativeCommonsSamplingPlus className='text-black text-2xl md:text-4xl heartbeat-hover' />
//               </div>
//             </Link>
//           </div>
//         ))}
//       </div>
//     ))}
//   </div>
// );
// };

// export default Innovative;

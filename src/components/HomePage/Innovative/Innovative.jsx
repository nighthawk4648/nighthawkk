import { getOptimizedImageUrl } from '@/utils/cloudinary';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaCreativeCommonsSamplingPlus } from "react-icons/fa6";

const Innovative = ({ innovatives }) => {
   
    const getOriginalImageUrl = (imagePath) => {
        return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
    }; 
   
    return (
  <div>
    {innovatives?.map((innovative, index) => (
      <div key={index} className='relative'>
        <div className='relative'>
          <Image
            src={getOptimizedImageUrl(getOriginalImageUrl(innovative?.bgImg))}
            height={1600}
            width={1600}
            alt={innovative.title}
            className='w-full h-[200px] md:h-[500px]'
          />
        </div>

        {/* Icon positions with tooltip */}
        {[
          { url: innovative?.urlOne, position: 'absolute right-[180px] top-[150px] md:top-1/2' },
          { url: innovative?.urlTwo, position: 'absolute right-[100px] md:right-[200px] lg:right-[500px] top-1/2 md:top-3/4' },
          { url: innovative?.urlThree, position: 'absolute left-[40px] md:left-[100px] lg:left-[130px] top-[60px] md:top-[170px]' },
          { url: innovative?.urlFour, position: 'absolute left-[100px] md:left-[300px] top-3/4' },
        ].map((item, i) => (
          <div key={i} className={item.position + ' group'}>
            <Link href={item.url || '/'}>
              <div className='relative flex items-center'>
                <FaCreativeCommonsSamplingPlus className='text-black text-2xl md:text-4xl heartbeat-hover' />

                {/* Tooltip card on hover */}
                <div className='absolute -top-16 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 whitespace-nowrap'>
                  {item.url ? item.url : 'No link available'}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    ))}
  </div>
);
};

export default Innovative;

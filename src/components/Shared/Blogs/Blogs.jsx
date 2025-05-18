import { getOptimizedImageUrl } from '@/utils/cloudinary';
import { formatDate } from '@/utils/formateDate';
import slugify from '@/utils/slugify';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Blogs = ({ blogs }) => {
    const lastBlog = blogs[blogs.length - 1];

    const getOriginalImageUrl = (imagePath) => {
        return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
    };

    return (
        // <div className="bg-[url('/assets/bgImage/bgBlack.jpeg')] bg-cover bg-center w-full text-white p-5">
        <div className="bg-black text-white p-5 border-b-2 border-gray-500 ">
            <h2 className=' font-semibold text-2xl '>Visit Our Blogs</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-10 '>
                <div>
                    <Link href={`/blog/${slugify(lastBlog?.title)}-${lastBlog?.id}`}>
                        <Image
                            src={getOptimizedImageUrl(getOriginalImageUrl(lastBlog?.image))}
                            alt={lastBlog?.title}
                            width={500}
                            height={500}
                            className='w-full h-[260px] md:h-[360px] mx-auto '
                        />
                    </Link>
                    <div className='flex gap-3 items-center mt-5 text-sm'>
                        <p className='text-amber-700'>{formatDate(lastBlog?.created_at)}</p>
                        <p className='rounded-full bg-white w-1 h-1'></p>
                        <p>{lastBlog?.name}</p>
                    </div>

                    <div className='mt-3'>
                        <h3 className='font-semibold text-lg'>{lastBlog?.title}</h3>
                        <p className='text-xs mt-3'>
                            {lastBlog?.short_description.slice(0, 130)}...
                            {lastBlog?.short_description.length > 130 && (
                                <Link href={`/blog/${slugify(lastBlog?.title)}-${lastBlog?.id}`} className='text-blue-500 hover:text-blue-700 ml-1'>Read More</Link>
                            )}
                        </p>
                    </div>
                </div>

                <div className='md:max-h-[560px] md:overflow-y-auto'>
                    {blogs?.map((blog) => (
                        <div className='md:flex mb-3 gap-4'>
                            <div>
                                <Link href={`/blog/${slugify(blog?.title)}-${blog?.id}`}>
                                    <Image
                                        src={getOptimizedImageUrl(getOriginalImageUrl(blog.image))}
                                        alt={blog?.title}
                                        width={500}
                                        height={500}
                                        className='w-full md:w-[320px] md:h-[150px]   h-[260px]'
                                    /></Link>
                            </div>

                            <div className='mt-3 md:mt-0'>
                                <p className='text-amber-700 text-sm '>{formatDate(blog?.created_at)}</p>
                                <h3 className='font-semibold text-lg'>{blog?.title}</h3>
                                <p className='text-xs mt-3'>
                                    {blog?.short_description.slice(0, 130)}...
                                    {blog?.short_description.length > 130 && (
                                        <Link href={`/blog/${slugify(blog?.title)}-${blog?.id}`} className='text-blue-500 hover:text-blue-700 ml-1'>Read More</Link>
                                    )}
                                </p>

                            </div>
                        </div>
                    ))

                    }

                </div>

            </div>
        </div>
    );
};

export default Blogs;
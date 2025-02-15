import { formatDate } from '@/utils/formateDate';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Blogs = ({ blogs }) => {
    const lastBlog = blogs[blogs.length - 1];
    const text = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus quia error, cumque, magni ab inventore odit voluptatibus amet sint dolor ipsa praesentium accusantium porro perspiciatis dolores sapiente. Non obcaecati rerum ipsa assumenda commodi rem laudantium doloribus quos quod nemo deserunt soluta modi mollitia eos nisi cupiditate a facere, dolorem molestiae magnam eum placeat voluptas expedita? Debitis sit molestiae quae minus doloribus accusantium, eius rem soluta pariatur, ipsa magni praesentium cupiditate error quos adipisci assumenda exercitationem cum cumque saepe quidem facilis. Eaque quasi architecto minima magnam debitis autem officiis cupiditate amet qui? Provident, aut minima. At asperiores, sequi facere amet officia itaque modi quas omnis nesciunt obcaecati in maiores ipsa quis, iure quibusdam nisi, eaque sed labore. Blanditiis veniam excepturi non vero minima ducimus repellendus, optio aspernatur architecto voluptas mollitia reprehenderit ab. Est nostrum deleniti ut dicta illum asperiores alias! Tempore nam quo facilis quibusdam. Natus odit, ipsam ad et aliquam numquam asperiores sint quos dolore molestiae! Maiores, doloribus culpa error explicabo veritatis sint vero magnam facilis quas commodi minus neque omnis sequi perspiciatis, eos suscipit ratione expedita! Ullam architecto quisquam molestiae cupiditate voluptate reiciendis omnis? Pariatur, totam officia ex iure maiores minus quia eius, unde debitis facere minima eveniet tempora deleniti rem similique enim maxime. Corrupti, veritatis accusamus in rem pariatur perferendis sapiente odio nihil aspernatur esse ullam non assumenda sunt maiores, alias officia sint cumque eos, aperiam beatae dolores? Officia facere vitae laboriosam cupiditate, deleniti esse architecto perspiciatis quasi repellendus eos obcaecati impedit omnis ea fuga itaque pariatur officiis sit, ipsam doloribus! Eius beatae nostrum blanditiis tempore. Excepturi eaque, fugit dolorem earum eius, minima recusandae illum culpa provident aliquid, atque dolores itaque aliquam. Repudiandae tempore repellendus rerum obcaecati quasi, velit vel, molestias quis quia, sapiente minus quod! Voluptates provident aliquid praesentium culpa reprehenderit sed voluptatum vitae? Nobis, natus consequatur.'
    return (
        <div className="bg-[url('/assets/bgImage/bgBlack.jpeg')] bg-cover bg-center w-full text-white p-5">
            <h2 className=' font-semibold text-2xl '>Visit Our Blogs</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-10 '>
                <div>
                    <Image
                        src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE + lastBlog.image}
                        alt={lastBlog?.title}
                        width={500}
                        height={500}
                        className='w-full h-[260px] md:h-[360px] mx-auto '
                    />

                    <div className='flex gap-3 items-center mt-5 text-sm'>
                        <p className='text-amber-700'>{formatDate(lastBlog?.created_at)}</p>
                        <p className='rounded-full bg-white w-1 h-1'></p>
                        <p>{lastBlog?.name}</p>
                    </div>

                    <div className='mt-3'>
                        <h3 className='font-semibold text-lg'>{lastBlog?.title}</h3>
                        <p className='text-xs mt-3'>
                            {lastBlog?.short_description.length > 130
                                ? `${lastBlog?.short_description.slice(0, 130)}... `
                                : text
                            }
                            {lastBlog?.short_description.length > 130 && (
                                <Link href={`${lastBlog?.back_link}`} className='text-blue-500 hover:text-blue-700 ml-1'>Read More</Link>
                            )}
                        </p>
                    </div>
                </div>

                <div className='md:max-h-[560px] md:overflow-y-auto'>
                    {blogs?.map((blog) => (
                        <div className='md:flex mb-3 gap-4'>
                            <div>
                                <Image
                                    src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE + blog.image}
                                    alt={blog?.title}
                                    width={500}
                                    height={500}
                                    className='w-full md:w-[320px] md:h-[150px]   h-[260px]'
                                />
                            </div>

                            <div className='mt-3 md:mt-0'>
                                <p className='text-amber-700 text-sm '>{formatDate(blog?.created_at)}</p>
                                <h3 className='font-semibold text-lg'>{blog?.title}</h3>
                                <p className='text-xs mt-3'>
                                    {blog?.short_description.length > 130
                                        ? `${blog?.short_description.slice(0, 130)}... `
                                        : text
                                    }
                                    {blog?.short_description.length > 130 && (
                                        <Link href={`${blog?.back_link}`} className='text-blue-500 hover:text-blue-700 ml-1'>Read More</Link>
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
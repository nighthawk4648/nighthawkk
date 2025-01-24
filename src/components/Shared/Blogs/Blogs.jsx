import Image from 'next/image';
import React from 'react';

const Blogs = () => {
    const text = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus quia error, cumque, magni ab inventore odit voluptatibus amet sint dolor ipsa praesentium accusantium porro perspiciatis dolores sapiente. Non obcaecati rerum ipsa assumenda commodi rem laudantium doloribus quos quod nemo deserunt soluta modi mollitia eos nisi cupiditate a facere, dolorem molestiae magnam eum placeat voluptas expedita? Debitis sit molestiae quae minus doloribus accusantium, eius rem soluta pariatur, ipsa magni praesentium cupiditate error quos adipisci assumenda exercitationem cum cumque saepe quidem facilis. Eaque quasi architecto minima magnam debitis autem officiis cupiditate amet qui? Provident, aut minima. At asperiores, sequi facere amet officia itaque modi quas omnis nesciunt obcaecati in maiores ipsa quis, iure quibusdam nisi, eaque sed labore. Blanditiis veniam excepturi non vero minima ducimus repellendus, optio aspernatur architecto voluptas mollitia reprehenderit ab. Est nostrum deleniti ut dicta illum asperiores alias! Tempore nam quo facilis quibusdam. Natus odit, ipsam ad et aliquam numquam asperiores sint quos dolore molestiae! Maiores, doloribus culpa error explicabo veritatis sint vero magnam facilis quas commodi minus neque omnis sequi perspiciatis, eos suscipit ratione expedita! Ullam architecto quisquam molestiae cupiditate voluptate reiciendis omnis? Pariatur, totam officia ex iure maiores minus quia eius, unde debitis facere minima eveniet tempora deleniti rem similique enim maxime. Corrupti, veritatis accusamus in rem pariatur perferendis sapiente odio nihil aspernatur esse ullam non assumenda sunt maiores, alias officia sint cumque eos, aperiam beatae dolores? Officia facere vitae laboriosam cupiditate, deleniti esse architecto perspiciatis quasi repellendus eos obcaecati impedit omnis ea fuga itaque pariatur officiis sit, ipsam doloribus! Eius beatae nostrum blanditiis tempore. Excepturi eaque, fugit dolorem earum eius, minima recusandae illum culpa provident aliquid, atque dolores itaque aliquam. Repudiandae tempore repellendus rerum obcaecati quasi, velit vel, molestias quis quia, sapiente minus quod! Voluptates provident aliquid praesentium culpa reprehenderit sed voluptatum vitae? Nobis, natus consequatur.'
    return (
        <div className="bg-[url('/assets/bgImage/bgBlack.jpeg')] bg-cover bg-center w-full text-white p-5">
            <h2 className=' font-semibold text-2xl '>Visit Our Blogs</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-10 '>
                <div>
                    <Image
                        src={'/assets/blog/blogOne.webp'}
                        alt="Prime"
                        width={500}
                        height={500}
                        className='w-full h-[260px] md:h-[360px] mx-auto '
                    />

                    <div className='flex gap-3 items-center mt-5 text-sm'>
                        <p className='text-amber-700'>May 27 2025</p>
                        <p className='rounded-full bg-white w-1 h-1'></p>
                        <p>By Designer</p>
                    </div>

                    <div className='mt-3'>
                        <h3 className='font-semibold text-lg'>Title of the Blog</h3>
                        <p className='text-xs mt-3'>
                            {text.length > 130
                                ? `${text.slice(0, 130)}... `
                                : text
                            }
                            {text.length > 130 && (
                                <a href='#' className='text-blue-500 hover:text-blue-700 ml-1'>Read More</a>
                            )}
                        </p>
                    </div>
                </div>

                <div className='md:max-h-[560px] md:overflow-y-auto'>
                    <div className='md:flex mb-3 gap-4'>
                       <div>
                       <Image
                           src='https://media.licdn.com/dms/image/D5612AQFwj-DSqSIfng/article-cover_image-shrink_720_1280/0/1704689160446?e=2147483647&v=beta&t=lAFPUjA6eKyvKM4nxWFE1-NlYwNwuVH-V8fvd6nDC4I'
                            alt="Prime"
                            width={500}
                            height={500}
                            className='w-full md:w-[320px] md:h-[150px]   h-[260px]'
                        />
                       </div>

                        <div className='mt-3 md:mt-0'>
                            <p className='text-amber-700 text-sm '>May 27 2025</p>
                            <h3 className='font-semibold text-lg'>Title of the Blog</h3>
                            <p className='text-xs mt-3'>
                                {text.length > 130
                                    ? `${text.slice(0, 130)}... `
                                    : text
                                }
                                {text.length > 130 && (
                                    <a href='#' className='text-blue-500 hover:text-blue-700 ml-1'>Read More</a>
                                )}
                            </p>

                        </div>
                    </div>

                    <div className='md:flex mb-3 gap-4'>
                        <Image
                            src={'/assets/blog/blogOne.webp'}
                            alt="Prime"
                            width={500}
                            height={500}
                            className='w-full md:w-[320px] md:h-[150px]   h-[260px]'
                        />

                        <div className='mt-3 md:mt-0'>
                            <p className='text-amber-700 text-sm '>May 27 2025</p>
                            <h3 className='font-semibold text-lg'>Title of the Blog</h3>
                            <p className='text-xs mt-3'>
                                {text.length > 130
                                    ? `${text.slice(0, 130)}... `
                                    : text
                                }
                                {text.length > 130 && (
                                    <a href='#' className='text-blue-500 hover:text-blue-700 ml-1'>Read More</a>
                                )}
                            </p>

                        </div>
                    </div>

                    <div className='md:flex mb-3 gap-4'>
                        <Image
                            src='https://media.licdn.com/dms/image/D5612AQFwj-DSqSIfng/article-cover_image-shrink_720_1280/0/1704689160446?e=2147483647&v=beta&t=lAFPUjA6eKyvKM4nxWFE1-NlYwNwuVH-V8fvd6nDC4I'
                            alt="Prime"
                            width={500}
                            height={500}
                            className='w-full md:w-[320px] md:h-[150px]   h-[260px]'
                        />

                        <div className='mt-3 md:mt-0'>
                            <p className='text-amber-700 text-sm'>May 27 2025</p>
                            <h3 className='font-semibold text-lg'>Title of the Blog</h3>
                            <p className='text-xs mt-3'>
                                {text.length > 130
                                    ? `${text.slice(0, 130)}... `
                                    : text
                                }
                                {text.length > 130 && (
                                    <a href='#' className='text-blue-500 hover:text-blue-700 ml-1'>Read More</a>
                                )}
                            </p>

                        </div>
                    </div>

                    <div className='md:flex mb-3 gap-4'>
                        <Image
                            src={'/assets/blog/blogOne.webp'}
                            alt="Prime"
                            width={500}
                            height={500}
                            className='w-full md:w-[320px] md:h-[150px]   h-[260px]'
                        />

                        <div className='mt-3 md:mt-0'>
                            <p className='text-amber-700 text-sm'>May 27 2025</p>
                            <h3 className='font-semibold text-lg'>Title of the Blog</h3>
                            <p className='text-xs mt-3'>
                                {text.length > 130
                                    ? `${text.slice(0, 130)}... `
                                    : text
                                }
                                {text.length > 130 && (
                                    <a href='#' className='text-blue-500 hover:text-blue-700 ml-1'>Read More</a>
                                )}
                            </p>

                        </div>
                    </div>

                    <div className='md:flex mb-3 gap-4'>
                        <Image
                            src='https://media.licdn.com/dms/image/D5612AQFwj-DSqSIfng/article-cover_image-shrink_720_1280/0/1704689160446?e=2147483647&v=beta&t=lAFPUjA6eKyvKM4nxWFE1-NlYwNwuVH-V8fvd6nDC4I'
                            alt="Prime"
                            width={500}
                            height={500}
                            className='w-full md:w-[320px] md:h-[150px]   h-[260px]'
                        />

                        <div className='mt-3 md:mt-0'>
                            <p className='text-amber-700 text-sm'>May 27 2025</p>
                            <h3 className='font-semibold text-lg'>Title of the Blog</h3>
                            <p className='text-xs mt-3'>
                                {text.length > 130
                                    ? `${text.slice(0, 130)}... `
                                    : text
                                }
                                {text.length > 130 && (
                                    <a href='#' className='text-blue-500 hover:text-blue-700 ml-1'>Read More</a>
                                )}
                            </p>

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Blogs;
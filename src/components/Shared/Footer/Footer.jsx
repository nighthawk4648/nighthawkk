import slugify from '@/utils/slugify';
import Link from 'next/link';
import React from 'react';
import { FaSquarePhone } from 'react-icons/fa6';
import { IoLogoWhatsapp } from 'react-icons/io5';
import { MdEmail, MdLocalPhone } from 'react-icons/md';

const Footer = ({ categories, footerPages, socials }) => {
    console.log("socials", socials);
    return (
        <div className='bg-secondary px-5 '>
            <div className='md:block hidden'>
                <div className='grid md:grid-cols-3 grid-cols-1 text-white container py-5 md:gap-0 gap-5'>
                    <div className='flex md:justify-start justify-center'>
                        <div>
                            <h2 className='font-semibold'> Assets</h2>
                            <div className='text-xs mt-2'>
                                {categories?.map((category) => (
                                    <Link href={`/${slugify(category?.name)}-${category?.id}`} >
                                        <p className='mb-1' key={category?.id}>{category?.name}</p>
                                    </Link>

                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-center'>
                        <div className=''>
                            <h2 className='font-semibold'> Company</h2>
                            <div className='text-xs mt-2'>
                                {
                                    footerPages?.map((footerPage) => (
                                        <div key={footerPage?.id}>
                                            {footerPage?.slug && <Link href={`/pages/${footerPage?.slug}-${footerPage?.id}`} ><p className='mb-1'>{footerPage?.title}</p></Link>}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>


                    <div className='flex md:justify-end justify-center'>
                        <div className=''>
                            <h2 className='font-semibold'> Social</h2>
                            <div className='text-xs mt-2'>

                                {socials?.map((social) => (
                                    <div key={social?.id}>
                                        {social?.url && <Link href={social?.url} ><p className='mb-1'>{social?.name}</p></Link>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className='md:hidden'>
                <div className=' text-white container py-5 md:gap-0 gap-5'>
                    <div className='flex justify-between'>

                        <div>
                            <h2 className='font-semibold'> Assets</h2>
                            <div className='text-xs mt-2'>
                                {categories?.map((category) => (
                                    <Link href={`/${slugify(category?.name)}-${category?.id}`} >
                                        <p className='mb-1' key={category?.id}>{category?.name}</p>
                                    </Link>

                                ))}
                            </div>
                        </div>



                        <div className=''>
                            <h2 className='font-semibold'> Company</h2>
                            <div className='text-xs mt-2'>
                                {
                                    footerPages?.map((footerPage) => (
                                        <div key={footerPage?.id}>
                                            {footerPage?.slug && <Link href={`/pages/${footerPage?.slug}-${footerPage?.id}`} ><p className='mb-1'>{footerPage?.title}</p></Link>}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                    </div>


                    <div className='flex  justify-center mt-10'>
                        <div className=''>
                            <h2 className='font-semibold'> Social</h2>
                            <div className='text-xs mt-2'>
                                {socials?.map((social) => (
                                    <div key={social?.id}>
                                        {social?.url && <Link href={social?.url} ><p className='mb-1'>{social?.name}</p></Link>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Footer;
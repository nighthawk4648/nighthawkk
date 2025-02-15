import slugify from '@/utils/slugify';
import Link from 'next/link';
import React from 'react';
import { FaSquarePhone } from 'react-icons/fa6';
import { IoLogoWhatsapp } from 'react-icons/io5';
import { MdEmail, MdLocalPhone } from 'react-icons/md';

const Footer = ({ categories, footerPages, socials }) => {
    return (
        <div className='bg-secondary px-5 '>
            <div className='md:block hidden'>
                <div className='grid md:grid-cols-3 grid-cols-1 text-white container py-5 md:gap-0 gap-5'>
                    <div className='flex md:justify-start justify-center'>
                        <div>
                            <p className='font-semibold'> Assets</p>
                            <div className='text-sm mt-2'>
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
                            <p className='font-semibold'> Company</p>
                            <div className='text-sm mt-2'>
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
                            <p className='font-semibold'> Social</p>
                            <div className='text-sm mt-2'>

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
                            <h4 className='font-semibold'> Assets</h4>
                            <div className='text-xs mt-2'>
                                {categories?.map((category) => (
                                    <Link href={`/${slugify(category?.name)}-${category?.id}`} >
                                        <p className='mb-1' key={category?.id}>{category?.name}</p>
                                    </Link>

                                ))}
                            </div>
                        </div>



                        <div className=''>
                            <h4 className='font-semibold'> Company</h4>
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


                    <div className='flex  justify-start '>
                        <div className=''>
                            <h4 className='font-semibold'> Social</h4>
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

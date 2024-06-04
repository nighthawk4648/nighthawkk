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
                            <h1 className='font-semibold'> Assets</h1>
                            <div className='text-xs mt-2'>
                                {categories?.map((category) => (
                                    <p className='mb-1' key={category?._id}>{category?.name}</p>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-center'>
                        <div className=''>
                            <h1 className='font-semibold'> Company</h1>
                            <div className='text-xs mt-2'>
                                {
                                    footerPages?.map((footerPage) => (
                                        <div key={footerPage?._id}>
                                            {footerPage?.slug && <Link href={`/pages/${footerPage?.slug}`} ><p className='mb-1'>{footerPage?.title}</p></Link>}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>


                    <div className='flex md:justify-end justify-center'>
                        <div className=''>
                            <h1 className='font-semibold'> Social</h1>
                            <div className='text-xs mt-2'>

                                {socials?.map((social) => (
                                    <div key={social?._id}>
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
                            <h1 className='font-semibold'> Assets</h1>
                            <div className='text-xs mt-2'>
                                {categories?.map((category) => (
                                    <p className='mb-1' key={category?._id}>{category?.name}</p>
                                ))}
                            </div>
                        </div>



                        <div className=''>
                            <h1 className='font-semibold'> Company</h1>
                            <div className='text-xs mt-2'>
                                {
                                    footerPages?.map((footerPage) => (
                                        <div key={footerPage?._id}>
                                            {footerPage?.slug && <Link href={`/pages/${footerPage?.slug}`} ><p className='mb-1'>{footerPage?.title}</p></Link>}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                    </div>


                    <div className='flex  justify-center mt-10'>
                        <div className=''>
                            <h1 className='font-semibold'> Social</h1>
                            <div className='text-xs mt-2'>
                                {socials?.map((social) => (
                                    <div key={social?._id}>
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
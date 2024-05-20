import React from 'react';
import { FaSquarePhone } from 'react-icons/fa6';
import { IoLogoWhatsapp } from 'react-icons/io5';
import { MdEmail, MdLocalPhone } from 'react-icons/md';

const Footer = () => {
    return (
        <div className='bg-secondary px-5 '>
            <div className='grid md:grid-cols-3 grid-cols-1 text-white container py-5 md:gap-0 gap-5'>
                <div className='flex md:justify-start justify-center'>
                    <div>
                        <h1 className='font-semibold'> Assets</h1>
                        <div className='text-xs mt-2'>
                            <p className='mb-1'>Model</p>
                            <p className='mb-1'>Textures</p>
                            <p className='mb-1'>Interior Design</p>
                        </div>
                    </div>
                </div>

                <div className='flex justify-center'>
                    <div className=''>
                        <h1 className='font-semibold'> Company</h1>
                        <div className='text-xs mt-2'>
                            <p className='mb-1'>About Us</p>
                            <p className='mb-1'>Contact Us</p>
                        </div>
                    </div>
                </div>


                <div className='flex md:justify-end justify-center'>
                    <div className=''>
                        <h1 className='font-semibold'> Social</h1>
                        <div className='text-xs mt-2'>
                            <p className='mb-1'>Facebook </p>
                            <p className='mb-1'>Twitter</p>
                            <p className='mb-1'>Instagram </p>
                            <p className='mb-1'>Linkedin</p>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Footer;
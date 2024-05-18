import React from 'react';
import { FaSquarePhone } from 'react-icons/fa6';
import { IoLogoWhatsapp } from 'react-icons/io5';
import { MdEmail, MdLocalPhone } from 'react-icons/md';

const Footer = () => {
    return (
        <div className='bg-secondary  '>
            <div className='grid md:grid-cols-3 grid-cols-1 text-white container py-5'>
                <div>
                    <h1 className='font-semibold'> Service</h1>
                    <div className='text-xs mt-2'>
                        <p className='mb-1'>Branding</p>
                        <p className='mb-1'>Design</p>
                        <p className='mb-1'>Marketing</p>
                        <p className='mb-1'>Advertisement</p>
                    </div>
                </div>

                <div className='flex justify-center'>
                    <div className=''>
                        <h1 className='font-semibold'> Company</h1>
                        <div className='text-xs mt-2'>
                            <p className='mb-1'>Branding</p>
                            <p className='mb-1'>Design</p>
                            <p className='mb-1'>Marketing</p>
                            <p className='mb-1'>Advertisement</p>
                        </div>
                    </div>
                </div>


                <div className='flex justify-end'>
                    <div className=''>
                        <h1 className='font-semibold'> Social</h1>
                        <div className=' flex gap-3 mt-2'>
                            <IoLogoWhatsapp className='bg-white text-black rounded-full text-2xl' />
                            <FaSquarePhone className=' text-white  text-2xl' />
                            <MdEmail className=' text-white  text-2xl' />

                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Footer;
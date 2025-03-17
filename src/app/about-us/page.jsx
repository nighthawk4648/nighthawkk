import getData from '@/utils/getData';
import React from 'react';
import Image from 'next/image';
import img1 from '../../../public/assets/aboutus/img1.jpg';
import img2 from '../../../public/assets/aboutus/img2.jpg';
import img3 from '../../../public/assets/aboutus/img3.jpg';
import img4 from '../../../public/assets/aboutus/img4.jpg';
import img5 from '../../../public/assets/aboutus/img5.jpg'; // Added a fifth image

export const metadata = {
    title: 'About/Connect',
    description: '',
};

const AboutUs = async () => {
    return (
        <div className="bg-[#141414] text-white p-4 flex flex-col items-center">
            <p className="text-l font-light text-center max-w-4xl">
            Sketch Shaper offers a free library of high-quality SketchUp 3D models and textures. Our collection includes diverse textures and detailed models to enhance your creative projects. Whether you're an artist, designer, or developer, you'll find the assets you need to bring your ideas to life. Explore our library and start creating today!
            </p>

            {/* Images Section */}
            <div className="mt-6 flex justify-center gap-6 flex-wrap">
                {[
                    { img: img1, name: "Majharul Islam Asik", designation: "Founder & Asset Creator" }, 
                    { img: img2, name: "Naimul Islam Shihab", designation: "3D Artist" }, 
                    { img: img3, name: "Shafia Zaman Ema", designation: "Textures Designer" }, 
                    { img: img4, name: "Md Riaz", designation: "Lead Developer" },
                    { img: img5, name: "Shuvo", designation: "jr Developer" } // New team member
                ].map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div className="relative w-[150px] h-[150px]">
                            <Image src={item.img} alt={item.name} layout="fill" className="rounded-lg object-cover" />
                        </div>
                        <p className="mt-2 text-lg font-semibold text-center">{item.name}</p>
                        <p className="text-sm text-gray-300 text-center">{item.designation}</p>
                    </div>
                ))}
            </div>

            {/* Text Boxes Section */}
            <div className="mt-8 flex flex-wrap justify-center gap-6">
                <div className="bg-gray-800 p-4 rounded-lg max-w-md text-center shadow-lg">
                    <h3 className="text-xl font-semibold">Our Vision</h3>
                    <p className="text-sm text-gray-300 mt-2">
                        What We Offer
                        <br /><br />
                        At Sketch Shaper, we pride ourselves on the quality and diversity of our asset library. Our collection includes:
                        <br /><br />
                        <strong>3D Models:</strong> Explore a rich assortment of meticulously crafted 3D models for SketchUp that span various categories, including characters, environments, props, and more. Each model is designed with precision to ensure it meets the highest standards of detail and functionality.
                        <br /><br />
                        <strong>Textures:</strong> Our extensive texture library features a broad spectrum of high-resolution textures suitable for different applications. Whether you need realistic surface textures, intricate patterns, or abstract designs, our textures are ready to enhance the visual appeal of your 3D models.
                        <br /><br />
                        <strong>Regular Updates:</strong> We are continually expanding our library to include new and exciting assets. Our team of skilled designers and artists are dedicated to creating and curating assets that reflect current trends and technological advancements, ensuring you always have access to the latest resources.
                    </p>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg max-w-md text-center shadow-lg">
                    <h3 className="text-xl font-semibold">Contact</h3>
                    <p className="text-sm text-gray-300 mt-2">
                        Got a question? Please read the Privacy Policy first. 
                        <br /><br />
                        The easiest way to get in touch with us is via email: <strong>sketchshaper@gmail.com</strong>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;

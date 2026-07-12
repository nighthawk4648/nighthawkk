import slugify from '@/utils/slugify';
import Link from 'next/link';
import React from 'react';

const Footer = ({ categories, footerPages, socials }) => {
    // SVG Icons
    const icons = {
        facebook: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
        ),
        twitter: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
        ),
        instagram: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM15.156 7.987c.46 0 .833.372.833.833 0 .46-.372.833-.833.833-.46 0-.833-.372-.833-.833 0-.46.372-.833.833-.833zM12.017 9.15c1.566 0 2.837 1.27 2.837 2.837s-1.271 2.837-2.837 2.837-2.837-1.271-2.837-2.837 1.271-2.837 2.837-2.837zm6.624 7.781c0 .926-.751 1.677-1.677 1.677H7.036c-.926 0-1.677-.751-1.677-1.677V7.036c0-.926.751-1.677 1.677-1.677h9.928c.926 0 1.677.751 1.677 1.677v9.895z"/>
            </svg>
        ),
        linkedin: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
        ),
        youtube: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
        ),
      
        email: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z"/>
            </svg>
        ),
        phone: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
        ),
        location: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
        ),
        patreon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.386.524c-4.764 0-8.64 3.876-8.64 8.64 0 4.75 3.876 8.613 8.64 8.613 4.75 0 8.614-3.864 8.614-8.613C24 4.4 20.136.524 15.386.524M.003 23.537h4.22V.524H.003"/>
            </svg>
        ),

        tiktok: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21,7H20a4,4,0,0,1-4-4H12V14.5a2.5,2.5,0,1,1-4-2V8.18a6.5,6.5,0,1,0,8,6.32V9.92A8,8,0,0,0,20,11h1Z"/>
            </svg>
        )

    };

    // Get social icon based on name
    const getSocialIcon = (name) => {
        const normalizedName = name?.toLowerCase().replace(/\s+/g, '');
        return icons[normalizedName] || icons.email;
    };

    return (
        <footer className="bg-gradient-to-br from-gray-900 to-black text-white">
            {/* Main Footer Content */}
            <div className="container mx-auto px-6 py-16">
                {/* Desktop Layout */}
                <div className="hidden md:block">
                    <div className="grid md:grid-cols-4 gap-12">
                        {/* Company Info */}
                        <div className="col-span-1">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
                                Sketchshaper
                            </h3>
                            <p className="text-gray-300 mb-6 leading-relaxed">
                               sketch shaper Is a library of 1000+ textures and 3d sketchup assets crafted by experts.
                            </p>
                            
                            {/* Social Media Icons */}
                            <div className="flex space-x-4">
                                {socials?.map((social) => {
                                    if (!social?.url) return null;
                                    return (
                                        <Link 
                                            key={social?.id}
                                            href={social?.url}
                                            className="group relative"
                                        >
                                            <div className="bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25">
                                                <div className="text-gray-300 group-hover:text-white transition-colors duration-300">
                                                    {getSocialIcon(social?.name)}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Assets */}
                        <div>
                            <h4 className="text-lg font-semibold mb-6 relative">
                                Assets
                                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                            </h4>
                            <div className="space-y-3">
                                {categories?.map((category) => (
                                    <Link 
                                        key={category?.id}
                                        href={`/${slugify(category?.name)}-${category?.id}`}
                                        className="block text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300"
                                    >
                                        {category?.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="text-lg font-semibold mb-6 relative">
                                Company
                                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                            </h4>
                            <div className="space-y-3">
                                {footerPages?.map((footerPage) => {
                                    if (!footerPage?.slug) return null;

                                    const customRoutes = {
                                        "about-us": "/about-us",
                                        "license": "/license",
                                        "privacy": "/privacy",
                                        "terms-and-conditions": "/terms-and-conditions",
                                        "blogs": "/blogs",
                                    };

                                    const href = customRoutes[footerPage.slug] || `/pages/${footerPage.slug}-${footerPage.id}`;

                                    return (
                                        <Link
                                            key={footerPage.id}
                                            href={href}
                                            className="block text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300"
                                        >
                                            {footerPage.title}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="text-lg font-semibold mb-6 relative">
                                Contact
                                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 text-gray-300">
                                    <div className="text-blue-400">
                                        {icons.email}
                                    </div>
                                    <span>sketchshaper@gmail.com</span>
                                </div>
                                {/* <div className="flex items-center space-x-3 text-gray-300">
                                    <div className="text-blue-400">
                                        {icons.phone}
                                    </div>
                                    <span></span>
                                </div> */}
                                <div className="flex items-center space-x-3 text-gray-300">
                                    <div className="text-blue-400">
                                        {icons.location}
                                    </div>
                                    <span>Dhaka, Bangladesh</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden">
                    {/* Brand and Social */}
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
                            Sketchshaper
                        </h3>
                        <p className="text-gray-300 mb-6">
                           sketch shaper Is a library of 1000+ textures and 3d sketchup assets crafted by experts.
                        </p>
                        
                        {/* Social Media Icons */}
                        <div className="flex justify-center space-x-4 mb-8">
                            {socials?.map((social) => {
                                if (!social?.url) return null;
                                return (
                                    <Link 
                                        key={social?.id}
                                        href={social?.url}
                                        className="group"
                                    >
                                        <div className="bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 p-3 rounded-full transition-all duration-300 transform hover:scale-110">
                                            <div className="text-gray-300 group-hover:text-white transition-colors duration-300">
                                                {getSocialIcon(social?.name)}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="grid grid-cols-2 gap-8">
                        {/* Assets */}
                        <div>
                            <h4 className="text-lg font-semibold mb-4 relative">
                                Assets
                                <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                            </h4>
                            <div className="space-y-2">
                                {categories?.map((category) => (
                                    <Link 
                                        key={category?.id}
                                        href={`/${slugify(category?.name)}-${category?.id}`}
                                        className="block text-sm text-gray-300 hover:text-white transition-colors duration-300"
                                    >
                                        {category?.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="text-lg font-semibold mb-4 relative">
                                Company
                                <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                            </h4>
                            <div className="space-y-2">
                                {footerPages?.map((footerPage) => {
                                    if (!footerPage?.slug) return null;

                                    const customRoutes = {
                                        "about-us": "/about-us",
                                        "license": "/license",
                                        "privacy": "/privacy",
                                        "terms-and-conditions": "/terms-and-conditions",
                                        "blogs": "/blogs",
                                    };

                                    const href = customRoutes[footerPage.slug] || `/pages/${footerPage.slug}-${footerPage.id}`;

                                    return (
                                        <Link
                                            key={footerPage.id}
                                            href={href}
                                            className="block text-sm text-gray-300 hover:text-white transition-colors duration-300"
                                        >
                                            {footerPage.title}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} Sketchshaper. All rights reserved.
                        </div>
                        <div className="flex space-x-6 text-sm">
                            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">
                                Privacy Policy
                            </Link>
                            <Link href="/terms-and-conditions" className="text-gray-400 hover:text-white transition-colors duration-300">
                                Terms of Service
                            </Link>
                           
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
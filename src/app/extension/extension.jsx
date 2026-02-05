"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import useSWR from 'swr';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const fetcher = (url) => fetch(url).then((res) => res.json());

const ExtensionPage = () => {
    const [isDownloading, setIsDownloading] = useState(false);
    const { data: downloadData, mutate: mutateDownloadData } = useSWR(
        `${API_BASE_URL}/extension-downloads/MyExtension`,
        fetcher,
        { revalidateOnFocus: false }
    );

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/extension-downloads/increment`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ extensionName: "MyExtension" }),
                }
            );

            if (!response.ok) throw new Error("Failed to increment download count");

            await mutateDownloadData();

            const link = document.createElement("a");
            link.href = "/assets/rbz/sketchshaper(version 1.1.0).rbz";
            link.download = "sketchshaper(version 1.1.0).rbz";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error incrementing download count:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            {/* Hero Section */}
            <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
                    <div className="absolute top-40 right-20 w-96 h-96 bg-purple-600/15 rounded-full mix-blend-multiply filter blur-xl opacity-35 animate-pulse animation-delay-2000"></div>
                    <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-cyan-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
                </div>
                
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-grid-white/8 bg-grid-16"></div>
                
                {/* Content */}
                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl mb-6 shadow-2xl border border-white/10">
                            <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                        SketchShaper
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-gray-300 font-light">
                        A Free SketchUp 3D Library Extension
                    </p>
                    <p className="text-lg mb-12 text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Access thousands of high-quality 3D models, textures, and assets directly inside SketchUp. 
                        Transform your workflow with our comprehensive free library.
                    </p>
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
                    >
                        {isDownloading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Downloading...
                            </span>
                        ) : (
                            "Download Free Extension"
                        )}
                    </button>
                    <p className="mt-4 text-sm text-gray-400">
                        Version 1.1.0 • Compatible with SketchUp 2022-2025
                    </p>
                    <p className="mt-2 font-bold text-gray-200">Downloaded: <span className="text-cyan-400">{downloadData?.data?.count || 0}</span> times</p>
                </div>
            </div>

            {/* Video Section */}
            <div className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                        See SketchShaper in Action
                    </h2>
                    <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/vo-nsPWgrkg"
                            title="SketchShaper"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* Features Gallery */}
            <div className="py-20 px-4 bg-slate-900/50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                        Powerful Features
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-slate-800/70 transition-all duration-300 transform hover:scale-105 hover:border-blue-500/30">
                            <div className="aspect-[16/9]">
                                <Image
                                    src="https://res.cloudinary.com/dn0rgr930/image/upload/v1770007276/v1_wdzv0h.jpg"
                                    alt="3D Models Library"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-slate-800/70 transition-all duration-300 transform hover:scale-105 hover:border-purple-500/30">
                            <div className="aspect-[16/9]">
                                <Image
                                    src="https://res.cloudinary.com/dn0rgr930/image/upload/v1770007276/v3_lr5lhu.jpg"
                                    alt="High-Quality Textures"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-slate-800/70 transition-all duration-300 transform hover:scale-105 hover:border-cyan-500/30">
                            <div className="aspect-[16/9]">
                                <Image
                                    src="https://res.cloudinary.com/dn0rgr930/image/upload/v1770007276/v2_p1o2z1.jpg"
                                    alt="Easy Integration"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        {/* <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-slate-800/70 transition-all duration-300 transform hover:scale-105 hover:border-green-500/30">
                            <div className="aspect-[16/9]">
                                <Image
                                    src="https://placehold.co/400x225/1e293b/FFFFFF?text=Realistic+Materials"
                                    alt="Realistic Materials"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-slate-800/70 transition-all duration-300 transform hover:scale-105 hover:border-orange-500/30">
                            <div className="aspect-[16/9]">
                                <Image
                                    src="https://placehold.co/400x225/1e293b/FFFFFF?text=Professional+Assets"
                                    alt="Professional Assets"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-slate-800/70 transition-all duration-300 transform hover:scale-105 hover:border-pink-500/30">
                            <div className="aspect-[16/9]">
                                <Image
                                    src="https://placehold.co/400x225/1e293b/FFFFFF?text=Fast+Workflow"
                                    alt="Fast Workflow"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                        Start Creating Today
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Join thousands of designers who trust SketchShaper for their 3D asset needs.
                    </p>
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
                    >
                        {isDownloading ? "Downloading..." : "Download Now - It's Free!"}
                    </button>
                    <p className="mt-4 font-bold text-white">Downloaded: <span className="text-yellow-400">{downloadData?.data?.count || 0}</span> times</p>
                    <div className="mt-8 flex justify-center gap-8 text-sm text-gray-400">
                        <span>✓ Free Forever</span>
                        <span>✓ No Registration Required</span>
                        <span>✓ Regular Updates</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExtensionPage;

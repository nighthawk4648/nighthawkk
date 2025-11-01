'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePatreonAuth } from '@/contexts/PatreonAuthContext';

const Page = ({ params }) => {

    const { assetName } = params;
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user, isAuthenticated, login, loading: authLoading, verifyPatronStatus } = usePatreonAuth();
    const [isPatron, setIsPatron] = useState(false);
    const [checkingPatron, setCheckingPatron] = useState(false);

    const assets = [
        {
            id: "asset_001",
            image: "https://placehold.co/300x200?text=Mountain",
            name: "Misty Mountain",
            date: "2025-10-25",
            size: { width: 300, height: 200 },
            downloadUrl: "https://example.com/download/mountain.zip"
        },
        {
            id: "asset_002",
            image: "https://placehold.co/300x200?text=Forest",
            name: "Emerald Forest",
            date: "2025-10-25",
            size: { width: 300, height: 200 },
            downloadUrl: "https://example.com/download/forest.zip"
        },
        {
            id: "asset_003",
            image: "https://placehold.co/300x200?text=Beach",
            name: "Golden Beach",
            date: "2025-10-25",
            size: { width: 300, height: 200 },
            downloadUrl: "https://example.com/download/beach.zip"
        },
        {
            id: "asset_004",
            image: "https://placehold.co/300x200?text=Cityscape",
            name: "Night City",
            date: "2025-10-25",
            size: { width: 300, height: 200 },
            downloadUrl: "https://example.com/download/city.zip"
        }
    ];

    useEffect(() => {
        // Check patron status when user is authenticated
        if (isAuthenticated && user) {
            checkPatronStatus();
        }
    }, [isAuthenticated, user]);

    const checkPatronStatus = async () => {
        setCheckingPatron(true);
        try {
            const status = await verifyPatronStatus();
            setIsPatron(status);
        } catch (error) {
            console.error('Error checking patron status:', error);
            setIsPatron(false);
        } finally {
            setCheckingPatron(false);
        }
    };

    const handleAccessClick = async (asset) => {
        // If not authenticated, show login modal
        if (!isAuthenticated) {
            setShowModal(true);
            return;
        }

        // If authenticated, verify patron status and download
        setIsLoading(true);
        try {
            const patronStatus = await verifyPatronStatus();
            
            if (patronStatus) {
                // User is an active patron, proceed with download
                handleDownload(asset);
            } else {
                // User is not an active patron, show subscription modal
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error verifying patron status:', error);
            alert('Failed to verify your patron status. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = (asset) => {
        // Implement actual download logic here
        // For now, just open the download URL
        console.log('Downloading asset:', asset.name);
        // window.open(asset.downloadUrl, '_blank');
        alert(`Download started for ${asset.name}! (This is a demo)`);
    };

    const handlePatreonLogin = async () => {
        setIsLoading(true);
        try {
            await login();
        } catch (error) {
            console.error('Login error:', error);
            setIsLoading(false);
        }
    };


    return (
        <div className='mx-[20px] min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-8'>
            {/* Patron Status Banner */}
            {isAuthenticated && (
                <div className={`mb-6 p-4 rounded-lg border ${isPatron ? 'bg-green-900/20 border-green-500' : 'bg-yellow-900/20 border-yellow-500'}`}>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='font-semibold'>
                                {checkingPatron ? (
                                    'Checking patron status...'
                                ) : isPatron ? (
                                    <>✓ Active Patron - {user?.full_name || user?.email}</>
                                ) : (
                                    <>⚠️ Logged in as {user?.email} - Patron subscription required</>
                                )}
                            </p>
                            {isPatron && user?.membership_tier && (
                                <p className='text-sm text-gray-300 mt-1 capitalize'>
                                    {user.membership_tier} Tier Member
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {!isAuthenticated && (
                <div className='mb-6 p-4 rounded-lg bg-blue-900/20 border border-blue-500'>
                    <p className='text-center'>
                        🔒 <strong>Patreon Members Only</strong> - Please login to access premium content
                    </p>
                </div>
            )}

            <h2 className='text-2xl font-bold mb-4'>Premium Assets - {assetName}</h2>
            
            <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4'>
                {assets.map((asset, index) => (
                    <div
                        key={index}
                        className='bg-white/10 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden flex flex-col items-center p-4 border border-white/20'
                    >
                        <div className='relative w-full h-48 rounded-lg overflow-hidden'>
                            <Image
                                src={asset.image}
                                alt={asset.name}
                                fill
                                className='object-cover'
                            />
                        </div>

                        <div className='mt-3 text-center'>
                            <h3 className='text-white font-semibold text-lg'>{asset.name}</h3>
                            <p className='text-gray-400 text-sm mt-1'>📅 {asset.date}</p>
                            <p className='text-gray-400 text-sm'>
                                🖼️ {asset.size.width}×{asset.size.height}px
                            </p>
                        </div>


                        <button
                            onClick={() => handleAccessClick(asset)}
                            disabled={isLoading || authLoading || checkingPatron}
                            className='mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-5 rounded-lg shadow-md transition cursor-pointer disabled:opacity-50 flex items-center justify-center w-full'
                        >
                            {isLoading || checkingPatron ? (
                                <>
                                    <svg
                                        className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                    >
                                        <circle
                                            className='opacity-25'
                                            cx='12'
                                            cy='12'
                                            r='10'
                                            stroke='currentColor'
                                            strokeWidth='4'
                                        ></circle>
                                        <path
                                            className='opacity-75'
                                            fill='currentColor'
                                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                        ></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    {isPatron ? '⬇️ Download' : '🔒 Get Access'}
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4 border border-gray-700" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            {isAuthenticated ? 'Become a Patron' : 'Premium Access Required'}
                        </h2>
                        <p className="mb-6 text-gray-300">
                            {isAuthenticated 
                                ? 'Your account is not linked to an active Patreon subscription. Subscribe now to access premium content!'
                                : 'To access our premium content, please login with Patreon. Your support helps us create more amazing assets!'
                            }
                        </p>
                        
                        <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-white mb-2">What you get:</h3>
                            <ul className="text-sm text-gray-300 space-y-1">
                                <li>✓ Access to 1500+ premium 3D models</li>
                                <li>✓ One-click import to SketchUp</li>
                                <li>✓ 100+ new models monthly</li>
                                <li>✓ Custom model requests</li>
                                <li>✓ Priority support</li>
                            </ul>
                        </div>
                        
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={handlePatreonLogin}
                                disabled={isLoading}
                                className="w-full bg-[#FF424D] hover:bg-[#E63E48] text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Redirecting to Patreon...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M15.386.524c-4.764 0-8.64 3.876-8.64 8.64 0 4.75 3.876 8.613 8.64 8.613 4.75 0 8.614-3.864 8.614-8.613C24 4.4 20.136.524 15.386.524M.003 23.537h4.22V.524H.003"/>
                                        </svg>
                                        {isAuthenticated ? 'Subscribe on Patreon' : 'Login with Patreon'}
                                    </>
                                )}
                            </button>
                            
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-white font-medium py-2 px-4 rounded transition-colors"
                            >
                                Maybe later
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;
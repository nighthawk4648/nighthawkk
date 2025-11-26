'use client'
import { usePatreonAuth } from "@/contexts/PatreonAuthContext";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { getOptimizedImageUrl } from "@/utils/cloudinary";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const SketchShaperProFiles = ({ categoryId }) => {
    const router = useRouter();
    const getOriginalImageUrl = (imagePath) => {
        return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_FOR_IMAGE}${imagePath}`;
    };
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [downloadingId, setDownloadingId] = useState(null);
    const [categoryInfo, setCategoryInfo] = useState(null);
    const [hoverOrigin, setHoverOrigin] = useState({ id: null, x: '50%', y: '50%' });
    const { user, isAuthenticated, login, loading: authLoading, verifyPatronStatus } = usePatreonAuth();
    const [isPatron, setIsPatron] = useState(false);
    const [checkingPatron, setCheckingPatron] = useState(false);


    const fetchFiles = async (page, limit) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/sketchshaper-pro-files/pages?page=${page}&limit=${limit}&categoryId=${categoryId}&order=desc`
            );

            if (!response.ok) throw new Error('Failed to fetch files');

            const data = await response.json();
            return {
                result: data.data?.result || [],
                pagination: data.data?.pagination || { total: 0, totalPage: 1, currentPage: page }
            };
        } catch (error) {
            console.error('Error fetching files:', error);
            throw error;
        }
    };

    const { data: files, isLoading: filesLoading, hasMore, error: filesError, observerTarget } = useInfiniteScroll(fetchFiles, 12);


    useEffect(() => {
        const fetchCategoryInfo = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/sketchshaper-pro-categories/${categoryId}`);
                if (response.ok) {
                    const data = await response.json();
                    setCategoryInfo(data.data);
                }
            } catch (error) {
                console.error('Error fetching category info:', error);
            }
        };

        if (categoryId) {
            fetchCategoryInfo();
        }
    }, [categoryId]);

    useEffect(() => {
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

    const handleAccessClick = async (file) => {
        if (!isAuthenticated) {
            setShowModal(true);
            return;
        }

       
        setDownloadingId(file.id);
        try {
            const patronStatus = await verifyPatronStatus();

            if (patronStatus) {
          
                handleDownload(file);
            } else {
   
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error verifying patron status:', error);
            alert('Failed to verify your patron status. Please try again.');
        } finally {
            setDownloadingId(null);
        }
    };

    const handleDownload = (file) => {
     
        const link = document.createElement('a');
        link.href = `${API_BASE_URL}/sketchshaper-pro-files/download/${file.id}`;
        link.download = file.name || `download`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log('Download started for:', file.name);
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
        <div className='px-5 md:px-10 lg:px-20 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-8'>
           
            <button
                onClick={() => router.back()}
                className='mb-6 text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2'
            >
                ← Back to Categories
            </button>

           
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

            <h2 className='text-2xl font-bold mb-2'>{categoryInfo?.name || 'Loading...'}</h2>
            {categoryInfo?.description && (
                <p className='text-gray-400 mb-6'>{categoryInfo.description}</p>
            )}

            {filesError && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-300">
                    Error loading files: {filesError}
                </div>
            )}

            <div className='mt-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4'>
                {files.map((file) => {
                    const imageUrl = file.preview_image ? getOptimizedImageUrl(getOriginalImageUrl(file.preview_image)) : 'https://placehold.co/300x200?text=File';

                    return (
                        <div
                            key={file.id}
                            className='bg-white/10 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden flex flex-col items-center p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group'
                        >
                            <div
                                className='relative w-full aspect-square rounded-lg overflow-hidden cursor-zoom-in'
                                onMouseMove={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const px = ((e.clientX - rect.left) / rect.width) * 100;
                                    const py = ((e.clientY - rect.top) / rect.height) * 100;
                                    setHoverOrigin({ id: file.id, x: `${px}%`, y: `${py}%` });
                                }}
                                onMouseLeave={() => setHoverOrigin({ id: null, x: '50%', y: '50%' })}
                            >
                                {file.preview_image && (
                                    <Image
                                        src={imageUrl}
                                        alt={file.name}
                                        fill
                                        className='object-cover group-hover:scale-150 transition-transform duration-300'
                                        style={{
                                            transformOrigin: hoverOrigin.id === file.id ? `${hoverOrigin.x} ${hoverOrigin.y}` : '50% 50%'
                                        }}
                                    />
                                )}
                            </div>

                            <div className='mt-3 text-center w-full'>
                                <h3 className='text-white font-semibold text-lg line-clamp-2'>{file.name}</h3>
                                <p className='text-gray-400 text-sm mt-2'>
                                    📦 {file.size}
                                </p>
                                <p className='text-gray-400 text-xs mt-1'>
                                    {file.file_type}
                                </p>
                            </div>

                            <button
                                onClick={() => handleAccessClick(file)}
                                disabled={downloadingId === file.id || authLoading || checkingPatron}
                                className='mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-5 rounded-lg shadow-md transition cursor-pointer disabled:opacity-50 flex items-center justify-center w-full'
                            >
                                {downloadingId === file.id ? (
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
                                        Downloading...
                                    </>
                                ) : (
                                    <>
                                        {isPatron ? '⬇️ Download' : '🔒 Get Access'}
                                    </>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

           
            {filesLoading && files.length > 0 && (
                <div className='flex justify-center mt-8'>
                    <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500'></div>
                </div>
            )}

           
            {hasMore && (
                <div
                    ref={observerTarget}
                    className='h-10 mt-8 flex items-center justify-center'
                >
                    {filesLoading && files.length > 0 && (
                        <span className='text-gray-400'>Loading more files...</span>
                    )}
                </div>
            )}

           
            {!hasMore && files.length > 0 && (
                <div className='text-center mt-8 text-gray-400'>
                    No more files to load
                </div>
            )}

          
            {!filesLoading && files.length === 0 && !filesError && (
                <div className='text-center mt-8 text-gray-400'>
                    No files available in this category
                </div>
            )}

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
                                            <path d="M15.386.524c-4.764 0-8.64 3.876-8.64 8.64 0 4.75 3.876 8.613 8.64 8.613 4.75 0 8.614-3.864 8.614-8.613C24 4.4 20.136.524 15.386.524M.003 23.537h4.22V.524H.003" />
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
    )

}
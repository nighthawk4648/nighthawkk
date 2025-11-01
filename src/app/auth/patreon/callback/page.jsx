'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePatreonAuth } from '@/contexts/PatreonAuthContext';

export default function PatreonCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleCallback } = usePatreonAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const success = searchParams.get('success');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError('Authentication failed. Please try again.');
      setTimeout(() => {
        router.push('/pro');
      }, 3000);
      return;
    }

    if (token && success === 'true') {
      handleCallback(token);
      // Redirect to pro page after successful authentication
      setTimeout(() => {
        router.push('/pro');
      }, 1500);
    } else {
      setError('Invalid authentication response');
      setTimeout(() => {
        router.push('/pro');
      }, 3000);
    }
  }, [searchParams, handleCallback, router]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center bg-red-900/20 border border-red-500 rounded-lg p-8 max-w-md">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4 text-white">Authentication Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <p className="text-sm text-gray-400">Redirecting you back...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="text-center">
        <div className="mb-6">
          <div className="inline-block relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF424D]"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/>
              </svg>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-white">Authenticating with Patreon...</h2>
        <p className="text-gray-400">Please wait while we verify your membership</p>
        <div className="mt-6 flex justify-center gap-2">
          <div className="w-2 h-2 bg-[#FF424D] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-[#FF424D] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-[#FF424D] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}

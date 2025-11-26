'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePatreonAuth } from '@/contexts/PatreonAuthContext';

function PatreonCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleCallback } = usePatreonAuth();
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const token = searchParams.get('token');
    const success = searchParams.get('success');
    const errorParam = searchParams.get('error');
    const message = searchParams.get('message');

    if (errorParam) {
      let errorMessage = 'Authentication failed. Please try again.';
      let details = null;
      let redirectDelay = 8000; // Default 8 seconds

      if (errorParam === 'not_patron') {
        errorMessage = 'Patron Subscription Required';
        details = message ? decodeURIComponent(message) : 'You must be an active patron to access premium content.\n\n📌 Steps to subscribe:\n1. Click "Subscribe on Patreon" below\n2. Choose a tier and complete payment\n3. Come back and login again\n\nYour subscription will give you access to all exclusive files and content!';
        redirectDelay = 12000; // 12 seconds for patron subscription error
      } else if (errorParam === 'oauth_failed') {
        errorMessage = 'Patreon Authentication Failed';
        details = message ? decodeURIComponent(message) : 'Failed to authenticate with Patreon. Please try again.';
        redirectDelay = 8000;
      } else if (errorParam === 'user_fetch_failed') {
        errorMessage = 'Failed to Fetch User Data';
        details = message ? decodeURIComponent(message) : 'Could not retrieve your Patreon information. Please try again.';
        redirectDelay = 8000;
      } else if (message) {
        errorMessage = 'Authentication Error';
        details = decodeURIComponent(message);
        redirectDelay = 8000;
      }

      setError(errorMessage);
      setErrorDetails(details);
      setCountdown(Math.ceil(redirectDelay / 1000));
      
      // Countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            router.push('/pro');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(countdownInterval);
      
      return;
    }

    if (token && success === 'true') {
      handleCallback(token);
      // Redirect to pro page after successful authentication
      setTimeout(() => {
        router.push('/pro');
      }, 1500);
    } else {
      setError('Authentication Error');
      setErrorDetails('Something went wrong during authentication. This could mean:\n\n• You are not an active patron\n• Your Patreon subscription expired\n• There was a connection issue\n\nPlease try logging in again or subscribe on Patreon first.');
      setCountdown(12);
      
      // Countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            router.push('/pro');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [searchParams, handleCallback, router]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center bg-red-900/20 border border-red-500 rounded-lg p-8 max-w-md">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4 text-white">{error}</h2>
          {errorDetails && (
            <p className="text-gray-300 mb-6 leading-relaxed whitespace-pre-wrap text-left">{errorDetails}</p>
          )}
          <div className="mt-6 space-y-3">
            {error.includes('Patron') && (
              <a
                href="https://www.patreon.com/sketchshaper"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 bg-[#FF424D] hover:bg-[#E63A42] text-white rounded font-semibold transition"
              >
                🔗 Subscribe on Patreon
              </a>
            )}
            <div className="p-4 bg-red-500/10 rounded border border-red-500/30">
              <p className="text-sm text-gray-400">
                Redirecting you back in <span className="font-bold text-red-400">{countdown}</span> seconds...
              </p>
            </div>
            <button
              onClick={() => router.push('/pro')}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
            >
              Go Back Now
            </button>
          </div>
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

export default function PatreonCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-block relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF424D]"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-white">Loading...</h2>
          <p className="text-gray-400">Please wait</p>
        </div>
      </div>
    }>
      <PatreonCallbackContent />
    </Suspense>
  );
}

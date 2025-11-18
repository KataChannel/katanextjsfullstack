'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function RefreshSessionPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'refreshing' | 'success' | 'error'>('idle');

  const handleRefresh = async () => {
    setStatus('refreshing');
    try {
      // Trigger session update
      await update();
      setStatus('success');
      
      // Wait a bit then redirect
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    } catch (error) {
      console.error('Failed to refresh:', error);
      setStatus('error');
    }
  };

  useEffect(() => {
    // Auto-refresh on mount
    if (session && status === 'idle') {
      handleRefresh();
    }
  }, [session]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Refreshing Session</h1>
        
        {status === 'idle' && (
          <p className="text-gray-600">Initializing...</p>
        )}
        
        {status === 'refreshing' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Updating your session...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="text-green-600 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">Session refreshed successfully!</p>
            <p className="text-sm text-gray-500">Redirecting to admin panel...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="text-red-600 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">Failed to refresh session</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </>
        )}
        
        {session && (
          <div className="mt-6 p-4 bg-gray-50 rounded text-left text-sm">
            <p className="font-semibold mb-2">Current Session:</p>
            <p><strong>Email:</strong> {session.user?.email}</p>
            <p><strong>Role:</strong> {session.user?.role}</p>
          </div>
        )}
      </div>
    </div>
  );
}

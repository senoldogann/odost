'use client';

import { signOut } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SignOutPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const callbackUrl = searchParams?.get('callbackUrl') || '/';

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ 
      callbackUrl: '/admin/login',
      redirect: true 
    });
  };

  const handleCancel = () => {
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-xl text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Haluatko kirjautua ulos?
        </h2>
        <p className="text-gray-300 mb-8">
          Olet kirjautumassa ulos hallintapaneelista
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Kirjaudutaan ulos...' : 'Kirjaudu ulos'}
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Peruuta
          </button>
        </div>
      </div>
    </div>
  );
} 
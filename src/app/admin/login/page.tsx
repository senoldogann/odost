'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import LanguageSwitch from '../LanguageSwitch';

async function getIPInfo() {
  try {
    const [ipResponse, geoResponse] = await Promise.all([
      fetch('https://api.ipify.org?format=json'),
      fetch('https://ipapi.co/json/')
    ]);
    
    const ipData = await ipResponse.json();
    const geoData = await geoResponse.json();
    
    return {
      ip: ipData.ip,
      location: `${geoData.city}, ${geoData.country_name}`,
      geoLocation: {
        country: geoData.country_name,
        city: geoData.city,
        region: geoData.region,
        latitude: geoData.latitude,
        longitude: geoData.longitude
      }
    };
  } catch (error) {
    console.error('IP-osoitteen haku epäonnistui:', error);
    return { ip: 'Tuntematon', location: 'Tuntematon' };
  }
}

async function notifyFailedLogin(email: string, ipInfo: any) {
  try {
    await fetch('/api/auth/failed-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        ip: ipInfo.ip,
        location: ipInfo.location,
        geoLocation: ipInfo.geoLocation,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error('Kirjautumisvaroituksen lähetys epäonnistui:', error);
  }
}

function LoginContent() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (result?.error) {
        const ipInfo = await getIPInfo();
        await notifyFailedLogin(formData.email, ipInfo);
        toast.error(t('admin.login.invalidCredentials'));
      } else {
        toast.success(t('admin.login.success'));
        router.push('/admin');
      }
    } catch (error) {
      toast.error(t('admin.common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8 relative">
        <div className="absolute top-4 right-4">
          <LanguageSwitch />
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">{t('admin.login.title')}</h2>
          <p className="mt-2 text-sm text-gray-400">{t('admin.login.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              {t('admin.login.email')}
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              {t('admin.login.password')}
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t('admin.login.loading') : t('admin.login.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <LanguageProvider>
      <LoginContent />
    </LanguageProvider>
  );
} 
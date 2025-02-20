'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { FaSignOutAlt, FaBars, FaTimes, FaUser } from 'react-icons/fa';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import LanguageSwitch from './LanguageSwitch';

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      toast.error(t('admin.common.loginRequired'));
      router.push('/admin/login');
    }
  }, [status, router, pathname, t]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-2xl">{t('admin.common.loading')}</div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!session) {
    return null;
  }

  const menuItems = [
    { href: '/admin', label: t('admin.menu.dashboard'), icon: '📊' },
    { href: '/admin/site-settings', label: t('admin.menu.siteSettings'), icon: '⚙️' },
    { href: '/admin/header', label: t('admin.menu.headerMenu'), icon: '🔝' },
    { href: '/admin/hero', label: t('admin.menu.heroSection'), icon: '🖼️' },
    { href: '/admin/menu', label: t('admin.menu.foodAndDrinks'), icon: '🍽️' },
    { href: '/admin/reservations', label: t('admin.menu.reservations'), icon: '📅' },
    { href: '/admin/gallery', label: t('admin.menu.gallery'), icon: '🎨' },
    { href: '/admin/atmosphere', label: t('admin.menu.atmosphere'), icon: '🌟' },
    { href: '/admin/messages', label: t('admin.menu.messages'), icon: '✉️' },
    { href: '/admin/gift-cards', label: t('admin.menu.giftCards'), icon: '🎁' },
    { href: '/admin/footer', label: t('admin.menu.footer'), icon: '↓' }
  ];

  return (
    <div className="min-h-screen bg-black">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800 border-b border-gray-700 h-16">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-gray-200 hover:bg-gray-700"
              aria-label={isSidebarOpen ? t('admin.common.closeMenu') : t('admin.common.openMenu')}
            >
              {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
            <span className="ml-4 text-xl font-semibold text-white">ODOST Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/profile"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-200 hover:bg-gray-700"
            >
              <FaUser size={16} />
              <span className="hidden sm:inline">{session?.user?.email}</span>
            </Link>
            <LanguageSwitch />
            <button
              onClick={() => router.push('/api/auth/signout')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-200 hover:bg-gray-700"
            >
              <FaSignOutAlt size={16} />
              <span>{t('admin.common.logout')}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-gray-800 border-r border-gray-700 w-64`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center p-2 rounded-lg ${
                    pathname === item.href 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-200 hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-3 text-sm">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className={`pt-16 ${isSidebarOpen ? 'sm:ml-64' : ''} transition-all duration-200`}>
        <div className="p-4 rounded-lg">
          <div className="mt-4 text-white">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </LanguageProvider>
  );
} 
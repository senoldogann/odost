'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { memo } from 'react';
import { useTheme } from 'next-themes';
import { FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';
import { createPortal } from 'react-dom';

interface HeaderMenuItem {
  id: string;
  title: string;
  path: string;
  order: number;
  isActive: boolean;
  type: 'RAVINTOLA' | 'BAARI';
  siteTitle?: string;
  siteLogo?: string;
}

interface HeaderMenuProps {
  type?: 'RAVINTOLA' | 'BAARI';
}

const HeaderMenuSkeleton = () => {
  return null; // Tamamen boş bir loading state
};

const HeaderMenu = memo(function HeaderMenu({ type = 'RAVINTOLA' }: HeaderMenuProps) {
  const [menuItems, setMenuItems] = useState<HeaderMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [siteTitle, setSiteTitle] = useState<string | null>(null);
  const [siteLogo, setSiteLogo] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
    // Sayfa yüklendikten sonra header'ı yavaşça göster
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`/api/header-menu?type=${type}`);
        if (!response.ok) throw new Error('Menü öğeleri getirilemedi');
        const data = await response.json();
        
        // Menü öğelerini sırala
        const sortedItems = data.sort((a: HeaderMenuItem, b: HeaderMenuItem) => a.order - b.order);
        setMenuItems(sortedItems);

        // Site başlığı ve logosunu bul
        const siteInfoItem = sortedItems.find((item: HeaderMenuItem) => item.siteTitle || item.siteLogo);
        if (siteInfoItem) {
          setSiteTitle(siteInfoItem.siteTitle || null);
          setSiteLogo(siteInfoItem.siteLogo || null);
        }
      } catch (error) {
        console.error('Menü yükleme hatası:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, [type]);

  const renderThemeChanger = () => {
    if (!mounted) return null;

    return (
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="text-white hover:text-gray-300 transition-colors"
        aria-label="Tema değiştir"
      >
        {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
      </button>
    );
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
        } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo ve Başlık */}
            <Link href="/" className="flex items-center space-x-4">
              {siteLogo ? (
                <Image
                  src={siteLogo}
                  alt={siteTitle || "ODOST"}
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              ) : (
                <span className="text-xl font-bold text-white">
                  {siteTitle || "ODOST"}
                </span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                item.isActive && (
                  <Link
                    key={item.id}
                    href={item.path}
                    className={`text-white hover:text-gray-300 transition-colors ${
                      pathname === item.path ? 'font-semibold' : ''
                    }`}
                  >
                    {item.title}
                  </Link>
                )
              ))}
              {renderThemeChanger()}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white p-2"
              aria-label={isMobileMenuOpen ? t('admin.common.closeMenu') : t('admin.common.openMenu')}
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Portal */}
      {mounted && isMobileMenuOpen && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md md:hidden">
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="w-full max-w-md p-8">
              <div className="flex justify-center mb-12">
                {siteLogo ? (
                  <Image
                    src={siteLogo}
                    alt={siteTitle || "ODOST"}
                    width={120}
                    height={40}
                    className="h-10 w-auto"
                  />
                ) : (
                  <div className="text-2xl font-bold text-white">
                    {siteTitle || "ODOST"}
                  </div>
                )}
              </div>
              
              <nav className="flex flex-col items-center space-y-6">
                {menuItems.map((item) => (
                  item.isActive && (
                    <Link
                      key={item.id}
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-white hover:text-gray-300 transition-colors text-xl ${
                        pathname === item.path ? 'font-semibold' : ''
                      }`}
                    >
                      {item.title}
                    </Link>
                  )
                ))}
              </nav>
              
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => {
                    setTheme(theme === 'dark' ? 'light' : 'dark');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-white hover:text-gray-300 transition-colors flex items-center space-x-3"
                >
                  {theme === 'dark' ? (
                    <>
                      <FaSun size={24} />
                      <span className="text-lg">Kevyt teema</span>
                    </>
                  ) : (
                    <>
                      <FaMoon size={24} />
                      <span className="text-lg">Tumma teema</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
});

export default HeaderMenu; 
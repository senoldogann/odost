'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { memo } from 'react';
import { useTheme } from 'next-themes';
import { FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';

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

const HeaderMenu = memo(function HeaderMenu({ type = 'RAVINTOLA' }: HeaderMenuProps) {
  const [menuItems, setMenuItems] = useState<HeaderMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [siteTitle, setSiteTitle] = useState<string | null>(null);
  const [siteLogo, setSiteLogo] = useState<string | null>(null);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
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
    return (
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
        }`}
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
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 transform ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="absolute inset-0 bg-black/95 backdrop-blur-md">
          <div className="flex flex-col items-center justify-center h-full">
            {siteLogo ? (
              <Image
                src={siteLogo}
                alt={siteTitle || "ODOST"}
                width={120}
                height={40}
                className="h-10 w-auto mb-8"
              />
            ) : (
              <div className="mb-8 text-2xl font-bold text-white">
                {siteTitle || "ODOST"}
              </div>
            )}
            {menuItems.map((item) => (
              item.isActive && (
                <Link
                  key={item.id}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-white hover:text-gray-300 transition-colors py-4 ${
                    pathname === item.path ? 'font-semibold' : ''
                  }`}
                >
                  {item.title}
                </Link>
              )
            ))}
            {mounted && (
              <button
                onClick={() => {
                  setTheme(theme === 'dark' ? 'light' : 'dark');
                  setIsMobileMenuOpen(false);
                }}
                className="text-white hover:text-gray-300 transition-colors flex items-center space-x-2 mt-4"
              >
                {theme === 'dark' ? (
                  <>
                    <FaSun size={20} />
                    <span>Kevyt teema</span>
                  </>
                ) : (
                  <>
                    <FaMoon size={20} />
                    <span>Tumma teema</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
});

export default HeaderMenu; 
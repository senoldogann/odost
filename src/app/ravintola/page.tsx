'use client';

import { useState, useEffect, Suspense } from 'react';
import Hero from '@/components/Hero';
import MenuSection from '@/components/shared/MenuSection';
import GallerySection from '@/components/shared/GallerySection';
import AtmosphereSection from '@/components/shared/AtmosphereSection';
import Footer from '@/components/Footer';
import HeaderMenu from '@/components/HeaderMenu';
import FeatureSection from '@/components/shared/FeatureSection';

// Loading komponenti
const PageSkeleton = () => null;

export default function RestaurantPage() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch('/api/gallery?type=RAVINTOLA');
        if (!response.ok) throw new Error('Gallerian hakeminen epäonnistui');
        const data = await response.json();
        setGalleryImages(data);
      } catch (error) {
        console.error('Gallerian hakuvirhe:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  return (
    <div className="min-h-screen bg-theme">
      <HeaderMenu type="RAVINTOLA" />
      <Hero type="RAVINTOLA" />
      
      {/* Öne Çıkan Yemekler */}
      <div className="bg-white dark:bg-black">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl font-bold text-center mb-4">Suosikki ruoat</h2>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-black/20 dark:via-white/20 to-transparent blur"></div>
              <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-black dark:via-white to-transparent relative"></div>
            </div>
          </div>
          <MenuSection />
        </div>
      </div>

      {/* Özel Tanıtım Bölümü */}
      <FeatureSection type="RAVINTOLA" />

      {/* Atmosfer Bölümü */}
      <section className="py-12 dark:atmosphere-section bg-white dark:bg-transparent">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-4xl font-bold text-center mb-4 text-theme">Tunnelma & Erikoisuudet</h2>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-black/20 dark:via-white/20 to-transparent blur"></div>
              <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-black dark:via-white to-transparent relative"></div>
            </div>
          </div>
          <AtmosphereSection type="RAVINTOLA" />
        </div>
      </section>

      {/* Galeri Bölümü */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-4xl font-bold text-center mb-4 text-theme">Galleria</h2>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-black/20 dark:via-white/20 to-transparent blur"></div>
              <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-black dark:via-white to-transparent relative"></div>
            </div>
          </div>
          {!isLoading && <GallerySection type="RAVINTOLA" images={galleryImages} />}
        </div>
      </section>

      <Footer />
    </div>
  );
} 
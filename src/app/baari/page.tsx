'use client';

import { useState, useEffect, Suspense } from 'react';
import Hero from '@/components/Hero';
import DrinksSection from '@/components/shared/DrinksSection';
import GallerySection from '@/components/shared/GallerySection';
import AtmosphereSection from '@/components/shared/AtmosphereSection';
import Footer from '@/components/Footer';
import HeaderMenu from '@/components/HeaderMenu';
import FeatureSection from '@/components/shared/FeatureSection';

// Loading komponenti
const PageSkeleton = () => null;

export default function BarPage() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch('/api/gallery?type=BAARI');
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
      <HeaderMenu type="BAARI" />
      <Hero type="BAARI" />
      
      {/* Öne Çıkan İçecekler */}
      <div className="bg-white dark:bg-black">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl font-bold text-center mb-4">Suosikki juomat</h2>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-black/20 dark:via-white/20 to-transparent blur"></div>
              <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-black dark:via-white to-transparent relative"></div>
            </div>
          </div>
          <DrinksSection />
        </div>
      </div>

      {/* Özel Tanıtım Bölümü */}
      <FeatureSection type="BAARI" />

      {/* Tunnelma & Erikoisuudet */}
      <section className="py-12 dark:atmosphere-section bg-white dark:bg-transparent">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-4xl font-bold text-center mb-4 text-theme">Tunnelma & Erikoisuudet</h2>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-black/20 dark:via-white/20 to-transparent blur"></div>
              <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-black dark:via-white to-transparent relative"></div>
            </div>
          </div>
          <AtmosphereSection type="BAARI" />
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
          {!isLoading && <GallerySection type="BAARI" images={galleryImages} />}
        </div>
      </section>

      <Footer />
    </div>
  );
} 
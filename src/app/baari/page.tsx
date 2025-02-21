'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import DrinksSection from '@/components/shared/DrinksSection';
import GallerySection from '@/components/shared/GallerySection';
import AtmosphereSection from '@/components/shared/AtmosphereSection';
import Footer from '@/components/Footer';
import HeaderMenu from '@/components/HeaderMenu';

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
          <h2 className="text-3xl font-bold text-center mb-8">Korostetut juomat</h2>
          <DrinksSection />
        </div>
      </div>

      {/* Atmosfer Bölümü */}
      <section className="py-12 dark:atmosphere-section bg-white dark:bg-transparent">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-theme">Tunnelma & Tapahtumat</h2>
          <AtmosphereSection type="BAARI" />
        </div>
      </section>

      {/* Galeri Bölümü */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-theme">Galleria</h2>
          {!isLoading && <GallerySection type="BAARI" images={galleryImages} />}
        </div>
      </section>

      <Footer />
    </div>
  );
} 
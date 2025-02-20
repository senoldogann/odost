'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeroSection {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  type: 'RAVINTOLA' | 'BAARI';
  isActive: boolean;
  buttonText?: string;
  buttonUrl?: string;
}

interface HeroProps {
  type: 'RAVINTOLA' | 'BAARI';
}

export default function Hero({ type }: HeroProps) {
  const [heroData, setHeroData] = useState<HeroSection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch(`/api/hero?type=${type}`);
        if (!response.ok) throw new Error('Hero-osion hakeminen epäonnistui');
        const data = await response.json();
        const activeHero = Array.isArray(data) ? data.find(h => h.isActive) || data[0] : null;
        setHeroData(activeHero);
      } catch (error) {
        console.error('Hero-osion virhe:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroData();
  }, [type]);

  if (isLoading) {
    return (
      <section className="h-screen relative bg-black flex items-center justify-center">
        <div className="text-white text-xl">Ladataan...</div>
      </section>
    );
  }

  if (!heroData) {
    return (
      <section className="h-screen relative bg-black flex items-center justify-center">
        <div className="text-white text-xl">Hero-osiota ei löytynyt</div>
      </section>
    );
  }

  return (
    <section className="h-[80vh] sm:h-screen relative">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={heroData.imageUrl}
          alt={heroData.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          quality={90}
        />
      </div>
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-3 sm:mb-4 animate-fade-in">
          {heroData.title}
        </h1>
        {heroData.subtitle && (
          <p className="text-base sm:text-lg md:text-xl text-center max-w-xl sm:max-w-2xl animate-fade-in-delayed">
            {heroData.subtitle}
          </p>
        )}
        {heroData.buttonText && heroData.buttonUrl && (
          <a
            href={heroData.buttonUrl}
            className="mt-6 sm:mt-8 px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-black text-sm sm:text-base font-semibold rounded-full hover:bg-gray-200 transition-colors animate-fade-in-delayed"
          >
            {heroData.buttonText}
          </a>
        )}
      </div>
    </section>
  );
} 
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/context/LanguageContext';

interface FeatureSectionProps {
  type: 'RAVINTOLA' | 'BAARI';
}

export default function FeatureSection({ type }: FeatureSectionProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const getContent = () => {
    if (type === 'RAVINTOLA') {
      return {
        title: 'ODOST LOUNAS & RAVINTOLA',
        subtitle: 'MAUKAS RUOKA',
        description: 'Tervetuloa nauttimaan herkullisista ruoka-annoksistamme. Tarjoamme monipuolisia makuelämyksiä, jotka on valmistettu tuoreista ja laadukkaista raaka-aineista. Jokainen annos on valmistettu huolella ja ammattitaidolla.',
        image: '/images/featured-item.jpeg',
        buttonText: 'TUTUSTU MENUUN',
        buttonLink: '/ravintola/ruokat'
      };
    }
    return {
      title: 'ODOST BAARI',
      subtitle: 'VIIHTYISÄ ILLANVIETTO',
      description: 'Tule nauttimaan ainutlaatuisesta tunnelmasta ja laajasta juomavalikoimastamme. Tarjoamme erinomaisia cocktaileja, laadukkaita viinejä ja oluita sekä muita juomia. Meillä voit rentoutua ja viettää ikimuistoisen illan.',
      image: '/images/featured-item.jpeg',
      buttonText: 'TUTUSTU JUOMIIN',
      buttonLink: '/baari/juomat'
    };
  };

  const content = getContent();

  return (
    <div className="relative w-full py-16 overflow-hidden">
      {/* Tausta */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gray-900/95' : 'bg-white'}`} />
        <div className={`absolute inset-0 bg-gradient-to-r ${
          theme === 'dark' 
            ? 'from-blue-900/20 via-purple-900/20 to-pink-900/20' 
            : 'from-gray-100 via-gray-50 to-white'
        }`} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("/images/pattern.png")',
          backgroundRepeat: 'repeat',
          opacity: theme === 'dark' ? 0.05 : 0.1
        }} />
      </div>

      {/* Sisältö */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Teksti */}
          <div className="flex-1 text-center lg:text-left">
            <div className={`inline-block mb-4 px-4 py-1 rounded-full ${
              theme === 'dark' 
                ? 'bg-blue-500/10 border border-blue-500/20' 
                : 'bg-gray-100 border border-gray-200'
            }`}>
              <span className={`text-sm font-medium ${
                theme === 'dark' 
                  ? 'text-blue-400' 
                  : 'text-gray-800'
              }`}>{content.title}</span>
            </div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'
                : 'text-gray-900'
            }`}>
              {content.subtitle}
            </h2>
            <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {content.description}
            </p>
            <Link 
              href={content.buttonLink}
              className={`inline-block px-8 py-3 rounded-full ${
                theme === 'dark' 
                  ? 'bg-white text-gray-900 hover:bg-gray-100' 
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              } font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105`}
            >
              {content.buttonText}
            </Link>
          </div>

          {/* Kuva */}
          <div className="flex-1 relative w-full">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={content.image}
                alt={content.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className={`absolute inset-0 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-tr from-blue-900/30 via-purple-900/20 to-transparent' 
                  : 'bg-gradient-to-tr from-gray-900/10 to-transparent'
              }`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
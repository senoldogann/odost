'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MenuType } from '@prisma/client';
import { FaPhone } from 'react-icons/fa6';
import HeaderMenu from '@/components/HeaderMenu';
import Footer from '@/components/Footer';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  type: MenuType;
  isActive: boolean;
  allergens?: string[];
  image?: string;
}

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [heroData, setHeroData] = useState<any>(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch('/api/hero?type=RAVINTOLA');
        if (!response.ok) throw new Error('Hero verilerini getirme başarısız');
        const data = await response.json();
        setHeroData(data[0]);
      } catch (error) {
        console.error('Hero verilerini getirme hatası:', error);
      }
    };

    fetchHeroData();
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menu?type=RAVINTOLA');
        if (!response.ok) throw new Error('Menü öğeleri getirilemedi');
        const data = await response.json();
        setItems(data);

        // Benzersiz kategorileri çıkar
        const uniqueCategories = [...new Set(data.map((item: MenuItem) => item.category))] as string[];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Menü öğeleri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const formatDescription = (description: string) => {
    return description.split(',').map(item => item.trim());
  };

  const handleCall = () => {
    window.location.href = `tel:${process.env.NEXT_PUBLIC_PHONE}`;
  };

  // Filtreleme fonksiyonu
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <HeaderMenu type="RAVINTOLA" />
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <HeaderMenu type="RAVINTOLA" />
      
      {/* Hero Section */}
      {heroData && (
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={heroData.imageUrl}
              alt={heroData.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
          <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              Ruokalista
            </h1>
            {heroData.subtitle && (
              <p className="text-lg md:text-xl text-center max-w-2xl">
                {heroData.subtitle}
              </p>
            )}
          </div>
        </div>
      )}
      
      <main className="container mx-auto px-4 py-12">
        {/* Filtreleme ve Arama Bölümü */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="w-full max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Etsi ruokaa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300 text-base font-medium ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-amber-100 dark:hover:bg-gray-700'
              }`}
            >
              Kaikki
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300 text-base font-medium ${
                  selectedCategory === category
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-amber-100 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menü Öğeleri Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 max-w-7xl mx-auto">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-800 transition-all duration-300"
            >
              <div className="p-3">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCall}
                      className="p-1.5 rounded-full bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/30 dark:hover:bg-amber-800/50 text-amber-600 dark:text-amber-400 transition-all duration-300 hover:scale-110"
                    >
                      <FaPhone className="w-3 h-3" />
                    </button>
                    <div className="bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full">
                      <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                        {item.price}€
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex flex-wrap gap-1 text-gray-600 dark:text-gray-400 text-xs">
                    {formatDescription(item.description).map((desc, index) => (
                      <span key={index} className="inline-flex items-center">
                        {index > 0 && <span className="mx-0.5 text-amber-400/70">•</span>}
                        {desc}
                      </span>
                    ))}
                  </div>
                </div>

                {item.allergens && item.allergens.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.allergens.map((allergen, index) => (
                      <span
                        key={index}
                        className="px-1 py-0.5 text-[10px] bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full border border-amber-200/50 dark:border-amber-800/50"
                      >
                        {allergen}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Sonuç bulunamadı mesajı */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Ei hakutuloksia. Kokeile eri hakusanoja.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
} 
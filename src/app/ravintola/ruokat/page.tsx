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
  familyPrice?: number;
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
    window.location.href = `tel:${process.env.NEXT_PUBLIC_COMPANY_PHONE}`;
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
        
        {/* Hero Section Skeleton */}
        <div className="relative h-[40vh] md:h-[50vh] bg-gray-200 dark:bg-gray-800 animate-pulse">
          <div className="relative h-full flex flex-col items-center justify-center">
            <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>
            <div className="h-4 w-64 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-12">
          {/* Search and Filter Skeleton */}
          <div className="flex flex-col gap-6 mb-8">
            <div className="w-full max-w-xl mx-auto h-12 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
              ))}
            </div>
          </div>

          {/* Menu Items Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 max-w-7xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 p-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  <div className="h-5 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
                  <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </main>

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
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              {/* Resim Alanı */}
              <div className="relative h-48 w-full">
                <Image
                  src={item.image || '/images/placeholder.jpg'}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {item.price} €
                  {item.familyPrice && (
                    <span className="ml-2 text-xs">Perhe: {item.familyPrice} €</span>
                  )}
                </div>
              </div>

              {/* İçerik Alanı */}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {item.name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCall();
                    }}
                    className="p-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
                    aria-label="Tilaa puhelimitse"
                  >
                    <FaPhone className="w-4 h-4" />
                  </button>
                </div>

                {/* İçindekiler Listesi */}
                <div className="space-y-2 mb-4">
                  {item.description.split(',').map((ingredient, index) => (
                    <div key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                      <span className="text-amber-500 mr-2">•</span>
                      <span className="text-sm">{ingredient.trim()}</span>
                    </div>
                  ))}
                </div>

                {/* Alerjenler */}
                {item.allergens && item.allergens.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-2">
                      {item.allergens.map((allergen, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
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

      {/* Lisätäytteet ve Omavalinta Bölümü */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Lisätäytteet */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-800">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Lisätäytteet</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {['Pizza suikale', 'Tonnikala', 'Ananas', 'Salami', 'Kebab', 'Pepperonimakkara', 'Pekoni', 'Jalapeno', 'Savuporo', 'Aurajuusto', 'Jauhelia', 'Herkkusieni', 'Paprika', 'Sipuli', 'Kirsikkatomaatti', 'Rucola', 'Mozzarella', 'Salaattijuusto', 'Katkarapu', 'Persikka', 'Kana', 'Vuohenjuusto', 'Cheddarjuusto'].map((item) => (
                  <div key={item} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lisätiedot */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-800">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Lisätiedot</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
                      <span className="text-2xl">🍽️</span>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 dark:text-gray-200">
                    Kaikki pihville kuulu ranskalaiset, lohkoperunat tai riisi
                  </p>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
                      <span className="text-2xl">🍔</span>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 dark:text-gray-200">
                    Kaikki burgerit sisältä kuulu ranskalaiset ja 0.33 Limsa
                  </p>
                </div>
              </div>
            </div>

            {/* Omavalinta */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-800">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Omavalinta</h2>
              <div className="grid gap-4">
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800 dark:text-gray-200">1 TÄYTETTÄ</span>
                        <span className="text-amber-600 dark:text-amber-400 font-bold">10.00 €</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800 dark:text-gray-200">2 TÄYTETTÄ</span>
                        <span className="text-amber-600 dark:text-amber-400 font-bold">11.00 €</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800 dark:text-gray-200">3 TÄYTETTÄ</span>
                        <span className="text-amber-600 dark:text-amber-400 font-bold">12.00 €</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800 dark:text-gray-200">4 TÄYTETTÄ</span>
                        <span className="text-amber-600 dark:text-amber-400 font-bold">13.00 €</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 dark:text-gray-200">TUPLA JUUSTO</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">2.00 €</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 dark:text-gray-200">TUPLA KEBAB</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">2.00 €</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 dark:text-gray-200">GLUTEENITON</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">3.00 €</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 
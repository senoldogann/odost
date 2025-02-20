'use client';

import { useState, useEffect } from 'react';
import { FaClock, FaCalendar, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface AtmosphereEvent {
  id: string;
  title: string;
  description: string;
  schedule: string;
  type: 'RAVINTOLA' | 'BAARI';
  isActive: boolean;
  order: number;
  imageUrl?: string;
}

interface AtmosphereSectionProps {
  type: 'RAVINTOLA' | 'BAARI';
}

// URL'nin geçerli olup olmadığını kontrol eden yardımcı fonksiyon
const isValidImageUrl = (url: string | undefined): url is string => {
  if (!url || typeof url !== 'string') return false;
  const trimmedUrl = url.trim();
  if (trimmedUrl === '') return false;
  
  return (
    trimmedUrl.startsWith('http://') || 
    trimmedUrl.startsWith('https://') || 
    trimmedUrl.startsWith('/')
  );
};

export default function AtmosphereSection({ type }: AtmosphereSectionProps) {
  const [events, setEvents] = useState<AtmosphereEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [type]);

  const fetchEvents = async () => {
    try {
      setError(null);
      const response = await fetch(`/api/atmosphere?type=${type}`);
      if (!response.ok) throw new Error('Virhe haettaessa tapahtumia');
      const data = await response.json();
      
      // Aktif etkinlikleri filtrele ve resim URL'lerini doğrula
      const validatedEvents = data
        .filter((event: AtmosphereEvent) => event.isActive)
        .map((event: AtmosphereEvent) => ({
          ...event,
          title: event.title || '',
          description: event.description || '',
          schedule: event.schedule || '',
          imageUrl: isValidImageUrl(event.imageUrl) ? event.imageUrl : '/images/default-event.jpg'
        }));

      setEvents(validatedEvents);
    } catch (error) {
      console.error('Virhe haettaessa tapahtumia:', error);
      setError('Tapahtumien lataaminen epäonnistui');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="relative overflow-hidden min-h-[400px] py-12">
      <div className="absolute inset-0 bg-gradient-to-r backdrop-blur-sm"></div>
      <div className="relative container mx-auto px-4">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="!pb-12"
        >
          {events.map((event, index) => (
            <SwiperSlide key={event.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white dark:bg-black backdrop-blur-md rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-2xl dark:hover:shadow-white/5 transition-all duration-300 transform hover:-translate-y-2 h-full"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={event.imageUrl || '/images/default-event.jpg'}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6 relative z-10">
                  <h3 className="text-2xl font-bold mb-3 text-black dark:text-white group-hover:text-theme transition-colors duration-300">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 min-h-[80px] group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                    <FaCalendar className="w-4 h-4" />
                    <FaClock className="w-4 h-4" />
                    <span className="text-sm">{event.schedule}</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <Link
                      href="/varaus"
                      className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full hover:opacity-80 transition-opacity text-sm font-medium"
                    >
                      <FaCalendarAlt size={16} />
                      Varaa pöytä
                    </Link>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
} 
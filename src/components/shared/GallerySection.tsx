'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryImage {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
}

interface GallerySectionProps {
  type: 'RAVINTOLA' | 'BAARI';
  images: GalleryImage[];
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

export default function GallerySection({ type, images }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return null;
  }

  const validImages = images.filter(image => isValidImageUrl(image.imageUrl));

  if (validImages.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-gray-500">
        <p>Galeri için resim bulunamadı</p>
      </div>
    );
  }

  return (
    <section className="py-8 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {validImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedImage(image)}
              className="relative aspect-[4/3] cursor-pointer group rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 w-full"
            >
              <Image
                src={isValidImageUrl(image.imageUrl) ? image.imageUrl : '/images/default-gallery.jpg'}
                alt={image.title || 'Galeri resmi'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                <h3 className="text-lg font-bold text-white mb-1">{image.title}</h3>
                {image.description && (
                  <p className="text-white/90 text-sm line-clamp-2">{image.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal görünümü */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative max-w-4xl w-full bg-black/40 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={isValidImageUrl(selectedImage.imageUrl) ? selectedImage.imageUrl : '/images/default-gallery.jpg'}
                  alt={selectedImage.title || 'Galeri resmi'}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                  quality={100}
                />
              </div>
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-4 bg-gradient-to-t from-black/90 to-transparent absolute bottom-0 left-0 right-0"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-white/90 text-base line-clamp-2">{selectedImage.description}</p>
                )}
              </motion.div>
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 text-white hover:text-gray-300 transition-colors bg-black/50 p-2 rounded-full hover:bg-black/70"
                onClick={() => setSelectedImage(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
} 
import Hero from '@/components/Hero';
import MenuSection from '@/components/shared/MenuSection';
import GallerySection from '@/components/shared/GallerySection';
import AtmosphereSection from '@/components/shared/AtmosphereSection';
import Footer from '@/components/Footer';
import HeaderMenu from '@/components/HeaderMenu';
import { prisma } from '@/lib/prisma';

export default async function RestaurantPage() {
  // Galeri resimlerini getir
  const galleryImages = await prisma.gallery.findMany({
    where: {
      type: 'RAVINTOLA',
      isActive: true
    }
  });

  return (
    <div className="min-h-screen bg-theme">
      <HeaderMenu type="RAVINTOLA" />
      <Hero type="RAVINTOLA" />
      
      {/* Öne Çıkan Yemekler */}
      <div className="bg-white dark:bg-black">
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-center mb-8">Korostetut ruoat</h2>
          <MenuSection />
        </div>
      </div>

      {/* Atmosfer Bölümü */}
      <section className="py-12 dark:atmosphere-section bg-white dark:bg-transparent">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-theme">Tunnelma & Erikoisuudet</h2>
          <AtmosphereSection type="RAVINTOLA" />
        </div>
      </section>

      {/* Galeri Bölümü */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-theme">Galleria</h2>
          <GallerySection type="RAVINTOLA" images={galleryImages} />
        </div>
      </section>

      <Footer />
    </div>
  );
} 
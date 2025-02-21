import Footer from '@/components/Footer'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa'
import ContactForm from '@/components/shared/ContactForm'
import HeaderMenu from '@/components/HeaderMenu'

export default function YhteystiedotPage() {
  return (
    <div className="min-h-screen bg-theme">
      {/* Header */}
      <HeaderMenu type="RAVINTOLA" />

      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587560699334-cc4ff634909a')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/40 to-black/30 dark:from-white-600/80 dark:via-white-900/30 dark:to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-black to-transparent" />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-6xl font-bold mb-6 text-white drop-shadow-lg">Yhteystiedot</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white drop-shadow-md">
            Ota yhteyttä - olemme täällä sinua varten
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 -mt-20 relative z-10 bg-theme">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b dark:from-purple-900/20 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-theme">Ota yhteyttä </h2>
            <div className="bg-theme border border-theme p-8 rounded-lg">
              <ContactForm type="YLEINEN" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-theme border-y border-theme">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Phone */}
            <div className="bg-theme border border-theme p-8 text-center rounded-lg">
              <div className="flex justify-center mb-4">
                <FaPhone className="text-4xl text-theme" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-theme">Puhelin</h3>
              <p className="menu-description">+358 50 123 4567</p>
            </div>

            {/* Email */}
            <div className="bg-theme border border-theme p-8 text-center rounded-lg">
              <div className="flex justify-center mb-4">
                <FaEnvelope className="text-4xl text-theme" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-theme">Sähköposti</h3>
              <p className="menu-description">info@ravintolabaari.fi</p>
            </div>

            {/* Address */}
            <div className="bg-theme border border-theme p-8 text-center rounded-lg">
              <div className="flex justify-center mb-4">
                <FaMapMarkerAlt className="text-4xl text-theme" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-theme">Osoite</h3>
              <p className="menu-description">Ravintolakatu 123<br />00100 Helsinki</p>
            </div>

            {/* Opening Hours */}
            <div className="bg-theme border border-theme p-8 text-center rounded-lg">
              <div className="flex justify-center mb-4">
                <FaClock className="text-4xl text-theme" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-theme">Aukioloajat</h3>
              <p className="menu-description">Ma-La: 11-23<br />Su: 12-22</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="bg-theme border border-theme p-4 rounded-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1984.9803661485884!2d24.945073!3d60.169333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNjDCsDEwJzA5LjYiTiAyNMKwNTYnNDIuMyJF!5e0!3m2!1sfi!2sfi!4v1645789012345!5m2!1sfi!2sfi"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
} 
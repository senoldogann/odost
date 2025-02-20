'use client';

import HeaderMenu from '@/components/HeaderMenu';
import Footer from '@/components/Footer';
import { useCompany } from '@/context/CompanyContext';
import Image from 'next/image';

export default function KayttoehdotPage() {
  const company = useCompany();

  return (
    <div className="min-h-screen bg-theme">
      <HeaderMenu type="RAVINTOLA" />

      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[400px] w-full">
        <Image
          src="/images/terms-hero.jpg"
          alt="Käyttöehdot"
          fill
          sizes="100vw"
          quality={100}
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Käyttöehdot</h1>
          <p className="text-xl md:text-2xl max-w-2xl">
            Tutustu palvelumme käyttöehtoihin
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-semibold mb-6 text-theme border-b pb-4">1. Yleistä</h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <p className="menu-description">
                  Nämä käyttöehdot koskevat {company.name}in verkkosivuston käyttöä. 
                  Käyttämällä sivustoamme hyväksyt nämä käyttöehdot ja sitoudut noudattamaan niitä.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-semibold mb-6 text-theme border-b pb-4">2. Palvelun kuvaus</h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <p className="menu-description mb-6">
                  Tarjoamme verkkosivustollamme seuraavia palveluita:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🪑</span>
                      <span>Pöytävarausjärjestelmä</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🍽️</span>
                      <span>Ruoka- ja juomalistojen selaus</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📝</span>
                      <span>Yhteydenottolomake</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">ℹ️</span>
                      <span>Tietoa ravintolamme palveluista</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-semibold mb-6 text-theme border-b pb-4">3. Varausehdot</h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <p className="menu-description mb-6">Pöytävarauksia koskevat seuraavat ehdot:</p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl mt-1">✅</span>
                    <span>Varaus on sitova, kun olet saanut vahvistuksen sähköpostiisi</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl mt-1">⏰</span>
                    <span>Peruutus tulee tehdä viimeistään 24 tuntia ennen varattua aikaa</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl mt-1">💳</span>
                    <span>Myöhäisestä peruutuksesta tai saapumatta jättämisestä voidaan veloittaa maksu</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl mt-1">⚠️</span>
                    <span>Pidätämme oikeuden perua tai siirtää varauksia force majeure -tilanteissa</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-semibold mb-6 text-theme border-b pb-4">4. Yhteystiedot</h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📍</span>
                      <span>{company.address}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📞</span>
                      <span>{company.phone}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📧</span>
                      <span>{company.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🏢</span>
                      <span>Y-tunnus: {company.yTunnus}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold mb-6 text-theme border-b pb-4">5. Muutokset käyttöehtoihin</h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <p className="menu-description">
                  Pidätämme oikeuden muuttaa näitä käyttöehtoja. Muutoksista ilmoitetaan 
                  verkkosivuillamme. Jatkamalla sivuston käyttöä hyväksyt muuttuneet käyttöehdot.
                  Nämä käyttöehdot on päivitetty viimeksi {new Date().toLocaleDateString('fi-FI')}.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 
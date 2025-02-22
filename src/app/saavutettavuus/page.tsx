'use client';

import HeaderMenu from '@/components/HeaderMenu';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function SaavutettavuusPage() {
  return (
    <div className="min-h-screen bg-theme">
      <HeaderMenu type="RAVINTOLA" />

      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[400px] w-full">
        <Image
          src="/images/accessibility-hero.jpg"
          alt="Saavutettavuus"
          fill
          sizes="100vw"
          quality={100}
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Saavutettavuusseloste</h1>
          <p className="text-xl md:text-2xl max-w-2xl">
            Sitoudumme tarjoamaan saavutettavan verkkopalvelun kaikille käyttäjille
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-semibold mb-6 text-theme border-b pb-4">Johdanto</h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <p className="menu-description">
                {process.env.NEXT_PUBLIC_COMPANY_NAME} on sitoutunut digitaalisten palveluiden saavutettavuuteen 
                  ja pyrkii varmistamaan verkkosivustonsa saavutettavuuden EU:n saavutettavuusdirektiivin 
                  ja kansallisen lainsäädännön mukaisesti.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-semibold mb-6 text-theme border-b pb-4">Saavutettavuuden tila</h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <p className="menu-description mb-6">
                  Verkkosivustomme täyttää WCAG 2.1 -ohjeistuksen AA-tason vaatimukset. 
                  Olemme tehneet seuraavat toimenpiteet saavutettavuuden varmistamiseksi:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🔍</span>
                      <span>Sivuston rakenne on selkeä ja johdonmukainen</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">⌨️</span>
                      <span>Kaikki toiminnot ovat käytettävissä näppäimistöllä</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🎨</span>
                      <span>Sivustolla on käytetty riittäviä värikontrasteja</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🖼️</span>
                      <span>Kuvilla on asianmukaiset alt-tekstit</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📝</span>
                      <span>Lomakkeet ovat selkeitä ja ohjeistettuja</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📱</span>
                      <span>Sivusto mukautuu eri näyttökokoihin</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-semibold mb-6 text-theme border-b pb-4">Vaihtoehtoiset asiointitavat</h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <p className="menu-description mb-6">
                  Jos et pysty käyttämään verkkosivustoamme, voit asioida kanssamme seuraavilla tavoilla:
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">📞</span>
                    <span>Puhelimitse: {process.env.NEXT_PUBLIC_COMPANY_PHONE}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">📧</span>
                    <span>Sähköpostitse: {process.env.NEXT_PUBLIC_COMPANY_EMAIL}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">🏢</span>
                    <span>Käymällä ravintolassamme: {process.env.NEXT_PUBLIC_COMPANY_ADDRESS}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-semibold mb-6 text-theme border-b pb-4">Palaute ja yhteydenotot</h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <p className="menu-description mb-6">
                  Jos huomaat sivustollamme saavutettavuusongelman tai haluat antaa palautetta saavutettavuudesta, voit ottaa yhteyttä:
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">📧</span>
                    <span>Sähköposti: {process.env.NEXT_PUBLIC_PRIVACY_EMAIL}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">📞</span>
                    <span>Puhelin: {process.env.NEXT_PUBLIC_PRIVACY_PHONE}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-semibold mb-6 text-theme border-b pb-4">Valvontaviranomainen</h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <p className="menu-description mb-6">
                  Jos huomaat sivustolla saavutettavuusongelmia, kerro niistä ensin meille. 
                  Jos et ole tyytyväinen saamaasi vastaukseen tai et saa vastausta lainkaan 
                  kahden viikon aikana, voit tehdä ilmoituksen Etelä-Suomen aluehallintovirastoon.
                </p>
                <div className="space-y-2">
                  <strong className="block text-lg">Valvontaviranomaisen yhteystiedot:</strong>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🏛️</span>
                      <span>Etelä-Suomen aluehallintovirasto</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">👥</span>
                      <span>Saavutettavuuden valvonnan yksikkö</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🌐</span>
                      <span>www.saavutettavuusvaatimukset.fi</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📧</span>
                      <span>saavutettavuus@avi.fi</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📞</span>
                      <span>Puhelinvaihde: 0295 016 000</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold mb-6 text-theme border-b pb-4">Selosteen päivitys</h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <p className="menu-description">
                  Tämä saavutettavuusseloste on päivitetty viimeksi {new Date().toLocaleDateString('fi-FI')}. 
                  Selosteen ajantasaisuus tarkistetaan ja päivitetään tarvittaessa 
                  sivuston muutosten ja saavutettavuusarvioinnin yhteydessä.
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
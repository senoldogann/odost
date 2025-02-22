'use client';

import HeaderMenu from '@/components/HeaderMenu';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function TietosuojaPage() {
  return (
    <div className="min-h-screen bg-theme">
      <HeaderMenu type="RAVINTOLA" />

      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[400px] w-full">
        <Image
          src="/images/privacy-hero.jpg"
          alt="Tietosuoja"
          fill
          sizes="100vw"
          quality={100}
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Tietosuojaseloste</h1>
          <p className="text-xl md:text-2xl max-w-2xl">
            Yksityisyytesi on meille tärkeää. Tutustu tietosuojakäytäntöihimme.
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-semibold mb-6 text-theme border-b pb-4">1. Rekisterinpitäjä</h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <p className="menu-description">
                  <strong className="block text-xl mb-4">{process.env.NEXT_PUBLIC_COMPANY_NAME}</strong>
                  <span className="block mb-2">Y-tunnus: {process.env.NEXT_PUBLIC_COMPANY_Y_TUNNUS}</span>
                  <span className="block mb-2">Osoite: {process.env.NEXT_PUBLIC_COMPANY_ADDRESS}</span>
                  <span className="block mb-2">Sähköposti: {process.env.NEXT_PUBLIC_COMPANY_EMAIL}</span>
                  <span className="block">Puhelin: {process.env.NEXT_PUBLIC_COMPANY_PHONE}</span>
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-semibold mb-6 text-theme border-b pb-4">2. Henkilötietojen käsittelyn tarkoitus</h2>
              <p className="menu-description mb-6">
                Käsittelemme henkilötietoja seuraaviin tarkoituksiin:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <ul className="list-none space-y-3">
                    <li className="flex items-center">
                      <span className="mr-3">📋</span>
                      Pöytävarausten käsittely ja hallinnointi
                    </li>
                    <li className="flex items-center">
                      <span className="mr-3">💬</span>
                      Asiakaspalvelun toteuttaminen
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <ul className="list-none space-y-3">
                    <li className="flex items-center">
                      <span className="mr-3">📱</span>
                      Markkinointi (asiakkaan suostumuksella)
                    </li>
                    <li className="flex items-center">
                      <span className="mr-3">📈</span>
                      Palveluidemme kehittäminen
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-theme">3. Käsiteltävät henkilötiedot</h2>
              <p className="menu-description mb-4">
                Käsittelemme seuraavia henkilötietoja:
              </p>
              <ul className="list-disc pl-6 menu-description space-y-2">
                <li>Nimi</li>
                <li>Sähköpostiosoite</li>
                <li>Puhelinnumero</li>
                <li>Varauksen tiedot (päivämäärä, aika, henkilömäärä)</li>
                <li>Mahdolliset erikoistoiveet tai ruokavaliot</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-theme">4. Evästeiden käyttö</h2>
              <p className="menu-description mb-4">
                Käytämme sivustollamme seuraavia evästeitä:
              </p>
              <ul className="list-disc pl-6 menu-description space-y-2">
                <li>
                  <strong>Välttämättömät evästeet:</strong> Sivuston toiminnan kannalta pakolliset evästeet
                </li>
                <li>
                  <strong>Analytiikkaevästeet:</strong> Google Analytics -palvelun evästeet kävijätilastointia varten
                </li>
                <li>
                  <strong>Markkinointievästeet:</strong> Facebook Pixel -seurantakoodi markkinoinnin kohdentamista varten
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-theme">5. Tietojen säilytysaika</h2>
              <p className="menu-description">
                Säilytämme henkilötietoja vain niin kauan kuin on tarpeen määriteltyjen tarkoitusten toteuttamiseksi 
                tai lakisääteisten velvoitteiden täyttämiseksi. Pöytävarausten tiedot säilytetään 12 kuukautta 
                varauksen päättymisestä.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-theme">6. Rekisteröidyn oikeudet</h2>
              <p className="menu-description mb-4">
                Sinulla on seuraavat oikeudet:
              </p>
              <ul className="list-disc pl-6 menu-description space-y-2">
                <li>Oikeus saada pääsy tietoihin</li>
                <li>Oikeus tietojen oikaisemiseen</li>
                <li>Oikeus tietojen poistamiseen</li>
                <li>Oikeus käsittelyn rajoittamiseen</li>
                <li>Oikeus siirtää tiedot järjestelmästä toiseen</li>
                <li>Oikeus vastustaa tietojen käsittelyä</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-theme">7. Tietojen luovutukset</h2>
              <p className="menu-description">
                Emme luovuta henkilötietoja kolmansille osapuolille ilman lakisääteistä perustetta tai 
                nimenomaista suostumustasi. Tietoja voidaan luovuttaa viranomaisille lakisääteisten 
                velvoitteiden täyttämiseksi.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-theme">8. Tietoturva</h2>
              <p className="menu-description">
                Suojaamme henkilötiedot asianmukaisilla teknisillä ja organisatorisilla toimenpiteillä. 
                Tietoja käsittelevät vain ne henkilöt, joilla on työtehtäviensä vuoksi siihen oikeus.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-semibold mb-6 text-theme border-b pb-4">9. Yhteydenotot</h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <p className="menu-description">
                  Tietosuojaan liittyvissä kysymyksissä voit ottaa yhteyttä:
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <span className="mr-3">📧</span>
                    <span>Sähköposti: {process.env.NEXT_PUBLIC_PRIVACY_EMAIL}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3">📞</span>
                    <span>Puhelin: {process.env.NEXT_PUBLIC_PRIVACY_PHONE}</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold mb-6 text-theme border-b pb-4">10. Muutokset tietosuojaselosteeseen</h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <p className="menu-description">
                  Pidätämme oikeuden muuttaa tätä tietosuojaselostetta. Muutoksista ilmoitetaan 
                  verkkosivuillamme. Tämä tietosuojaseloste on päivitetty viimeksi {new Date().toLocaleDateString('fi-FI')}.
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
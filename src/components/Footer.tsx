'use client';

import { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';

interface FooterData {
  address: string;
  phone: string;
  email: string;
  description: string;
  openingHours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  
}

interface OpeningHours {
  [key: string]: {
    open: string;
    close: string;
  };
}

interface SiteInfo {
  title: string | null;
  logo: string | null;
}

const orderedDays = [
  'maanantai',
  'tiistai',
  'keskiviikko',
  'torstai',
  'perjantai',
  'lauantai',
  'sunnuntai'
];

const groupOpeningHours = (hours: OpeningHours) => {
  const result: { [key: string]: string } = {};
  let currentGroup: { days: string[]; time: string } | null = null;

  orderedDays.forEach((day, index) => {
    if (!hours[day]) return;

    const timeStr = `${hours[day].open} - ${hours[day].close}`;

    if (!currentGroup) {
      currentGroup = { days: [day], time: timeStr };
    } else if (currentGroup.time === timeStr) {
      currentGroup.days.push(day);
    } else {
      // Grubu kaydet ve yeni grup başlat
      const groupKey = currentGroup.days.length > 1
        ? `${currentGroup.days[0]} - ${currentGroup.days[currentGroup.days.length - 1]}`
        : currentGroup.days[0];
      result[groupKey] = currentGroup.time;
      currentGroup = { days: [day], time: timeStr };
    }

    // Son günü kontrol et
    if (index === orderedDays.length - 1 && currentGroup) {
      const groupKey = currentGroup.days.length > 1
        ? `${currentGroup.days[0]} - ${currentGroup.days[currentGroup.days.length - 1]}`
        : currentGroup.days[0];
      result[groupKey] = currentGroup.time;
    }
  });

  return result;
};

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [siteInfo, setSiteInfo] = useState<SiteInfo>({ title: null, logo: null });
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ODOST';

  useEffect(() => {
    fetchFooterData();
    const fetchSiteInfo = async () => {
      try {
        const response = await fetch('/api/header-menu');
        if (!response.ok) throw new Error('Site bilgileri getirilemedi');
        const data = await response.json();
        
        if (data.length > 0) {
          setSiteInfo({
            title: data[0].siteTitle || null,
            logo: data[0].siteLogo || null
          });
        }
      } catch (error) {
        console.error('Site bilgileri getirme hatası:', error);
      }
    };

    fetchSiteInfo();
  }, []);

  const fetchFooterData = async () => {
    try {
      const response = await fetch('/api/footer');
      if (!response.ok) throw new Error('Footer tietoja ei voitu hakea');
      const data = await response.json();
      setFooterData(data);
    } catch (error) {
      console.error('Virhe haettaessa footer-tietoja:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Ladataan...</div>;
  }

  if (!footerData) {
    return null;
  }

  const groupedHours = groupOpeningHours(footerData.openingHours);

  return (
    <footer className="bg-theme">
      {/* İnce çizgi */}
      <div className="h-px w-full border-theme"></div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo ve Açıklama */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-theme">{siteName}</h2>
            <p className="text-sm menu-description">
              {footerData?.description || 'Moderni ravintola- ja baarikokemus Helsingissä'}
            </p>
            <div className="flex space-x-4 pt-4">
              {footerData.socialMedia.facebook && (
                <a
                  href={footerData.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="menu-description hover:text-theme transition-colors"
                >
                  <FaFacebook size={20} />
                </a>
              )}
              {footerData.socialMedia.instagram && (
                <a
                  href={footerData.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="menu-description hover:text-theme transition-colors"
                >
                  <FaInstagram size={20} />
                </a>
              )}
              {footerData.socialMedia.twitter && (
                <a
                  href={footerData.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="menu-description hover:text-theme transition-colors"
                >
                  <FaTwitter size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Yhteystiedot */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-theme">Yhteystiedot</h3>
            <div className="space-y-3 menu-description">
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt className="flex-shrink-0" />
                <span>{footerData.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaPhone className="flex-shrink-0" />
                <span>{footerData.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope className="flex-shrink-0" />
                <span>{footerData.email}</span>
              </div>
            </div>
          </div>

          {/* Aukioloajat */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-theme">Aukioloajat</h3>
            <div className="space-y-2 text-sm">
              {Object.entries(groupedHours).map(([days, hours]) => (
                <div key={days} className="flex gap-8">
                  <span className="menu-description">{days}</span>
                  <span className="text-theme ml-auto">{hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alt bilgi */}
        <div className="mt-12 pt-8 border-theme">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm menu-description">
            <p>&copy; {new Date().getFullYear()} {siteInfo.title || siteName}. Kaikki oikeudet pidätetään.</p>
            <div className="flex space-x-6">
              <Link href="/tietosuoja" className="hover:text-theme transition-colors">Tietosuoja</Link>
              <Link href="/kayttoehdot" className="hover:text-theme transition-colors">Käyttöehdot</Link>
              <Link href="/saavutettavuus" className="hover:text-theme transition-colors">Saavutettavuus</Link>
            </div>
          </div>
          <div className="text-center mt-4 text-sm menu-description">
            <a href="https://www.senoldogan.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-theme transition-colors">
              By Senol Dogan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 
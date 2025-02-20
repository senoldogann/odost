'use client';

import { useState, useEffect } from 'react';
import { FaCookieBite } from 'react-icons/fa';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Çerez onayının daha önce verilip verilmediğini kontrol et
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    // Çerez onayını kaydet
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Sadece gerekli çerezlere izin ver
    localStorage.setItem('cookieConsent', 'minimal');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-theme z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <FaCookieBite className="text-3xl text-theme" />
            <div className="text-sm text-theme">
              <p>
                Käytämme evästeitä parantaaksemme sivuston käyttökokemusta ja analysoidaksemme liikennettä. 
                Voit lukea lisää {' '}
                <a href="/tietosuoja" className="underline hover:text-theme">
                  tietosuojakäytännöstämme
                </a>.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm bg-white dark:bg-black text-theme border border-theme rounded-full hover:bg-theme hover:text-white dark:hover:text-black transition-colors"
            >
              Vain välttämättömät
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm bg-theme text-white dark:text-black rounded-full hover:bg-theme/90 transition-colors"
            >
              Hyväksy kaikki
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
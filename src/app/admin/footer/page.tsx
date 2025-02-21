'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

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

const defaultOpeningHours = {
  maanantai: { open: '11:00', close: '22:00' },
  tiistai: { open: '11:00', close: '22:00' },
  keskiviikko: { open: '11:00', close: '22:00' },
  torstai: { open: '11:00', close: '22:00' },
  perjantai: { open: '11:00', close: '23:00' },
  lauantai: { open: '12:00', close: '23:00' },
  sunnuntai: { open: '12:00', close: '22:00' }
};

const orderedDays = [
  'maanantai',
  'tiistai',
  'keskiviikko',
  'torstai',
  'perjantai',
  'lauantai',
  'sunnuntai'
];

export default function FooterSettings() {
  const { t } = useLanguage();
  const [footerData, setFooterData] = useState<FooterData>({
    address: '',
    phone: '',
    email: '',
    description: '',
    openingHours: defaultOpeningHours,
    socialMedia: {
      facebook: 'https://www.facebook.com/p/Utaj%C3%A4rven-Pizza-Kebab-100057203029423/',
      instagram: 'https://www.instagram.com/odostravintola/',
      twitter: 'https://twitter.com/odostravintola'
    }
  });

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const response = await fetch('/api/footer');
      if (!response.ok) throw new Error(t('admin.footer.fetchError'));
      const data = await response.json();
      
      // Varsayılan sosyal medya değerlerini kontrol et
      const defaultSocialMedia = {
        facebook: 'https://www.facebook.com/p/Utaj%C3%A4rven-Pizza-Kebab-100057203029423/',
        instagram: 'https://www.instagram.com/odostravintola/',
        twitter: 'https://twitter.com/odostravintola'
      };

      setFooterData(data || {
        ...footerData,
        openingHours: defaultOpeningHours,
        socialMedia: data?.socialMedia || defaultSocialMedia
      });
    } catch (error) {
      console.error(t('admin.footer.fetchErrorLog'), error);
      toast.error(t('admin.footer.fetchErrorToast'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(footerData),
      });

      if (!response.ok) throw new Error(t('admin.footer.updateError'));

      toast.success(t('admin.footer.updateSuccess'));
      fetchFooterData();
    } catch (error) {
      console.error(t('admin.footer.updateErrorLog'), error);
      toast.error(t('admin.footer.updateErrorToast'));
    }
  };

  const handleChange = (
    field: keyof FooterData,
    value: string | { [key: string]: { open: string; close: string } } | { facebook: string; instagram: string; twitter: string }
  ) => {
    setFooterData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialMediaChange = (platform: keyof FooterData['socialMedia'], value: string) => {
    setFooterData(prev => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value }
    }));
  };

  const handleTimeChange = (day: string, type: 'open' | 'close', value: string) => {
    setFooterData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: { ...prev.openingHours[day], [type]: value }
      }
    }));
  };

  const getDayTranslation = (day: string): string => {
    const translations: { [key: string]: string } = {
      maanantai: 'Maanantai',
      tiistai: 'Tiistai',
      keskiviikko: 'Keskiviikko',
      torstai: 'Torstai',
      perjantai: 'Perjantai',
      lauantai: 'Lauantai',
      sunnuntai: 'Sunnuntai'
    };
    return translations[day] || day;
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">{t('admin.footer.title')}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div className="bg-white/5 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold mb-4 text-white">{t('admin.footer.contactInfo')}</h2>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">{t('admin.footer.description')}</label>
            <textarea
              value={footerData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">{t('admin.footer.address')}</label>
            <textarea
              value={footerData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">{t('admin.footer.phone')}</label>
            <input
              type="text"
              value={footerData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">{t('admin.footer.email')}</label>
            <input
              type="email"
              value={footerData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
            />
          </div>
        </div>

        {/* Opening Hours */}
        <div className="bg-white/5 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">{t('admin.footer.openingHours')}</h2>
          <div className="space-y-4">
            {orderedDays.map((day) => (
              <div key={day} className="grid grid-cols-3 gap-4 items-center">
                <div className="font-medium text-white">{t(`admin.footer.days.${day}`)}</div>
                <div>
                  <input
                    type="time"
                    value={footerData.openingHours[day].open}
                    onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                  />
                </div>
                <div>
                  <input
                    type="time"
                    value={footerData.openingHours[day].close}
                    onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white/5 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold mb-4 text-white">{t('admin.footer.socialMedia')}</h2>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">{t('admin.footer.facebookUrl')}</label>
            <input
              type="url"
              value={footerData.socialMedia.facebook}
              onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">{t('admin.footer.instagramUrl')}</label>
            <input
              type="url"
              value={footerData.socialMedia.instagram}
              onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">{t('admin.footer.twitterUrl')}</label>
            <input
              type="url"
              value={footerData.socialMedia.twitter}
              onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition-colors"
          >
            {t('admin.common.save')}
          </button>
        </div>
      </form>
    </div>
  );
} 
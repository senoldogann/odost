'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaCog, FaGlobe, FaTwitter, FaFacebook } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';

interface SiteSettings {
  id: string;
  type: 'RAVINTOLA' | 'BAARI';
  isActive: boolean;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  metaTags?: any;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  robotsTxt?: string;
  sitemapXml?: string;
}

export default function SiteSettingsPage() {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<'RAVINTOLA' | 'BAARI'>('RAVINTOLA');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, [selectedType]);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/site-settings?type=${selectedType}`);
      if (!response.ok) throw new Error('Asetusten hakeminen epäonnistui');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Asetusten hakuvirhe:', error);
      toast.error('Asetusten hakeminen epäonnistui');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      const response = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Asetusten päivittäminen epäonnistui');
      toast.success('Asetukset päivitetty onnistuneesti');
    } catch (error) {
      console.error('Asetusten päivitysvirhe:', error);
      toast.error('Asetusten päivittäminen epäonnistui');
    }
  };

  const handleChange = (field: keyof SiteSettings, value: any) => {
    if (!settings) return;
    
    // Özel mantık: isActive ve maintenanceMode için
    if (field === 'isActive' && value === true) {
      setSettings({ ...settings, isActive: true, maintenanceMode: false });
    } else if (field === 'maintenanceMode' && value === true) {
      setSettings({ ...settings, maintenanceMode: true, isActive: false });
    } else {
      setSettings({ ...settings, [field]: value });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>;
  }

  if (!settings) {
    return <div className="p-4">{t('admin.common.error')}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">{t('admin.siteSettings.title')}</h1>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSelectedType('RAVINTOLA')}
              className={`px-4 py-2 rounded-lg ${
                selectedType === 'RAVINTOLA'
                  ? 'bg-blue-600 text-white'
                  : 'bg-black/20 text-white hover:bg-black/30'
              }`}
            >
              {t('admin.siteSettings.restaurant')}
            </button>
            <button
              onClick={() => setSelectedType('BAARI')}
              className={`px-4 py-2 rounded-lg ${
                selectedType === 'BAARI'
                  ? 'bg-blue-600 text-white'
                  : 'bg-black/20 text-white hover:bg-black/30'
              }`}
            >
              {t('admin.siteSettings.bar')}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-xl space-y-6">
          {/* Yleiset asetukset */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2">Perustiedot</h2>
            
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={settings.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-600 bg-black/20"
                />
                <span className="ml-2 text-white">Sivusto aktiivinen</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-600 bg-black/20"
                />
                <span className="ml-2 text-white">Huoltotila</span>
              </label>
            </div>

            {settings.maintenanceMode && (
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Huoltotilan viesti
                </label>
                <textarea
                  value={settings.maintenanceMessage || ''}
                  onChange={(e) => handleChange('maintenanceMessage', e.target.value)}
                  className="w-full px-4 py-2 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  rows={3}
                  placeholder="Sivusto on tilapäisesti huollossa. Palaamme pian!"
                />
              </div>
            )}
          </div>

          {/* SEO asetukset */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2">SEO ja sosiaalinen media</h2>
            
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() => {
                  const titles = selectedType === 'RAVINTOLA' ? [
                    'Moderni ravintola Helsingin sydämessä | ODOST',
                    'Ainutlaatuinen ruokaelämys Helsingissä | ODOST Ravintola',
                    'Gourmet-ravintola Helsinki | Fine Dining ODOST'
                  ] : [
                    'Tunnelmallinen baari Helsingin keskustassa | ODOST',
                    'Cocktail-baari Helsinki | ODOST Bar & Lounge',
                    'Viihtyisä after work -baari Helsinki | ODOST'
                  ];

                  const descriptions = selectedType === 'RAVINTOLA' ? [
                    'Nauti modernista pohjoismaisesta keittiöstä historiallisessa miljöössä. Tuoreet raaka-aineet, innovatiiviset maut ja ainutlaatuinen tunnelma.',
                    'ODOST tarjoaa unohtumattoman fine dining -kokemuksen Helsingin sydämessä. Sesongin parhaat raaka-aineet, taidokas valmistus.',
                    'Koe ainutlaatuinen ruokaelämys Helsingin parhaassa ravintolassa. Palkittu keittiö, ensiluokkainen palvelu ja viihtyisä tunnelma.'
                  ] : [
                    'ODOST Bar tarjoaa laajan valikoiman craft-oluita ja signature-cocktaileja viihtyisässä miljöössä Helsingin keskustassa.',
                    'Nauti ammattitaidolla valmistetuista cocktaileista ja laadukkaista viineistä tyylikkäässä baarissa.',
                    'Helsingin paras after work -paikka. Laaja juomavalikoima, rento tunnelma ja ystävällinen palvelu.'
                  ];

                  const keywords = selectedType === 'RAVINTOLA' ? [
                    'ravintola helsinki, fine dining, gourmet-ravintola, pohjoismainen keittiö, illallisravintola',
                    'laadukas ravintola, helsinki ravintolat, fine dining helsinki, ruokaelämys, michelin-taso',
                    'paras ravintola helsinki, gourmet-ruoka, tasting menu, viinilista, ruoka ja viini'
                  ] : [
                    'baari helsinki, cocktail-baari, craft-oluet, viinibaari, after work',
                    'drinkkibaari, helsinki baarit, cocktails, viinit, yöelämä',
                    'paras baari helsinki, juomat, tunnelmallinen, live-musiikki, viikonloppu'
                  ];

                  const randomIndex = Math.floor(Math.random() * 3);
                  handleChange('title', titles[randomIndex]);
                  handleChange('description', descriptions[randomIndex]);
                  handleChange('keywords', keywords[randomIndex].split(', '));
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Luo SEO ehdotus
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                {t('admin.siteSettings.pageTitle')}
              </label>
              <input
                type="text"
                value={settings.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-2 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                {t('admin.siteSettings.description')}
              </label>
              <textarea
                value={settings.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-4 py-2 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                {t('admin.siteSettings.keywords')}
              </label>
              <input
                type="text"
                value={settings.keywords.join(', ')}
                onChange={(e) => handleChange('keywords', e.target.value.split(',').map(k => k.trim()))}
                className="w-full px-4 py-2 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                placeholder={t('admin.siteSettings.keywords')}
              />
            </div>
          </div>

          {/* Open Graph asetukset */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2">Open Graph asetukset</h2>
            
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() => {
                  const ogContent = selectedType === 'RAVINTOLA' ? {
                    titles: [
                      'ODOST Ravintola - Moderni pohjoismainen keittiö Helsingissä',
                      'Fine Dining elämys ODOST-ravintolassa',
                      'Huippukokin signature-menu ODOST-ravintolassa'
                    ],
                    descriptions: [
                      'Nauti modernista pohjoismaisesta keittiöstä historiallisessa miljöössä. Varaa pöytäsi nyt!',
                      'Koe unohtumaton illallinen Helsingin sydämessä. Sesongin parhaat raaka-aineet.',
                      'Ainutlaatuinen fine dining -kokemus odottaa sinua. Varaa pöytäsi jo tänään!'
                    ],
                    images: [
                      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
                      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
                      'https://images.unsplash.com/photo-1559339352-11d035aa65de'
                    ]
                  } : {
                    titles: [
                      'ODOST Bar - Helsingin tyylikkäin cocktailbaari',
                      'Craft-cocktailit ja tunnelma ODOST Baarissa',
                      'Live-musiikkia ja huippudrinkkejä ODOST Baarissa'
                    ],
                    descriptions: [
                      'Tule nauttimaan kaupungin parhaista cocktaileista ja tunnelmallisesta miljööstä.',
                      'Ammattitaitoiset baarimestarimme loihtivat unohtumattomat juomat.',
                      'Viikonlopun paras tunnelma, live-musiikkia ja signature-drinkkejä.'
                    ],
                    images: [
                      'https://images.unsplash.com/photo-1470337458703-46ad1756a187',
                      'https://images.unsplash.com/photo-1551024709-8f23befc776f',
                      'https://images.unsplash.com/photo-1572116469696-31de0f17cc34'
                    ]
                  };

                  const randomIndex = Math.floor(Math.random() * 3);
                  handleChange('ogTitle', ogContent.titles[randomIndex]);
                  handleChange('ogDescription', ogContent.descriptions[randomIndex]);
                  handleChange('ogImage', ogContent.images[randomIndex]);
                }}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Luo OG ehdotus
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                OG Otsikko
              </label>
              <input
                type="text"
                value={settings.ogTitle || ''}
                onChange={(e) => handleChange('ogTitle', e.target.value)}
                className="w-full px-4 py-2 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                OG Kuvaus
              </label>
              <textarea
                value={settings.ogDescription || ''}
                onChange={(e) => handleChange('ogDescription', e.target.value)}
                className="w-full px-4 py-2 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                OG Kuva URL
              </label>
              <input
                type="url"
                value={settings.ogImage || ''}
                onChange={(e) => handleChange('ogImage', e.target.value)}
                className="w-full px-4 py-2 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Twitter Card asetukset */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2">Twitter Card asetukset</h2>
            
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() => {
                  const twitterContent = selectedType === 'RAVINTOLA' ? {
                    titles: [
                      'Koe ainutlaatuinen makumatka ODOST-ravintolassa 🍽️',
                      'Huippukokin luomukset nyt ODOST-ravintolassa ⭐',
                      'Varaa pöytäsi fine dining -elämykseen 🌟'
                    ],
                    descriptions: [
                      'Tuoreet pohjoismaiset raaka-aineet, innovatiiviset annokset ja täydellinen viiniparitys odottavat sinua.',
                      'Michelin-tason keittiömme tarjoaa unohtumattoman ruokaelämyksen Helsingin sydämessä.',
                      'Koe pohjoismaisen keittiön parhaat puolet modernissa ympäristössä.'
                    ],
                    images: [
                      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c',
                      'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
                      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe'
                    ],
                    cards: ['summary_large_image', 'summary', 'summary_large_image']
                  } : {
                    titles: [
                      'Helsingin tyylikäin cocktailbaari kutsuu 🍸',
                      'After work -tunnelmaa parhaimmillaan 🌆',
                      'Viikonlopun parhaat bileet ODOST Baarissa! 🎉'
                    ],
                    descriptions: [
                      'Koe ainutlaatuiset signature-cocktailimme ja viihtyisä tunnelma.',
                      'Laaja valikoima craft-oluita, huippudrinkkejä ja rentoa meininkiä.',
                      'Live-musiikkia, DJ-settejä ja kaupungin parhaat drinkit.'
                    ],
                    images: [
                      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b',
                      'https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e',
                      'https://images.unsplash.com/photo-1575444758702-4a6b9222336e'
                    ],
                    cards: ['summary_large_image', 'summary', 'summary_large_image']
                  };

                  const randomIndex = Math.floor(Math.random() * 3);
                  handleChange('twitterCard', twitterContent.cards[randomIndex]);
                  handleChange('twitterTitle', twitterContent.titles[randomIndex]);
                  handleChange('twitterDescription', twitterContent.descriptions[randomIndex]);
                  handleChange('twitterImage', twitterContent.images[randomIndex]);
                }}
                className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
              >
                Luo Twitter ehdotus
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Twitter Card tyyppi
              </label>
              <select
                value={settings.twitterCard || 'summary_large_image'}
                onChange={(e) => handleChange('twitterCard', e.target.value)}
                className="w-full px-4 py-2 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400"
              >
                <option value="summary">Summary</option>
                <option value="summary_large_image">Summary Large Image</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Twitter Otsikko
              </label>
              <input
                type="text"
                value={settings.twitterTitle || ''}
                onChange={(e) => handleChange('twitterTitle', e.target.value)}
                className="w-full px-4 py-2 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Twitter Kuvaus
              </label>
              <textarea
                value={settings.twitterDescription || ''}
                onChange={(e) => handleChange('twitterDescription', e.target.value)}
                className="w-full px-4 py-2 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Twitter Kuva URL
              </label>
              <input
                type="url"
                value={settings.twitterImage || ''}
                onChange={(e) => handleChange('twitterImage', e.target.value)}
                className="w-full px-4 py-2 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Analytics asetukset */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2">Analytics</h2>
            
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() => {
                  // Rastgele Google Analytics ID oluştur
                  const gaId = Math.random() > 0.5 
                    ? `UA-${Math.floor(Math.random() * 1000000)}-${Math.floor(Math.random() * 10)}`
                    : `G-${Array.from({length: 10}, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('')}`;
                    
                  // Rastgele Facebook Pixel ID oluştur
                  const fbId = Math.floor(Math.random() * 1000000000000).toString();
                  
                  handleChange('googleAnalyticsId', gaId);
                  handleChange('facebookPixelId', fbId);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Luo Analytics ehdotus
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Google Analytics ID
              </label>
              <input
                type="text"
                value={settings.googleAnalyticsId || ''}
                onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                className="w-full px-4 py-2 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                placeholder="UA-XXXXXXXXX-X tai G-XXXXXXXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Facebook Pixel ID
              </label>
              <input
                type="text"
                value={settings.facebookPixelId || ''}
                onChange={(e) => handleChange('facebookPixelId', e.target.value)}
                className="w-full px-4 py-2 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Lisäasetukset */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2">Lisäasetukset</h2>
            
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() => {
                  const domain = 'https://odost.fi';
                  const currentDate = new Date().toISOString().split('T')[0];
                  
                  const robotsTxt = `# www.robotstxt.org/

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/

# Allow social media crawlers
User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

# Sitemaps
Sitemap: ${domain}/sitemap.xml
`;

                  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${domain}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${domain}/${selectedType.toLowerCase()}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${domain}/menu</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${domain}/varaus</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${domain}/yhteystiedot</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

                  handleChange('robotsTxt', robotsTxt);
                  handleChange('sitemapXml', sitemapXml);
                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Luo robots.txt ja sitemap.xml ehdotus
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                robots.txt sisältö
              </label>
              <textarea
                value={settings.robotsTxt || ''}
                onChange={(e) => handleChange('robotsTxt', e.target.value)}
                className="w-full px-4 py-2 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                rows={5}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                sitemap.xml sisältö
              </label>
              <textarea
                value={settings.sitemapXml || ''}
                onChange={(e) => handleChange('sitemapXml', e.target.value)}
                className="w-full px-4 py-2 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                rows={5}
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('admin.common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Global Prisma Client instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

const defaultSettings = {
  RAVINTOLA: {
    isActive: true,
    maintenanceMode: false,
    title: 'ODOST Ravintola',
    description: 'Moderni ravintola kokemus Helsingissä',
    keywords: ['ravintola', 'ruoka', 'helsinki', 'fine dining', 'pohjoismainen'],
    ogTitle: 'ODOST Ravintola - Moderni makuelämys',
    ogDescription: 'Koe unohtumaton ruokaelämys Helsingin sydämessä',
    ogImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    twitterCard: 'summary_large_image',
    twitterTitle: 'ODOST Ravintola 🍽️',
    twitterDescription: 'Modernia pohjoismaista ruokaa Helsingissä',
    twitterImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
    robotsTxt: `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://odost.fi/sitemap.xml`,
    sitemapXml: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://odost.fi/ravintola</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://odost.fi/ravintola/menu</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://odost.fi/ravintola/varaus</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`
  },
  BAARI: {
    isActive: true,
    maintenanceMode: false,
    title: 'ODOST Baari',
    description: 'Viihtyisä baari Helsingin sydämessä',
    keywords: ['baari', 'cocktails', 'helsinki', 'yöelämä', 'viihde'],
    ogTitle: 'ODOST Baari - Tunnelmallinen kohtaamispaikka',
    ogDescription: 'Nauti laadukkaista juomista ja viihtyisästä tunnelmasta',
    ogImage: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187',
    twitterCard: 'summary_large_image',
    twitterTitle: 'ODOST Baari 🍸',
    twitterDescription: 'Helsingin tyylikkäin cocktailbaari',
    twitterImage: 'https://images.unsplash.com/photo-1551024709-8f23befc776f',
    robotsTxt: `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://odost.fi/sitemap.xml`,
    sitemapXml: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://odost.fi/baari</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://odost.fi/baari/menu</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://odost.fi/baari/tapahtumat</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`
  }
};

// GET - Site ayarlarını getir
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'RAVINTOLA' | 'BAARI' | null;

    if (!type) {
      return NextResponse.json({ error: 'Type parameter is required' }, { status: 400 });
    }

    let settings = await prisma.siteSettings.findFirst({
      where: { type }
    });

    if (!settings) {
      // Varsayılan ayarları oluştur
      settings = await prisma.siteSettings.create({
        data: {
          type,
          ...defaultSettings[type]
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Site ayarlarını güncelle
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { type, id, createdAt, updatedAt, ...settings } = data;

    if (!type || !['RAVINTOLA', 'BAARI'].includes(type)) {
      return NextResponse.json(
        { error: 'Virheellinen tyyppi. Tyypin on oltava RAVINTOLA tai BAARI.' },
        { status: 400 }
      );
    }

    // Zorunlu alanları kontrol et
    const requiredFields = ['title', 'description', 'keywords'];
    const missingFields = requiredFields.filter(field => !settings[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Puuttuvat kentät: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    try {
      // Önce bağlantıyı test et
      await prisma.$connect();

      const updatedSettings = await prisma.siteSettings.upsert({
        where: { type },
        create: { type, ...settings },
        update: settings,
      });

      return NextResponse.json(updatedSettings);
    } catch (dbError) {
      console.error('Tietokantavirhe:', dbError);
      
      // Detaylı hata mesajı
      let errorMessage = 'Tietokantaoperaatio epäonnistui';
      if (dbError instanceof Error) {
        errorMessage += `: ${dbError.message}`;
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Sivustoasetusten päivitysvirhe:', error);
    return NextResponse.json(
      { error: 'Pyynnön käsittelyssä tapahtui virhe' },
      { status: 500 }
    );
  }
}

// POST - Site ayarlarını güncelle (geriye dönük uyumluluk için)
export async function POST(request: Request) {
  return PUT(request);
} 
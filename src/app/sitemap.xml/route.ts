import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Her iki tür için de ayarları al
    const [ravintolaSettings, baariSettings] = await Promise.all([
      prisma.siteSettings.findFirst({ where: { type: 'RAVINTOLA' } }),
      prisma.siteSettings.findFirst({ where: { type: 'BAARI' } })
    ]);

    // Varsayılan sitemap.xml içeriği
    const defaultSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://odost.fi</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    // Her iki ayardan da sitemap.xml içeriğini birleştir
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[ravintolaSettings?.sitemapXml, baariSettings?.sitemapXml]
  .filter(Boolean)
  .map(xml => {
    // XML başlığını ve urlset etiketlerini kaldır
    return xml
      ?.replace(/<?xml.*?>/, '')
      .replace(/<urlset.*?>/, '')
      .replace('</urlset>', '')
      .trim();
  })
  .join('\n')}
</urlset>`;

    return new NextResponse(sitemapXml || defaultSitemapXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap.xml:', error);
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://odost.fi</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`,
      {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600'
        }
      }
    );
  }
}
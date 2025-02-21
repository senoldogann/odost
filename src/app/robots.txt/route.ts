import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst({
      where: { type: 'RAVINTOLA' },
      select: { robotsTxt: true }
    });

    const defaultRobotsTxt = `# www.robotstxt.org/

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

# Allow social media crawlers
User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

# Sitemaps
Sitemap: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/sitemap.xml`;

    return new NextResponse(settings?.robotsTxt || defaultRobotsTxt, {
      headers: { 'content-type': 'text/plain' },
    });
  } catch (error) {
    console.error('robots.txt getirme hatası:', error);
    return new NextResponse('User-agent: *\nAllow: /', {
      headers: { 'content-type': 'text/plain' },
    });
  }
}
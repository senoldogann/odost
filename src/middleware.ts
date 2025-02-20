import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Admin paneline her zaman erişime izin ver
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // API rotalarına her zaman erişime izin ver
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  try {
    // İstek yapılan sayfanın türünü belirle
    let type: 'RAVINTOLA' | 'BAARI' | null = null;

    if (request.nextUrl.pathname.startsWith('/ravintola')) {
      type = 'RAVINTOLA';
    } else if (request.nextUrl.pathname.startsWith('/baari')) {
      type = 'BAARI';
    }

    if (type) {
      // Site ayarlarını kontrol et
      const response = await fetch(`${request.nextUrl.origin}/api/site-settings?type=${type}`);
      const settings = await response.json();

      // Site aktif değilse veya bakım modundaysa
      if (!settings.isActive || settings.maintenanceMode) {
        // Bakım sayfasına yönlendir
        const maintenanceUrl = new URL('/maintenance', request.url);
        maintenanceUrl.searchParams.set('type', type);
        maintenanceUrl.searchParams.set('message', settings.maintenanceMessage || 'Site bakımda');
        return NextResponse.redirect(maintenanceUrl);
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt
     * - sitemap.xml
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}; 
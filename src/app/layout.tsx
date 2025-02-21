import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { prisma } from '@/lib/prisma';

import Script from "next/script";
import "./globals.css";
import CookieConsent from '@/components/CookieConsent';
import Providers from '@/components/Providers';
import { CompanyProvider } from '@/context/CompanyContext';

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

async function getDefaultMetadata() {
  try {
    const restaurantSettings = await prisma.siteSettings.findFirst({
      where: { type: 'RAVINTOLA' }
    });

    return {
      title: restaurantSettings?.title || 'ODOST Ravintola & Baari',
      description: restaurantSettings?.description || 'Moderni ravintola- ja baarikokemus Helsingissä',
      keywords: restaurantSettings?.keywords || ['ravintola', 'baari', 'helsinki'],
      openGraph: {
        title: restaurantSettings?.ogTitle || undefined,
        description: restaurantSettings?.ogDescription || undefined,
        images: restaurantSettings?.ogImage ? [{ url: restaurantSettings.ogImage }] : [],
      },
      twitter: {
        card: restaurantSettings?.twitterCard || 'summary_large_image',
        title: restaurantSettings?.twitterTitle || undefined,
        description: restaurantSettings?.twitterDescription || undefined,
        images: restaurantSettings?.twitterImage ? [restaurantSettings.twitterImage] : [],
      },
    };
  } catch (error) {
    console.error('Metadata getirme hatası:', error);
    return {
      title: 'ODOST Ravintola & Baari',
      description: 'Moderni ravintola- ja baarikokemus Helsingissä',
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getDefaultMetadata();
  return metadata;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Analitik kodları için ayarları getir
  let analyticsSettings;
  try {
    analyticsSettings = await prisma.siteSettings.findFirst({
      where: { type: 'RAVINTOLA' },
      select: {
        googleAnalyticsId: true,
        facebookPixelId: true,
      }
    });
  } catch (error) {
    console.error('Analitik ayarları getirme hatası:', error);
  }

  return (
    <html lang="fi" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        {analyticsSettings?.googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${analyticsSettings.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${analyticsSettings.googleAnalyticsId}');
              `}
            </Script>
          </>
        )}

        {/* Facebook Pixel */}
        {analyticsSettings?.facebookPixelId && (
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${analyticsSettings.facebookPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </head>
      <body className={poppins.className}>
        <Providers>
          <CompanyProvider>
            {children}
            <CookieConsent />
          </CompanyProvider>
        </Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

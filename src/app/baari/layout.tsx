import type { Metadata } from "next";
import prisma from "@/lib/prisma";

async function getBarMetadata() {
  try {
    const settings = await prisma.siteSettings.findFirst({
      where: { type: 'BAARI' }
    });

    if (!settings) {
      return {
        title: 'ODOST Baari',
        description: 'Moderni baari kokemus Helsingissä',
      };
    }

    return {
      title: settings.title,
      description: settings.description,
      keywords: settings.keywords,
      openGraph: {
        title: settings.ogTitle || settings.title,
        description: settings.ogDescription || settings.description,
        images: settings.ogImage ? [{ url: settings.ogImage }] : [],
      },
      twitter: {
        card: settings.twitterCard || 'summary_large_image',
        title: settings.twitterTitle || settings.title,
        description: settings.twitterDescription || settings.description,
        images: settings.twitterImage ? [settings.twitterImage] : [],
      },
    };
  } catch (error) {
    console.error('Baari metadata getirme hatası:', error);
    return {
      title: 'ODOST Baari',
      description: 'Moderni baari kokemus Helsingissä',
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getBarMetadata();
  return metadata;
}

export default function BarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 
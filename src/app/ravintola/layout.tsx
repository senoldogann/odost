import type { Metadata } from "next";
import prisma from "@/lib/prisma";

async function getRestaurantMetadata() {
  try {
    const settings = await prisma.siteSettings.findFirst({
      where: { type: 'RAVINTOLA' }
    });

    if (!settings) {
      return {
        title: 'ODOST Ravintola',
        description: 'Moderni ravintola kokemus Helsingissä',
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
    console.error('Ravintola metadata getirme hatası:', error);
    return {
      title: 'ODOST Ravintola',
      description: 'Moderni ravintola kokemus Helsingissä',
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getRestaurantMetadata();
  return metadata;
}

export default function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 
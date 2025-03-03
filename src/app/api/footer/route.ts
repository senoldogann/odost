import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


const defaultOpeningHours = {
  maanantai: { open: '11:00', close: '22:00' },
  tiistai: { open: '11:00', close: '22:00' },
  keskiviikko: { open: '11:00', close: '22:00' },
  torstai: { open: '11:00', close: '22:00' },
  perjantai: { open: '11:00', close: '23:00' },
  lauantai: { open: '12:00', close: '23:00' },
  sunnuntai: { open: '12:00', close: '22:00' }
};

export async function GET(request: Request) {
  try {
    const footer = await prisma.footer.findFirst();
    
    if (!footer) {
      const newFooter = await prisma.footer.create({
        data: {
          address: process.env.SITE_ADDRESS || 'Mannerheimintie 100, 00100 Helsinki',
          phone: process.env.SITE_PHONE || '+358 50 123 4567',
          email: process.env.SITE_EMAIL || 'info@odost.fi',
          description: 'Moderni ravintola- ja baarikokemus Oulussa',
          openingHours: defaultOpeningHours,
          socialMedia: {
            facebook: 'https://www.facebook.com/p/Utaj%C3%A4rven-Pizza-Kebab-100057203029423/',
            instagram: 'https://www.instagram.com/odostravintola/',
            twitter: 'https://twitter.com/odostravintola',
          }
        }
      });
      return NextResponse.json(newFooter);
    }

    // Eğer openingHours boşsa, varsayılan değerleri kullan
    if (!footer.openingHours || Object.keys(footer.openingHours).length === 0) {
      const updatedFooter = await prisma.footer.update({
        where: { id: footer.id },
        data: {
          openingHours: defaultOpeningHours
        }
      });
      return NextResponse.json(updatedFooter);
    }

    return NextResponse.json(footer);
  } catch (error) {
    console.error('Footer tietoja ei voitu hakea:', error);
    return NextResponse.json(
      { error: 'Footer tietoja ei voitu hakea' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const footer = await prisma.footer.upsert({
      where: { id: body.id || '' },
      update: {
        address: body.address,
        phone: body.phone,
        email: body.email,
        description: body.description,
        openingHours: body.openingHours || defaultOpeningHours,
        socialMedia: body.socialMedia || {
          facebook: 'https://www.facebook.com/p/Utaj%C3%A4rven-Pizza-Kebab-100057203029423/',
          instagram: 'https://www.instagram.com/odostravintola/',
          twitter: 'https://twitter.com/odostravintola'
        }
      },
      create: {
        address: body.address || process.env.SITE_ADDRESS || '',
        phone: body.phone || process.env.SITE_PHONE || '',
        email: body.email || process.env.SITE_EMAIL || '',
        description: body.description || 'Moderni ravintola- ja baarikokemus Helsingissä',
        openingHours: body.openingHours || defaultOpeningHours,
        socialMedia: body.socialMedia || {
          facebook: 'https://www.facebook.com/p/Utaj%C3%A4rven-Pizza-Kebab-100057203029423/',
          instagram: 'https://www.instagram.com/odostravintola/',
          twitter: 'https://twitter.com/odostravintola'
        }
      }
    });

    return NextResponse.json(footer);
  } catch (error) {
    console.error('Footer tietoja ei voitu päivittää:', error);
    return NextResponse.json(
      { error: 'Footer tietoja ei voitu päivittää' },
      { status: 500 }
    );
  }
} 
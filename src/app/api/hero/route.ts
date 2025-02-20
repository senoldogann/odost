import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

type MenuType = 'RAVINTOLA' | 'BAARI';

// GET - Hero section verilerini getir
export async function GET(request: Request) {
  try {
    console.log('GET request started');
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as MenuType | null;

    console.log('Query params:', { type });

    const where: any = {};
    if (type && ['RAVINTOLA', 'BAARI'].includes(type)) {
      where.type = type;
    }

    console.log('Prisma query:', { where });

    // Prisma bağlantısını kontrol et
    await prisma.$connect();
    console.log('Database connected successfully');

    const heroSections = await prisma.heroSection.findMany({
      where,
      orderBy: { updatedAt: 'desc' }
    });
    
    console.log('Fetched hero sections:', heroSections);

    // Eğer hiç hero section bulunamazsa, varsayılan bir tane oluştur
    if (heroSections.length === 0 && type) {
      const defaultHeroSection = await prisma.heroSection.create({
        data: {
          title: type === 'RAVINTOLA' ? 'Tervetuloa Ravintolaan' : 'Tervetuloa Baariin',
          subtitle: type === 'RAVINTOLA' ? 'Nauti herkullisesta ruoasta' : 'Nauti tunnelmallisesta baarista',
          imageUrl: type === 'RAVINTOLA' ? '/restaurant-hero.jpg' : '/bar-hero.jpg',
          type: type,
          isActive: true
        }
      });
      return NextResponse.json([defaultHeroSection]);
    }

    return NextResponse.json(heroSections);
  } catch (error) {
    console.error('Detailed GET error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        error: 'Hero-osion tietojen hakeminen epäonnistui',
        details: error instanceof Error ? error.message : 'Tuntematon virhe'
      },
      { status: 500 }
    );
  } finally {
    // Bağlantıyı kapat
    await prisma.$disconnect();
    console.log('Database disconnected');
  }
}

// POST - Yeni hero section ekle
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.title || !body.imageUrl || !body.type) {
      return NextResponse.json(
        { error: 'Otsikko, kuvan URL ja tyyppi ovat pakollisia' },
        { status: 400 }
      );
    }

    if (!['RAVINTOLA', 'BAARI'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Virheellinen tyyppi. Sallitut arvot: RAVINTOLA, BAARI' },
        { status: 400 }
      );
    }

    const heroSection = await prisma.heroSection.create({
      data: {
        title: body.title,
        subtitle: body.subtitle,
        imageUrl: body.imageUrl,
        type: body.type as MenuType,
        isActive: true,
        buttonText: body.buttonText,
        buttonUrl: body.buttonUrl
      }
    });

    return NextResponse.json(heroSection);
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Hero-osion luominen epäonnistui' },
      { status: 500 }
    );
  }
}

// PUT - Hero section güncelle
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'ID on pakollinen' },
        { status: 400 }
      );
    }

    if (body.type && !['RAVINTOLA', 'BAARI'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Virheellinen tyyppi. Sallitut arvot: RAVINTOLA, BAARI' },
        { status: 400 }
      );
    }

    const heroSection = await prisma.heroSection.update({
      where: { id: body.id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        imageUrl: body.imageUrl,
        type: body.type as MenuType,
        isActive: body.isActive,
        buttonText: body.buttonText,
        buttonUrl: body.buttonUrl
      }
    });

    return NextResponse.json(heroSection);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Hero-osion päivittäminen epäonnistui' },
      { status: 500 }
    );
  }
}

// DELETE - Hero section sil
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID on pakollinen' },
        { status: 400 }
      );
    }

    await prisma.heroSection.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Hero-osion poistaminen epäonnistui' },
      { status: 500 }
    );
  }
} 
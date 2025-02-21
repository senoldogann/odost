import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


// GET - Atmosfer etkinliklerini getir
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'RAVINTOLA' | 'BAARI' | null;

    if (!type) {
      return NextResponse.json({ error: 'Type parametresi gerekli' }, { status: 400 });
    }

    const events = await prisma.atmosphereEvent.findMany({
      where: {
        type,
        isActive: true
      },
      orderBy: {
        order: 'asc'
      }
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Atmosfer etkinlikleri getirme hatası:', error);
    return NextResponse.json(
      { error: 'Etkinlikler getirilemedi' },
      { status: 500 }
    );
  }
}

// POST - Yeni atmosfer etkinliği ekle
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = await prisma.atmosphereEvent.create({
      data: {
        title: body.title,
        description: body.description,
        schedule: body.schedule,
        type: body.type,
        isActive: body.isActive ?? true,
        order: parseInt(body.order) || 0,
        imageUrl: body.imageUrl
      }
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Etkinlik oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Etkinlik oluşturulamadı' },
      { status: 500 }
    );
  }
}

// PUT - Atmosfer etkinliğini güncelle
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'ID gerekli' },
        { status: 400 }
      );
    }

    const event = await prisma.atmosphereEvent.update({
      where: { id: body.id },
      data: {
        title: body.title,
        description: body.description,
        schedule: body.schedule,
        type: body.type,
        isActive: body.isActive,
        order: parseInt(body.order) || 0,
        imageUrl: body.imageUrl
      }
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Etkinlik güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Etkinlik güncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE - Atmosfer etkinliğini sil
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID gerekli' },
        { status: 400 }
      );
    }

    await prisma.atmosphereEvent.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Etkinlik silme hatası:', error);
    return NextResponse.json(
      { error: 'Etkinlik silinemedi' },
      { status: 500 }
    );
  }
} 
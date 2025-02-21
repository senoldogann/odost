import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Tüm galeri resimlerini getir
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const where: any = {};
    if (type) where.type = type;

    const images = await prisma.gallery.findMany({ where });
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: 'Galeri resimleri getirilemedi' }, { status: 500 });
  }
}

// POST - Yeni galeri resmi ekle
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const image = await prisma.gallery.create({
      data: {
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        type: body.type,
        isActive: true
      }
    });
    return NextResponse.json(image);
  } catch (error) {
    return NextResponse.json({ error: 'Resim eklenemedi' }, { status: 500 });
  }
}

// PUT - Galeri resmini güncelle
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const image = await prisma.gallery.update({
      where: { id: body.id },
      data: {
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        type: body.type,
        isActive: body.isActive
      }
    });
    return NextResponse.json(image);
  } catch (error) {
    return NextResponse.json({ error: 'Resim güncellenemedi' }, { status: 500 });
  }
}

// DELETE - Galeri resmini sil
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
    }
    await prisma.gallery.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Resim silinemedi' }, { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Tüm galeri öğelerini getir
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const where: any = {};
    if (type) where.type = type;

    const galleryItems = await prisma.gallery.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(galleryItems);
  } catch (error) {
    return NextResponse.json(
      { error: 'Gallerian hakeminen epäonnistui' },
      { status: 500 }
    );
  }
}

// POST - Yeni galeri öğesi ekle
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.imageUrl || !body.type) {
      return NextResponse.json(
        { error: 'Kaikki pakolliset kentät on täytettävä' },
        { status: 400 }
      );
    }

    const galleryItem = await prisma.gallery.create({
      data: {
        title: body.title,
        description: body.description || '',
        imageUrl: body.imageUrl,
        type: body.type,
        isActive: true
      }
    });

    return NextResponse.json(galleryItem);
  } catch (error) {
    return NextResponse.json(
      { error: 'Gallerian lisääminen epäonnistui' },
      { status: 500 }
    );
  }
}

// PUT - Galeri öğesini güncelle
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: 'ID vaaditaan' },
        { status: 400 }
      );
    }

    const galleryItem = await prisma.gallery.update({
      where: { id: body.id },
      data: {
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        type: body.type,
        isActive: body.isActive
      }
    });

    return NextResponse.json(galleryItem);
  } catch (error) {
    return NextResponse.json(
      { error: 'Gallerian päivittäminen epäonnistui' },
      { status: 500 }
    );
  }
}

// DELETE - Galeri öğesini sil
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID vaaditaan' },
        { status: 400 }
      );
    }

    await prisma.gallery.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Gallerian poistaminen epäonnistui' },
      { status: 500 }
    );
  }
} 
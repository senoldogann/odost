import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { MenuType } from '@prisma/client';

// GET - Header menü öğelerini getir
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as MenuType | null;

    // Tüm aktif menü öğelerini getir
    const menuItems = await prisma.headerMenu.findMany({
      where: {
        isActive: true,
        ...(type ? { type } : {})
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Header menü getirme hatası:', error);
    return NextResponse.json(
      { error: 'Valikon kohteiden hakeminen epäonnistui' },
      { status: 500 }
    );
  }
}

// POST - Yeni menü öğesi ekle
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.path || !body.type) {
      return NextResponse.json(
        { error: 'Otsikko, polku ja tyyppi ovat pakollisia' },
        { status: 400 }
      );
    }

    const menuItem = await prisma.headerMenu.create({
      data: {
        title: body.title,
        path: body.path,
        order: body.order || 0,
        type: body.type,
        parentId: body.parentId || null,
        isActive: true,
        siteTitle: body.siteTitle || null,
        siteLogo: body.siteLogo || null
      }
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('Header menü ekleme hatası:', error);
    return NextResponse.json(
      { error: 'Valikon kohteen lisääminen epäonnistui' },
      { status: 500 }
    );
  }
}

// PUT - Menü öğesini güncelle
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: 'ID on pakollinen' },
        { status: 400 }
      );
    }

    const menuItem = await prisma.headerMenu.update({
      where: { id: body.id },
      data: {
        title: body.title,
        path: body.path,
        order: body.order,
        type: body.type,
        parentId: body.parentId || null,
        isActive: body.isActive,
        siteTitle: body.siteTitle || null,
        siteLogo: body.siteLogo || null
      }
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('Header menü güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Valikon kohteen päivittäminen epäonnistui' },
      { status: 500 }
    );
  }
}

// DELETE - Menü öğesini sil
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

    await prisma.headerMenu.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Header menü silme hatası:', error);
    return NextResponse.json(
      { error: 'Valikon kohteen poistaminen epäonnistui' },
      { status: 500 }
    );
  }
} 
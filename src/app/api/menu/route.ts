import { prisma } from '@/lib/prisma';

import { NextRequest, NextResponse } from 'next/server'
import { MenuType } from '@prisma/client'

// GET - Menü öğelerini getir
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as MenuType
    const featured = searchParams.get('featured') === 'true'

    if (!type) {
      console.error('Type parametresi eksik');
      return NextResponse.json({ error: 'Type parametresi gerekli' }, { status: 400 })
    }

    const items = await prisma.menuItem.findMany({
      where: {
        type,
        isActive: true,
        ...(featured ? { isFeatured: true } : {})
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Menu items getirme hatası:', error)
    return NextResponse.json({ 
      error: 'Menü öğeleri getirilemedi',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST - Yeni menü öğesi ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Eğer body bir array ise, toplu ekleme yapılıyor demektir
    if (Array.isArray(body)) {
      const menuItems = await prisma.menuItem.createMany({
        data: body.map(item => ({
          name: item.name,
          description: item.description,
          price: parseFloat(item.price),
          familyPrice: item.familyPrice ? parseFloat(item.familyPrice) : null,
          category: item.category,
          image: item.image,
          type: item.type,
          isActive: item.isActive,
          isFeatured: item.isFeatured || false,
          allergens: item.allergens || [],
          order: item.order || 0
        }))
      });
      return NextResponse.json(menuItems);
    }

    // Tek öğe ekleme
    const { name, description, price, familyPrice, category, image, type, isActive, isFeatured, allergens, order } = body;
    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        familyPrice: familyPrice ? parseFloat(familyPrice) : null,
        category,
        image,
        type,
        isActive,
        isFeatured,
        allergens,
        order
      }
    });
    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('Menü öğesi oluşturulurken hata:', error);
    return NextResponse.json({ error: 'Menü öğesi oluşturulamadı' }, { status: 500 });
  }
}

// PUT - Menü öğesini güncelle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, price, familyPrice, category, image, type, isActive, isFeatured, allergens, order } = body;

    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        familyPrice: familyPrice ? parseFloat(familyPrice) : null,
        category,
        image,
        type,
        isActive,
        isFeatured,
        allergens,
        order
      }
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('Menü öğesi güncellenirken hata:', error);
    return NextResponse.json({ error: 'Menü öğesi güncellenemedi' }, { status: 500 });
  }
}

// DELETE - Menü öğesini sil
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      console.error('ID parametresi eksik')
      return NextResponse.json({ error: 'ID parametresi gerekli' }, { status: 400 })
    }

    await prisma.menuItem.delete({
      where: { id }
    })
    
    console.log('Öğe silindi:', id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Menu item silme hatası:', error)
    return NextResponse.json({ 
      error: 'Menu item silinemedi',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 
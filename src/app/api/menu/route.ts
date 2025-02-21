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
    const data = await request.json()
    console.log('Yeni menü öğesi ekleniyor:', data)
    
    const newItem = await prisma.menuItem.create({
      data
    })
    
    console.log('Yeni menü öğesi eklendi:', newItem)
    return NextResponse.json(newItem)
  } catch (error) {
    console.error('Menu item oluşturma hatası:', error)
    return NextResponse.json({ 
      error: 'Menu item oluşturulamadı',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PUT - Menü öğesini güncelle
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    console.log('Güncellenecek veri:', data)

    if (!data.id) {
      console.error('ID eksik')
      return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
    }

    const { id, ...updateData } = data
    
    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data: updateData
    })

    console.log('Öğe güncellendi:', updatedItem)
    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Menu item güncelleme hatası:', error)
    return NextResponse.json({ 
      error: 'Menu item güncellenemedi',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
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
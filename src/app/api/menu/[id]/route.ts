import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT - Menü öğesini güncelle
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();

    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data: {
        isActive: data.isActive,
        isFeatured: data.isFeatured
      }
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Menü öğesi güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Menü öğesi güncellenemedi' },
      { status: 500 }
    );
  }
} 
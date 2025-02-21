import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await prisma.user.update({
      where: {
        email: 'admin@odost.fi'
      },
      data: {
        password: hashedPassword
      }
    });

    return NextResponse.json({ message: 'Salasana päivitetty onnistuneesti' });
  } catch (error) {
    console.error('Salasanan päivitysvirhe:', error);
    return NextResponse.json(
      { error: 'Salasanan päivitys epäonnistui' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, currentPassword, newPassword } = body;

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Kaikki kentät ovat pakollisia' },
        { status: 400 }
      );
    }

    // Käyttäjän haku
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Käyttäjää ei löydy' },
        { status: 404 }
      );
    }

    // Nykyisen salasanan tarkistus
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Nykyinen salasana on virheellinen' },
        { status: 400 }
      );
    }

    // Uuden salasanan validointi
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Uuden salasanan on oltava vähintään 6 merkkiä pitkä' },
        { status: 400 }
      );
    }

    // Uuden salasanan hashaus
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Salasanan päivitys
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
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
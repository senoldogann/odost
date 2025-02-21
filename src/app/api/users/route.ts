import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import bcrypt from 'bcryptjs';

// POST - Yeni kullanıcı oluştur
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // reCAPTCHA doğrulama
    const recaptchaVerification = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${body.recaptchaToken}`,
    });

    const recaptchaData = await recaptchaVerification.json();

    if (!recaptchaData.success) {
      return new Response(JSON.stringify({ error: 'reCAPTCHA doğrulama başarısız' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Kullanıcının zaten var olup olmadığını kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (existingUser) {
      // Eğer kullanıcı zaten varsa, mevcut kullanıcıyı döndür
      return NextResponse.json(existingUser);
    }

    // Geçici şifreyi hashle
    const hashedPassword = await bcrypt.hash(body.password || 'temporary', 10);

    // Yeni kullanıcı oluştur
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: 'USER'
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Käyttäjän luomisvirhe:', error);
    return NextResponse.json(
      { error: 'Käyttäjän luominen epäonnistui' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '@/lib/email';

const prisma = new PrismaClient();

// GET - Tüm mesajları getir
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const where: any = {};
    if (type && type !== 'ALL') where.type = type;
    if (status && status !== 'ALL') where.status = status;

    const messages = await prisma.contactForm.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Mesajlar getirilemedi' }, { status: 500 });
  }
}

// POST - Yeni mesaj ekle
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = await prisma.contactForm.create({
      data: {
        name: body.name,
        email: body.email,
        subject: body.subject,
        message: body.message,
        type: body.type,
        status: 'PENDING'
      }
    });

    // Otomatik yanıt e-postası gönder
    await sendEmail({
      to: body.email,
      subject: 'Viestisi on vastaanotettu - ODOST Ravintola & Baari',
      text: `Hei ${body.name},\n\nKiitos yhteydenotostasi. Olemme vastaanottaneet viestisi ja käsittelemme sen mahdollisimman pian.\n\nOtamme sinuun yhteyttä pian.\n\nYstävällisin terveisin,\nODOST Ravintola & Baari Tiimi`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Viestisi on vastaanotettu</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1a1a1a;">Hei ${body.name},</h2>
              
              <p>Kiitos yhteydenotostasi. Olemme vastaanottaneet viestisi ja käsittelemme sen mahdollisimman pian.</p>
              
              <p>Viestisi aihe: <strong>${body.subject}</strong></p>
              
              <p>Otamme sinuun yhteyttä pian.</p>
              
              <div style="margin-top: 40px;">
                <p>Ystävällisin terveisin,<br>ODOST Ravintola & Baari Tiimi</p>
              </div>
              
              <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;">
              
              <p style="color: #666; font-size: 12px; margin-top: 20px;">
                Tämä on automaattinen vastaus. Älä vastaa tähän viestiin.
              </p>
            </div>
          </body>
        </html>
      `
    });

    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: 'Mesaj eklenemedi' }, { status: 500 });
  }
}

// PUT - Mesaj durumunu güncelle
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const message = await prisma.contactForm.update({
      where: { id: body.id },
      data: {
        status: body.status
      }
    });
    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: 'Mesaj güncellenemedi' }, { status: 500 });
  }
}

// DELETE - Mesajı sil
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
    }
    await prisma.contactForm.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Mesaj silinemedi' }, { status: 500 });
  }
} 
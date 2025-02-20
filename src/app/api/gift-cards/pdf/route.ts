import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { renderToBuffer } from '@react-pdf/renderer';
import GiftCardPDF from '@/components/GiftCardPDF';
import { GiftCard } from '@prisma/client';
import QRCode from 'qrcode';

type GiftCardWithUser = GiftCard & {
  user: {
    name: string;
    email: string;
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID on pakollinen' }, { status: 400 });
    }

    // Lahjakortti bilgilerini getir
    const giftCard = await prisma.giftCard.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    }) as GiftCardWithUser | null;

    if (!giftCard) {
      return NextResponse.json({ error: 'Lahjakorttia ei löytynyt' }, { status: 404 });
    }

    // Footer bilgilerini getir
    const footer = await prisma.footer.findFirst();

    // QR kodu oluştur
    const qrCodeDataUrl = await QRCode.toDataURL(giftCard.code, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    const formattedGiftCard = {
      code: giftCard.code,
      amount: giftCard.amount,
      createdAt: giftCard.createdAt.toISOString(),
      qrCode: qrCodeDataUrl,
      user: {
        name: giftCard.user.name,
        email: giftCard.user.email
      },
      companyInfo: {
        name: process.env.SITE_COMPANY_NAME || 'ODOST Ravintola & Baari Oy',
        address: footer?.address || process.env.SITE_ADDRESS || '',
        phone: footer?.phone || process.env.SITE_PHONE || '',
        email: footer?.email || process.env.SITE_EMAIL || '',
        logo: process.env.SITE_LOGO_URL || '/logo.png'
      }
    };

    const pdfDoc = GiftCardPDF({ giftCard: formattedGiftCard });
    const buffer = await renderToBuffer(pdfDoc);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=lahjakortti-${giftCard.code}.pdf`
      }
    });
  } catch (error) {
    console.error('PDF luontivirhe:', error);
    return NextResponse.json(
      { error: 'PDF:n luominen epäonnistui' },
      { status: 500 }
    );
  }
} 
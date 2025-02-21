import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { sendEmail } from '@/lib/email';
import crypto from 'crypto';
import QRCode from 'qrcode';

// Güvenlik anahtarı oluşturma fonksiyonu
function generateSecureCode(): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// QR kod oluşturma fonksiyonu
async function generateQRCode(code: string): Promise<string> {
  const qrCodeDataUrl = await QRCode.toDataURL(code, {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });
  return qrCodeDataUrl;
}

// GET - Tüm hediye kartlarını getir
export async function GET() {
  try {
    const giftCards = await prisma.giftCard.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(giftCards);
  } catch (error) {
    console.error('Lahjakorttien hakuvirhe:', error);
    return NextResponse.json(
      { error: 'Lahjakorttien hakeminen epäonnistui' },
      { status: 500 }
    );
  }
}

// POST - Yeni hediye kartı oluştur
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.userName || !body.userEmail || !body.amount) {
      return NextResponse.json(
        { error: 'Kaikki kentät ovat pakollisia' },
        { status: 400 }
      );
    }

    // Kullanıcıyı bul veya oluştur
    let user = await prisma.user.findUnique({
      where: { email: body.userEmail }
    });

    if (!user) {
      // Geçici şifre oluştur
      const tempPassword = Math.random().toString(36).slice(-8);
      
      user = await prisma.user.create({
        data: {
          name: body.userName,
          email: body.userEmail,
          password: tempPassword,
          role: 'USER'
        }
      });
    }

    // Güvenli kod oluştur
    const secureCode = generateSecureCode();

    // Hediye kartını oluştur
    const giftCard = await prisma.giftCard.create({
      data: {
        code: secureCode,
        amount: parseFloat(body.amount.toString()),
        balance: parseFloat(body.amount.toString()),
        isActive: true,
        userId: user.id
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    // QR kodu oluştur
    const qrCodeDataUrl = await generateQRCode(secureCode);

    // E-posta gönder
    await sendEmail({
      to: user.email,
      subject: `Lahjakortti - ${process.env.SITE_NAME}`,
      text: `
        Hei ${user.name},

        Olet saanut lahjakortin arvoltaan ${giftCard.amount} €.
        
        Koodi: ${giftCard.code}
        
        Voit käyttää lahjakorttia ravintolassamme näyttämällä QR-koodin tai syöttämällä koodin.
        
        Ystävällisin terveisin,
        ${process.env.SITE_TEAM_NAME}
      `,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Lahjakortti</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1a1a1a;">Hei ${user.name},</h2>
              
              <p>Olet saanut lahjakortin arvoltaan <strong>${giftCard.amount} €</strong>.</p>
              
              <p style="background-color: #f5f5f5; padding: 10px; border-radius: 5px;">
                Koodi: <strong>${giftCard.code}</strong>
              </p>

              <div style="text-align: center; margin: 20px 0;">
                <img src="${qrCodeDataUrl}" alt="QR-koodi" style="max-width: 200px;">
              </div>
              
              <p>Voit käyttää lahjakorttia ravintolassamme näyttämällä QR-koodin tai syöttämällä koodin.</p>
              
              <div style="margin-top: 40px;">
                <p>Ystävällisin terveisin,<br>${process.env.SITE_TEAM_NAME}</p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    return NextResponse.json(giftCard);
  } catch (error) {
    console.error('Lahjakortin luontivirhe:', error);
    return NextResponse.json(
      { error: 'Lahjakorttia ei voitu luoda' },
      { status: 500 }
    );
  }
}

// PUT - Hediye kartını güncelle
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'ID gerekli' },
        { status: 400 }
      );
    }

    // Mevcut kartı kontrol et
    const existingCard = await prisma.giftCard.findUnique({
      where: { id: body.id }
    });

    if (!existingCard) {
      return NextResponse.json(
        { error: 'Hediye kartı bulunamadı' },
        { status: 404 }
      );
    }

    // Bakiye kontrolü
    if (body.balance < 0) {
      return NextResponse.json(
        { error: 'Bakiye sıfırdan küçük olamaz' },
        { status: 400 }
      );
    }

    const giftCard = await prisma.giftCard.update({
      where: { id: body.id },
      data: {
        balance: body.balance,
        isActive: body.isActive
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    // Bakiye değişikliği durumunda e-posta gönder
    if (body.balance !== existingCard.balance) {
      const user = await prisma.user.findUnique({
        where: { id: existingCard.userId }
      });

      if (user) {
        await sendEmail({
          to: user.email,
          subject: `Lahjakortin saldo päivitetty - ${process.env.SITE_NAME}`,
          text: `
            Hei ${user.name},

            Lahjakorttisi saldo on päivitetty.
            
            Uusi saldo: ${giftCard.balance} €
            Lahjakortin koodi: ${giftCard.code}
            
            Ystävällisin terveisin,
            ${process.env.SITE_TEAM_NAME}
          `,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <title>Lahjakortin saldo päivitetty</title>
              </head>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #1a1a1a;">Hei ${user.name},</h2>
                  
                  <p>Lahjakorttisi saldo on päivitetty.</p>
                  
                  <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 0;">Uusi saldo: <strong>${giftCard.balance} €</strong></p>
                    <p style="margin: 10px 0 0; font-family: monospace;">Koodi: ${giftCard.code}</p>
                  </div>
                  
                  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p>Ystävällisin terveisin,<br>${process.env.SITE_TEAM_NAME}</p>
                  </div>
                  
                  <div style="margin-top: 40px; font-size: 12px; color: #666;">
                    <p>${process.env.SITE_COMPANY_NAME}<br>
                    ${process.env.SITE_ADDRESS}<br>
                    Puh: ${process.env.SITE_PHONE}</p>
                  </div>
                </div>
              </body>
            </html>
          `
        });
      }
    }

    return NextResponse.json(giftCard);
  } catch (error) {
    console.error('Lahjakortin päivitysvirhe:', error);
    return NextResponse.json(
      { error: 'Lahjakorttia ei voitu päivittää' },
      { status: 500 }
    );
  }
}

// DELETE - Hediye kartını sil
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

    // Kartı ve kullanıcı bilgilerini al
    const giftCard = await prisma.giftCard.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    });

    if (!giftCard) {
      return NextResponse.json({ error: 'Hediye kartı bulunamadı' }, { status: 404 });
    }

    // Kartı sil
    await prisma.giftCard.delete({
      where: { id }
    });

    // Kullanıcıya bilgilendirme e-postası gönder
    if (giftCard.user) {
      await sendEmail({
        to: giftCard.user.email,
        subject: `Lahjakortti poistettu - ${process.env.SITE_NAME}`,
        text: `
          Hei ${giftCard.user.name},

          Lahjakorttisi (koodi: ${giftCard.code}) on poistettu järjestelmästämme.
          
          Jos sinulla on kysyttävää, ota yhteyttä asiakaspalveluumme.
          
          Ystävällisin terveisin,
          ${process.env.SITE_TEAM_NAME}
        `,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Lahjakortti poistettu</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #1a1a1a;">Hei ${giftCard.user.name},</h2>
                
                <p>Lahjakorttisi (koodi: ${giftCard.code}) on poistettu järjestelmästämme.</p>
                
                <p>Jos sinulla on kysyttävää, ota yhteyttä asiakaspalveluumme.</p>
                
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                  <p>Ystävällisin terveisin,<br>${process.env.SITE_TEAM_NAME}</p>
                </div>
                
                <div style="margin-top: 40px; font-size: 12px; color: #666;">
                  <p>${process.env.SITE_COMPANY_NAME}<br>
                  ${process.env.SITE_ADDRESS}<br>
                  Puh: ${process.env.SITE_PHONE}</p>
                </div>
              </div>
            </body>
          </html>
        `
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lahjakortin poistovirhe:', error);
    return NextResponse.json(
      { error: 'Lahjakorttia ei voitu poistaa' },
      { status: 500 }
    );
  }
} 
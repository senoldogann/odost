import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

// E-posta gönderimi için transporter oluştur
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// GET - Tüm rezervasyonları getir
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const where: any = {};
    if (type) where.type = type;

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ]
    });
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Rezervasyon getirme hatası:', error);
    return NextResponse.json({ error: 'Varauksia ei voitu tehdä' }, { status: 500 });
  }
}

// POST - Yeni rezervasyon ekle
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Rezervasyonu oluştur
    const reservation = await prisma.reservation.create({
      data: {
        userId: body.userId,
        date: body.date,
        time: body.time,
        guests: body.guests,
        type: body.type,
        notes: body.notes || '',
        status: 'PENDING'
      },
      include: {
        user: true
      }
    });

    // Müşteriye onay e-postası gönder
    await transporter.sendMail({
      from: `"${process.env.SITE_NAME}" <${process.env.EMAIL_USER}>`,
      to: reservation.user.email,
      subject: 'Varausvahvistus - ODOST',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Pöytävaraus vastaanotettu</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <img src="${process.env.SITE_LOGO_URL}" alt="${process.env.SITE_NAME}" style="max-width: 200px; margin-bottom: 20px;">
              
              <h2 style="color: #1a1a1a;">Hei ${reservation.user.name},</h2>
              
              <p>Kiitos varauksestasi. Olemme vastaanottaneet pöytävarauksesi ja käsittelemme sen mahdollisimman pian.</p>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Varauksen tiedot:</h3>
                <p style="margin: 0;">
                  <strong>Päivämäärä:</strong> ${new Date(reservation.date).toLocaleDateString('fi-FI')}<br>
                  <strong>Aika:</strong> ${reservation.time}<br>
                  <strong>Henkilömäärä:</strong> ${reservation.guests}<br>
                  <strong>Tyyppi:</strong> ${reservation.type === 'RAVINTOLA' ? 'Ravintola' : 'Baari'}<br>
                  <strong>Lisätiedot:</strong> ${reservation.notes || 'Ei lisätietoja'}
                </p>
              </div>
              
              <p>Otamme sinuun yhteyttä pian varauksen vahvistamiseksi.</p>
              
              <div style="margin-top: 40px;">
                <p>Ystävällisin terveisin,<br>${process.env.SITE_TEAM_NAME}</p>
              </div>
              
              <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;">
              
              <div style="margin-top: 20px; color: #666; font-size: 12px;">
                <p>Jos sinulla on kysyttävää tai haluat muuttaa varaustasi, ota yhteyttä meihin:</p>
                <p>${process.env.SITE_COMPANY_NAME}<br>
                ${process.env.SITE_ADDRESS}<br>
                Puh: ${process.env.SITE_PHONE}<br>
                Email: ${process.env.SITE_EMAIL}</p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    // Ravintolalle ilmoitus uudesta varauksesta
    await transporter.sendMail({
      from: `"${process.env.SITE_NAME}" <${process.env.EMAIL_USER}>`,
      to: process.env.SITE_EMAIL,
      subject: 'Uusi varaus - ODOST',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Uusi varaus vastaanotettu</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <img src="${process.env.SITE_LOGO_URL}" alt="${process.env.SITE_NAME}" style="max-width: 200px; margin-bottom: 20px;">
              
              <h2 style="color: #1a1a1a;">Uusi varaus vastaanotettu</h2>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Asiakkaan tiedot:</h3>
                <p style="margin: 0;">
                  <strong>Nimi:</strong> ${reservation.user.name}<br>
                  <strong>Sähköposti:</strong> ${reservation.user.email}
                </p>
              </div>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Varauksen tiedot:</h3>
                <p style="margin: 0;">
                  <strong>Päivämäärä:</strong> ${new Date(reservation.date).toLocaleDateString('fi-FI')}<br>
                  <strong>Aika:</strong> ${reservation.time}<br>
                  <strong>Henkilömäärä:</strong> ${reservation.guests}<br>
                  <strong>Tyyppi:</strong> ${reservation.type === 'RAVINTOLA' ? 'Ravintola' : 'Baari'}<br>
                  <strong>Lisätiedot:</strong> ${reservation.notes || 'Ei lisätietoja'}
                </p>
              </div>
              
              <div style="margin-top: 40px;">
                <p>Muista käsitellä varaus hallintapaneelissa.</p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Varausvirhe:', error);
    return NextResponse.json(
      { error: 'Varauksen luominen epäonnistui' },
      { status: 500 }
    );
  }
}

// PUT - Rezervasyon durumunu güncelle
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const reservation = await prisma.reservation.update({
      where: { id: body.id },
      data: {
        status: body.status
      },
      include: {
        user: true
      }
    });

    // Eğer rezervasyon onaylandıysa, onay e-postası gönder
    if (body.status === 'CONFIRMED') {
      await transporter.sendMail({
        from: `"${process.env.SITE_NAME}" <${process.env.EMAIL_USER}>`,
        to: reservation.user.email,
        subject: `Pöytävarauksesi on vahvistettu - ${process.env.SITE_NAME}`,
        html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Pöytävaraus vahvistettu</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <img src="${process.env.SITE_LOGO_URL}" alt="${process.env.SITE_NAME}" style="max-width: 200px; margin-bottom: 20px;">
              
              <h2 style="color: #1a1a1a;">Hei ${reservation.user.name},</h2>
              
              <p>Hienoa uutista! Pöytävarauksesi on nyt vahvistettu.</p>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Varauksen tiedot:</h3>
                <p style="margin: 0;">
                  <strong>Päivämäärä:</strong> ${new Date(reservation.date).toLocaleDateString('fi-FI')}<br>
                  <strong>Aika:</strong> ${reservation.time}<br>
                  <strong>Henkilömäärä:</strong> ${reservation.guests}<br>
                  <strong>Tyyppi:</strong> ${reservation.type === 'RAVINTOLA' ? 'Ravintola' : 'Baari'}<br>
                  <strong>Lisätiedot:</strong> ${reservation.notes || 'Ei lisätietoja'}
                </p>
              </div>
              
              <p>Odotamme innolla vierailuasi! Jos sinulla on erikoistoiveita tai kysyttävää, ota rohkeasti yhteyttä.</p>
              
              <div style="margin-top: 40px;">
                <p>Ystävällisin terveisin,<br>${process.env.SITE_TEAM_NAME}</p>
              </div>
              
              <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;">
              
              <div style="margin-top: 20px; color: #666; font-size: 12px;">
                <p>Jos sinulla on kysyttävää tai haluat muuttaa varaustasi, ota yhteyttä meihin:</p>
                <p>${process.env.SITE_COMPANY_NAME}<br>
                ${process.env.SITE_ADDRESS}<br>
                Puh: ${process.env.SITE_PHONE}<br>
                Email: ${process.env.SITE_EMAIL}</p>
              </div>
            </div>
          </body>
        </html>
        `
      });
    }
    
    // Eğer rezervasyon reddedildiyse, red e-postası gönder
    if (body.status === 'CANCELLED') {
      await transporter.sendMail({
        from: `"${process.env.SITE_NAME}" <${process.env.EMAIL_USER}>`,
        to: reservation.user.email,
        subject: `Pöytävarauksesi päivitys - ${process.env.SITE_NAME}`,
        html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Pöytävarauksen päivitys</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <img src="${process.env.SITE_LOGO_URL}" alt="${process.env.SITE_NAME}" style="max-width: 200px; margin-bottom: 20px;">
              
              <h2 style="color: #1a1a1a;">Hei ${reservation.user.name},</h2>
              
              <p>Valitettavasti emme pysty vahvistamaan pöytävaraustasi alla oleville tiedoille:</p>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Varauksen tiedot:</h3>
                <p style="margin: 0;">
                  <strong>Päivämäärä:</strong> ${new Date(reservation.date).toLocaleDateString('fi-FI')}<br>
                  <strong>Aika:</strong> ${reservation.time}<br>
                  <strong>Henkilömäärä:</strong> ${reservation.guests}<br>
                  <strong>Tyyppi:</strong> ${reservation.type === 'RAVINTOLA' ? 'Ravintola' : 'Baari'}<br>
                  <strong>Lisätiedot:</strong> ${reservation.notes || 'Ei lisätietoja'}
                </p>
              </div>
              
              <p>Syynä voi olla esimerkiksi täysi varauskalenteri tai muu tekninen este. Pahoittelemme tästä aiheutuvaa vaivaa.</p>
              <p>Voit tehdä uuden varauksen toiselle ajankohdalle verkkosivuillamme tai ottaa yhteyttä asiakaspalveluumme.</p>
              
              <div style="margin-top: 40px;">
                <p>Ystävällisin terveisin,<br>${process.env.SITE_TEAM_NAME}</p>
              </div>
              
              <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;">
              
              <div style="margin-top: 20px; color: #666; font-size: 12px;">
                <p>Asiakaspalvelumme auttaa sinua mielellään uuden varauksen tekemisessä:</p>
                <p>${process.env.SITE_COMPANY_NAME}<br>
                ${process.env.SITE_ADDRESS}<br>
                Puh: ${process.env.SITE_PHONE}<br>
                Email: ${process.env.SITE_EMAIL}</p>
              </div>
            </div>
          </body>
        </html>
        `
      });
    }

    return NextResponse.json(reservation);
  } catch (error) {
    return NextResponse.json({ error: 'Varausta ei voitu päivittää' }, { status: 500 });
  }
}

// DELETE - Rezervasyonu iptal et
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID vaaditaan' }, { status: 400 });
    }
    await prisma.reservation.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Varausta ei voitu peruuttaa.' }, { status: 500 });
  }
} 
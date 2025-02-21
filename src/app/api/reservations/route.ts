import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import { format } from 'date-fns';
import { sendEmail } from '@/lib/email';

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
    const status = searchParams.get('status');

    const where: any = {};
    
    // Tip filtresi
    if (type && type !== 'ALL') {
      where.type = type;
    }
    
    // Durum filtresi
    if (status === 'CANCELLED') {
      where.status = 'CANCELLED';
    } else if (status === 'ALL') {
      where.status = { not: 'CANCELLED' };
    }

    // Tüm rezervasyonları getir
    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    // Rezervasyonları işle ve name alanı olmayanlar için user.name'i kullan
    const processedReservations = reservations.map(reservation => ({
      ...reservation,
      name: reservation.name || reservation.user.name || reservation.user.email.split('@')[0]
    }));

    return NextResponse.json(processedReservations);
  } catch (error) {
    console.error('Rezervasyon getirme hatası:', error);
    return NextResponse.json(
      { error: 'Varauksia ei voitu hakea' }, 
      { status: 500 }
    );
  }
}

// POST - Yeni rezervasyon ekle
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

    // Kullanıcıyı e-posta ile bul veya oluştur
    let user = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (!user) {
      // Yeni kullanıcı oluştur
      const hashedPassword = await bcrypt.hash('temporary', 10);
      user = await prisma.user.create({
        data: {
          name: body.name, // İlk rezervasyonda gelen ismi kullan
          email: body.email,
          password: hashedPassword,
          role: 'USER'
        }
      });
    }

    // Rezervasyonu oluştur
    const reservation = await prisma.reservation.create({
      data: {
        userId: user.id,
        name: body.name,
        date: new Date(body.date),
        time: body.time,
        guests: body.guests,
        type: body.type,
        notes: body.notes,
        status: 'PENDING'
      },
      include: {
        user: true
      }
    });

    // E-posta gönder
    await sendEmail({
      to: body.email,
      subject: 'Varauksesi on vastaanotettu - ODOST',
      text: `Kiitos varauksestasi ${reservation.name}!\n\nVarauksen tiedot:\nPäivämäärä: ${format(new Date(body.date), 'dd.MM.yyyy')}\nAika: ${body.time}\nHenkilömäärä: ${body.guests}\n\nOtamme sinuun yhteyttä pian varauksen vahvistamiseksi.\n\nYstävällisin terveisin,\nODOST Tiimi`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Varausvahvistus</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1a1a1a;">Kiitos varauksestasi, ${reservation.name}!</h2>
              
              <p>Olemme vastaanottaneet varauksesi ja käsittelemme sen pian.</p>
              
              <h3 style="color: #1a1a1a;">Varauksen tiedot:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Päivämäärä:</strong> ${format(new Date(body.date), 'dd.MM.yyyy')}</li>
                <li><strong>Aika:</strong> ${body.time}</li>
                <li><strong>Henkilömäärä:</strong> ${body.guests}</li>
                ${body.notes ? `<li><strong>Lisätiedot:</strong> ${body.notes}</li>` : ''}
              </ul>
              
              <p>Otamme sinuun yhteyttä pian varauksen vahvistamiseksi.</p>
              
              <div style="margin-top: 40px;">
                <p>Ystävällisin terveisin,<br>ODOST Tiimi</p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    return new Response(JSON.stringify(reservation), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Varausvirhe:', error);
    return new Response(
      JSON.stringify({ error: 'Varauksen luominen epäonnistui' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
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
    const deleteAll = searchParams.get('deleteAll');

    if (deleteAll === 'true') {
      // Tüm rezervasyonları sil
      await prisma.reservation.deleteMany({});
      return NextResponse.json({ success: true, message: 'Kaikki varaukset poistettu' });
    } else {
      const id = searchParams.get('id');
      if (!id) {
        return NextResponse.json({ error: 'ID vaaditaan' }, { status: 400 });
      }
      await prisma.reservation.delete({
        where: { id }
      });
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Varausten poistamisvirhe:', error);
    return NextResponse.json({ error: 'Varauksia ei voitu poistaa' }, { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// E-posta gönderici yapılandırması
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      ip, 
      location, 
      email, 
      userAgent, 
      timestamp,
      geoLocation 
    } = body;

    // E-posta içeriği
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.SITE_EMAIL,
      subject: '⚠️ Epäonnistunut kirjautumisyritys - ODOST',
      html: `
        <h2>Epäonnistunut kirjautumisyritys havaittu</h2>
        <p><strong>Aika:</strong> ${new Date(timestamp).toLocaleString('fi-FI')}</p>
        <p><strong>IP-osoite:</strong> ${ip}</p>
        <p><strong>Arvioitu sijainti:</strong> ${location}</p>
        <p><strong>Yritetty sähköposti:</strong> ${email}</p>
        <p><strong>Selaintiedot:</strong> ${userAgent}</p>
        ${geoLocation ? `
        <p><strong>Tarkka sijaintitiedot:</strong></p>
        <ul>
          <li>Maa: ${geoLocation.country}</li>
          <li>Kaupunki: ${geoLocation.city}</li>
          <li>Alue: ${geoLocation.region}</li>
          <li>Leveysaste: ${geoLocation.latitude}</li>
          <li>Pituusaste: ${geoLocation.longitude}</li>
        </ul>
        ` : ''}
        <p style="color: red;">Tämä on turvallisuusvaroitus. Jos tämä kirjautumisyritys ei ole sinun, ryhdy tarvittaviin turvatoimiin.</p>
      `,
    };

    // E-postayı gönder
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Kirjautumisvaroituksen lähetys epäonnistui:', error);
    return NextResponse.json({ error: 'Ilmoituksen lähetys epäonnistui' }, { status: 500 });
  }
} 
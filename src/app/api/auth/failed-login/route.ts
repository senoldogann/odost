import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// E-posta gönderici yapılandırması
async function createTransporter() {
  try {
    console.log('Creating email transporter with settings:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER ? '***' : 'undefined',
      pass: process.env.EMAIL_PASSWORD ? '***' : 'undefined'
    });

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Test bağlantıyı
    await transporter.verify();
    console.log('Email transporter verified successfully');
    return transporter;
  } catch (error) {
    console.error('Email transporter creation failed:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    console.log('Failed login notification received');
    
    const body = await request.json();
    const { 
      ip, 
      location, 
      email, 
      userAgent, 
      timestamp,
      geoLocation,
      error 
    } = body;

    console.log('Creating email transporter...');
    const transporter = await createTransporter();

    console.log('Preparing to send email with data:', {
      to: process.env.SITE_EMAIL,
      from: process.env.EMAIL_USER,
      subject: '⚠️ Epäonnistunut kirjautumisyritys - ODOST'
    });

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
        ${error ? `<p><strong>Virhe:</strong> ${error}</p>` : ''}
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

    console.log('Sending email...');

    // E-postayı gönder
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Failed login notification error:', error);
    return NextResponse.json({ 
      error: 'Ilmoituksen lähetys epäonnistui',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';


// E-posta göndermek için transporter oluştur
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html: string;
}

async function getFooterInfo() {
  const footer = await prisma.footer.findFirst();
  return {
    address: footer?.address || process.env.SITE_ADDRESS || '',
    phone: footer?.phone || process.env.SITE_PHONE || '',
    email: footer?.email || process.env.SITE_EMAIL || '',
    companyName: process.env.SITE_COMPANY_NAME || 'ODOST Ravintola & Baari Oy'
  };
}

export async function sendEmail({ to, subject, text, html }: EmailData) {
  try {
    const footerInfo = await getFooterInfo();
    
    // HTML şablonuna footer bilgilerini ekle
    const htmlWithFooter = html.replace(
      /<\/body>/,
      `
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px; margin: 0;">
            ${footerInfo.companyName}<br>
            ${footerInfo.address}<br>
            Puh: ${footerInfo.phone}<br>
            Email: ${footerInfo.email}
          </p>
        </div>
      </body>
      `
    );

    // Text versiyonuna footer bilgilerini ekle
    const textWithFooter = `${text}\n\n--\n${footerInfo.companyName}\n${footerInfo.address}\nPuh: ${footerInfo.phone}\nEmail: ${footerInfo.email}`;

    const info = await transporter.sendMail({
      from: `"ODOST Restaurant & Bar" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: textWithFooter,
      html: htmlWithFooter,
    });

    console.log('Sähköposti lähetetty:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('E-posta gönderme hatası:', error);
    throw new Error('E-posta gönderilemedi');
  }
} 
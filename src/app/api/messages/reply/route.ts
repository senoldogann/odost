import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

interface Footer {
  id: string;
  address: string;
  phone: string;
  email: string;
  openingHours: any;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messageId, reply } = body;

    if (!messageId || !reply) {
      return NextResponse.json(
        { error: 'Viesti ID ja vastaus ovat pakollisia' },
        { status: 400 }
      );
    }

    // Mesajı getir
    const message = await prisma.contactForm.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      return NextResponse.json(
        { error: 'Viestiä ei löytynyt' },
        { status: 404 }
      );
    }

    // Footer bilgilerini getir
    const footer = await prisma.footer.findFirst() as Footer | null;

    // E-posta gönder
    await sendEmail({
      to: message.email,
      subject: `Re: ${message.subject}`,
      text: reply,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ravintola & Baari - Vastaus yhteydenottoon</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333333;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9;">
              <tr>
                <td style="padding: 20px;">
                  <table width="600" cellpadding="0" cellspacing="0" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Ravintola & Baari</h1>
                        <p style="margin: 10px 0 0; color: #cccccc; font-size: 16px;">Vastaus yhteydenottoon</p>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="margin: 0 0 20px; color: #333333; font-size: 20px;">Hei ${message.name},</h2>
                        <p style="margin: 0 0 20px; color: #666666; line-height: 1.6;">
                          Kiitos yhteydenotostasi koskien aihetta "${message.subject}". Olemme käsitelleet viestisi ja tässä vastauksemme:
                        </p>
                        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 6px; margin: 20px 0;">
                          ${reply.replace(/\n/g, '<br>')}
                        </div>
                      </td>
                    </tr>

                    <!-- Social Media -->
                    <tr>
                      <td style="padding: 0 30px 30px;">
                        <p style="margin: 0 0 15px; color: #666666; text-align: center;">Seuraa meitä sosiaalisessa mediassa:</p>
                        <div style="text-align: center;">
                          ${footer?.socialMedia.facebook ? `
                            <a href="${footer.socialMedia.facebook}" style="display: inline-block; margin: 0 10px; color: #1877f2; text-decoration: none;" target="_blank">Facebook</a>
                          ` : ''}
                          ${footer?.socialMedia.instagram ? `
                            <a href="${footer.socialMedia.instagram}" style="display: inline-block; margin: 0 10px; color: #e4405f; text-decoration: none;" target="_blank">Instagram</a>
                          ` : ''}
                          ${footer?.socialMedia.twitter ? `
                            <a href="${footer.socialMedia.twitter}" style="display: inline-block; margin: 0 10px; color: #1da1f2; text-decoration: none;" target="_blank">Twitter</a>
                          ` : ''}
                        </div>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #1a1a1a; padding: 30px; text-align: center;">
                        <p style="margin: 0 0 10px; color: #ffffff; font-size: 14px;">
                          ${footer?.address || 'Ravintola & Baari'}
                        </p>
                        <p style="margin: 0 0 10px; color: #cccccc; font-size: 14px;">
                          Puh: ${footer?.phone || ''} | Email: ${footer?.email || ''}
                        </p>
                        <table width="100%" style="margin-top: 20px; border-top: 1px solid #333333;">
                          <tr>
                            <td style="padding-top: 20px;">
                              <p style="margin: 0; color: #888888; font-size: 12px;">
                                © ${new Date().getFullYear()} Ravintola & Baari. Kaikki oikeudet pidätetään.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    // Mesajın durumunu güncelle
    const updatedMessage = await prisma.contactForm.update({
      where: { id: messageId },
      data: {
        status: 'RESOLVED'
      }
    });

    return NextResponse.json({
      success: true,
      message: updatedMessage
    });
  } catch (error) {
    console.error('Vastausvirhe:', error);
    return NextResponse.json(
      { error: 'Vastauksen lähettäminen epäonnistui' },
      { status: 500 }
    );
  }
}
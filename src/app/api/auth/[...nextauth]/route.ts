import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Başarısız giriş denemelerini bildirmek için fonksiyon
async function notifyFailedLogin(email: string, error: string) {
  try {
    console.log('Sending failed login notification');

    const response = await fetch('/api/auth/failed-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        timestamp: new Date().toISOString(),
        error,
        userAgent: 'Admin Panel',
        ip: 'IP bilgisi alınamadı',
        location: 'Konum bilgisi alınamadı'
      }),
    });

    if (!response.ok) {
      console.error('Failed login notification error. Status:', response.status);
      console.error('Error details:', await response.text());
    } else {
      console.log('Failed login notification sent successfully');
    }
  } catch (error) {
    console.error('Failed login notification error:', error);
  }
}

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Sähköposti", type: "email" },
        password: { label: "Salasana", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          await notifyFailedLogin(credentials?.email || 'unknown', 'Sähköposti ja salasana vaaditaan');
          throw new Error('Sähköposti ja salasana vaaditaan');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          await notifyFailedLogin(credentials.email, 'Käyttäjää ei löydy');
          throw new Error('Käyttäjää ei löydy');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          await notifyFailedLogin(credentials.email, 'Virheellinen salasana');
          throw new Error('Virheellinen salasana');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/admin/login',
    signOut: '/auth/signout',
    error: '/admin/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST }; 
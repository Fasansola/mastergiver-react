import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '../validations/auth.schema';

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },

  providers: [
    Credentials({
      async authorize(credentials) {
        // Validate input
        const validatedFields = loginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        // Find user

        const user = await prisma.user.findUnique({
          where: { email },
          include: { profile: true },
        });

        if (!user || !user.password) {
          return null;
        }

        // Check if email is verified

        if (!user.emailVerified) {
          throw new Error('Please verify your email before logging in');
        }

        // Verify password

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return null;
        }

        // Return user data for session

        return {
          id: user.id,
          email: user.email,
          name: user.profile?.firstName
            ? `${user.profile.firstName} ${user.profile.lastName}`
            : null,
          image: user.profile?.profilePicture ?? null,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      // On every request, refresh user data if needed

      if (trigger === 'update') {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          include: { profile: true },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.email = dbUser.email;
          token.name = dbUser.profile?.firstName
            ? `${dbUser.profile.firstName} ${dbUser.profile.lastName}`
            : null;
          token.picture = dbUser.profile?.profilePicture ?? null;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
      }

      return session;
    },
  },

  session: {
    strategy: 'jwt', //Using database for sessions storage
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },

  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;

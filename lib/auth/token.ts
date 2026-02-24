import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

// Generate a secure random token

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Create email verification token

export async function createVerificationToken(email: string) {
  const token = generateToken();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  //   Delete any existing tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });

  //   Create new token
  const verificationToken = await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return verificationToken;
}

// Verify email verification token

export async function verifyEmailToken(token: string) {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return { success: false, error: 'Invalid token' };
  }

  const isExpired = verificationToken.expires < new Date();

  if (isExpired) {
    return {
      success: false,
      error: 'Token expired',
      email: verificationToken.identifier,
    };
  }

  return { success: true, email: verificationToken.identifier };
}

// Create password reset token

export async function createPasswordResetToken(email: string) {
  const token = generateToken();
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Delete any existing tokens for this email
  await prisma.passwordResetToken.deleteMany({
    where: { email },
  });

  //   Create new token

  const resetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return resetToken;
}

// Verify password reset token

export async function verifyPasswordResetToken(token: string) {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken) {
    return { success: false, error: 'Invalid token' };
  }

  if (resetToken.expires < new Date()) {
    await prisma.passwordResetToken.delete({
      where: { token },
    });
    return { success: false, error: 'Token expired' };
  }

  return { success: true, email: resetToken.email };
}

'use server';

import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/session';
import { signOut } from '@/lib/auth/auth';
import { createVerificationToken, verifyEmailToken } from '@/lib/auth/token';
import { sendEmail } from '@/lib/email/client';
import VerifyEmail from '@/lib/email/templates/verify-email';
import bcrypt from 'bcryptjs';
import { updateEmailSchema, updatePasswordSchema } from '@/lib/validations/account.schema';

// ── Update Email ─────────────────────────────────────────────────────────────
// Stores the new address as pendingEmail and sends a verification link to it.
// The email is not changed until the user clicks the link (verifyNewEmail).

export async function updateEmail(newEmail: string) {
  try {
    const user = await requireAuth();

    const validatedFields = updateEmailSchema.safeParse({ newEmail });

    if (!validatedFields.success) {
      return { success: false, error: 'Invalid email address.' };
    }

    const { newEmail: validatedEmail } = validatedFields.data;

    if (validatedEmail === user.email) {
      return {
        success: false,
        error: 'New email must be different from your current email.',
      };
    }

    // Check uniqueness across all users
    const existing = await prisma.user.findUnique({
      where: { email: validatedEmail },
    });

    if (existing) {
      return { success: false, error: 'This email is already in use.' };
    }

    // Store as pending — the current email stays active until verified
    await prisma.user.update({
      where: { id: user.id },
      data: { pendingEmail: validatedEmail },
    });

    // Reuse the existing VerificationToken table; identifier = the pending address
    const verificationToken = await createVerificationToken(validatedEmail);

    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email/change?token=${verificationToken.token}`;

    const emailResult = await sendEmail({
      to: validatedEmail,
      subject: 'Confirm your new email address',
      react: VerifyEmail({
        username: user.profile?.firstName ?? 'there',
        verificationUrl,
      }),
    });

    if (!emailResult.success) {
      // Roll back the pendingEmail write so the user can try again cleanly
      await prisma.user.update({
        where: { id: user.id },
        data: { pendingEmail: null },
      });
      return {
        success: false,
        error: 'Failed to send verification email. Please try again.',
      };
    }

    return {
      success: true,
      message: `Verification email sent to ${validatedEmail}. Check your inbox to confirm the change.`,
    };
  } catch (error) {
    console.error('Update email error:', error);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

// ── Verify New Email ──────────────────────────────────────────────────────────
// Called from the email-change verification page (/verify-email/change?token=).
// Swaps pendingEmail into email and clears pendingEmail.
// Does not require an active session — the token alone is the proof of ownership.

export async function verifyNewEmail(token: string) {
  try {
    const result = await verifyEmailToken(token);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    const newEmail = result.email;

    // Find the user who requested this email change
    const user = await prisma.user.findFirst({
      where: { pendingEmail: newEmail },
    });

    if (!user) {
      return {
        success: false,
        error: 'No pending email change found for this token.',
      };
    }

    // Swap pendingEmail → email atomically
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          email: newEmail,
          pendingEmail: null,
          emailVerified: new Date(),
        },
      }),
      prisma.verificationToken.delete({ where: { token } }),
    ]);

    // Session token still holds the old email — the JWT callback will refresh it
    // on the next request when trigger === 'update' is fired from the client.
    return {
      success: true,
      message: 'Email updated successfully.',
    };
  } catch (error) {
    console.error('Verify new email error:', error);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

// ── Update Password ───────────────────────────────────────────────────────────

export async function updatePassword(
  currentPassword: string,
  newPassword: string
) {
  try {
    const user = await requireAuth();

    const validatedFields = updatePasswordSchema.safeParse({
      currentPassword,
      newPassword,
    });

    if (!validatedFields.success) {
      const firstError = validatedFields.error.issues[0]?.message;
      return { success: false, error: firstError ?? 'Invalid input.' };
    }

    const passwordMatch = await bcrypt.compare(
      validatedFields.data.currentPassword,
      user.password
    );

    if (!passwordMatch) {
      return { success: false, error: 'Current password is incorrect.' };
    }

    if (validatedFields.data.currentPassword === validatedFields.data.newPassword) {
      return {
        success: false,
        error: 'New password must be different from your current password.',
      };
    }

    const hashedPassword = await bcrypt.hash(validatedFields.data.newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { success: true, message: 'Password updated successfully.' };
  } catch (error) {
    console.error('Update password error:', error);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

// ── Delete Account ────────────────────────────────────────────────────────────
// Cascading deletes on the User model handle Profile, OnboardingProgress,
// ProfileCause, ProfileSkill, ProfileOrganization, and tokens automatically.

export async function deleteAccount() {
  try {
    const user = await requireAuth();

    await prisma.user.delete({ where: { id: user.id } });

    // Clear the session after deletion — redirect: false because we return
    // the redirect target to the client instead of throwing a NEXT_REDIRECT.
    await signOut({ redirect: false });

    return { success: true, redirectTo: '/' };
  } catch (error) {
    console.error('Delete account error:', error);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

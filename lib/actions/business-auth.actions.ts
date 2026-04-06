'use server';

/**
 * Server actions for business panel authentication.
 *
 * These run exclusively on the server — never in the browser. They handle:
 * - Business account sign-up (creates User + Business records)
 * - Sign-in (authenticates and returns the correct redirect based on business status)
 * - Password reset request (sends an email with a reset link)
 * - Password reset (validates the token, saves the new password)
 *
 * All actions return an ActionResult — a discriminated union of
 * { success: true, ...data } | { success: false, error: string }.
 * The form components check `result.success` to decide what to show.
 */

import { signIn } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import {
  businessSignUpSchema,
  businessSignInSchema,
  businessResetPasswordRequestSchema,
  businessResetPasswordSchema,
  type BusinessSignUpInput,
  type BusinessSignInInput,
  type BusinessResetPasswordRequestInput,
  type BusinessResetPasswordInput,
} from '@/lib/validations/business-auth.schema';
import { generateUniqueSlug } from '@/lib/business/slugify';
import {
  createPasswordResetToken,
  verifyPasswordResetToken,
} from '@/lib/auth/token';
import { sendEmail } from '@/lib/email/client';
import ResetPassword from '@/lib/email/templates/reset-password';
import type { ActionResult } from '@/lib/types/actions';

// ---------------------------------------------------------------------------
// SIGN UP
// ---------------------------------------------------------------------------

/**
 * Create a new business account.
 *
 * Creates a User record and a linked Business record (status: PENDING) in one
 * database transaction. The user is then automatically signed in and redirected
 * to the payment confirmation page.
 *
 * Note: emailVerified is set immediately on creation. Business users skip the
 * email-verification step — they are gated by Stripe payment instead, which is
 * a stronger form of identity validation.
 */
export async function businessSignUpAction(
  data: BusinessSignUpInput,
): Promise<ActionResult<{ redirectTo: string }>> {
  try {
    const validatedFields = businessSignUpSchema.safeParse(data);

    if (!validatedFields.success) {
      return { success: false, error: 'Invalid input. Please check your entries.' };
    }

    const { businessName, email, password } = validatedFields.data;

    // Prevent duplicate accounts on the same email address
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Build a unique URL slug from the business name (e.g. "Acme Corp" → "acme-corp")
    const slug = await generateUniqueSlug(businessName);

    // Create the User and its linked Business record together
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        // Auto-verify email — business users are verified via Stripe payment, not email link
        emailVerified: new Date(),
        business: {
          create: {
            slug,
            companyName: businessName,
            // status defaults to PENDING (defined in the Prisma schema)
          },
        },
      },
    });

    // Sign the user in immediately so they arrive at /business/confirm with an active session
    await signIn('credentials', { email, password, redirect: false });

    return { success: true, redirectTo: '/business/confirm' };
  } catch (error) {
    console.error('Business sign up error:', error);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

// ---------------------------------------------------------------------------
// SIGN IN
// ---------------------------------------------------------------------------

/**
 * Sign in a business user.
 *
 * After authenticating, looks up the linked Business record to determine
 * where to send the user:
 *   PENDING   → /business/confirm   (needs to complete payment)
 *   ACTIVE    → /business/dashboard/edit-profile
 *   SUSPENDED → returns `suspended: true` so the form shows an inline message
 */
export async function businessSignInAction(
  data: BusinessSignInInput,
): Promise<ActionResult<{ redirectTo?: string; suspended?: true }>> {
  try {
    const validatedFields = businessSignInSchema.safeParse(data);

    if (!validatedFields.success) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const { email, password } = validatedFields.data;

    // Authenticate via NextAuth credentials provider
    await signIn('credentials', { email, password, redirect: false });

    // Look up the linked business to determine where to redirect
    const user = await prisma.user.findUnique({
      where: { email },
      include: { business: true },
    });

    if (!user?.business) {
      // Authenticated successfully but no linked business — edge case
      return { success: false, error: 'No business account found for this email.' };
    }

    const { status } = user.business;

    // Suspended accounts get an inline message — no redirect
    if (status === 'SUSPENDED') {
      return { success: true, suspended: true };
    }

    const redirectTo =
      status === 'ACTIVE'
        ? '/business/dashboard/edit-profile'
        : '/business/confirm'; // PENDING — still needs to pay

    return { success: true, redirectTo };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { success: false, error: 'Invalid email or password.' };
        default:
          return { success: false, error: 'Something went wrong. Please try again.' };
      }
    }
    console.error('Business sign in error:', error);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

// ---------------------------------------------------------------------------
// REQUEST PASSWORD RESET
// ---------------------------------------------------------------------------

/**
 * Send a password reset email.
 *
 * Always returns a success response regardless of whether the email is registered
 * in the database — this is a security best practice that prevents email enumeration
 * (an attacker cannot tell from the response whether an account exists).
 */
export async function businessRequestPasswordResetAction(
  data: BusinessResetPasswordRequestInput,
): Promise<ActionResult<{ message: string }>> {
  try {
    const validatedFields = businessResetPasswordRequestSchema.safeParse(data);

    if (!validatedFields.success) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const { email } = validatedFields.data;

    // Silently return success if the email is not registered (security: no enumeration)
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return {
        success: true,
        message: 'If an account exists with this email, you will receive a reset link shortly.',
      };
    }

    const resetToken = await createPasswordResetToken(email);

    // Build the reset URL pointing to the business panel's new-password page
    const resetUrl = `${process.env.NEXTAUTH_URL}/business/reset-password/new?token=${resetToken.token}`;

    await sendEmail({
      to: email,
      subject: 'Reset your MasterGiver Business password',
      // Reuse the shared email template — the reset URL is the only difference
      react: ResetPassword({ username: email.split('@')[0], resetUrl }),
    });

    return {
      success: true,
      message: 'If an account exists with this email, you will receive a reset link shortly.',
    };
  } catch (error) {
    console.error('Business password reset request error:', error);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

// ---------------------------------------------------------------------------
// RESET PASSWORD (using the token from the email link)
// ---------------------------------------------------------------------------

/**
 * Set a new password using a valid reset token.
 *
 * The token is read from the URL (?token=...) and passed as a hidden form field.
 * On success, the token is deleted so it cannot be reused.
 */
export async function businessResetPasswordAction(
  data: BusinessResetPasswordInput,
): Promise<ActionResult<{ message: string }>> {
  try {
    const validatedFields = businessResetPasswordSchema.safeParse(data);

    if (!validatedFields.success) {
      return { success: false, error: 'Invalid input. Please check your entries.' };
    }

    const { token, password } = validatedFields.data;

    // Verify the token is valid and not expired
    const result = await verifyPasswordResetToken(token);

    if (!result.success) {
      return {
        success: false,
        error: result.error ?? 'This reset link is invalid or has expired.',
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email: result.email },
      data: { password: hashedPassword },
    });

    // Delete the token so it cannot be used again
    await prisma.passwordResetToken.delete({ where: { token } });

    return { success: true, message: 'Your password has been reset successfully.' };
  } catch (error) {
    console.error('Business password reset error:', error);
    return { success: false, error: 'Failed to reset password. Please try again.' };
  }
}

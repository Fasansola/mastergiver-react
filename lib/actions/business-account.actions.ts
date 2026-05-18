'use server';

/**
 * Server actions for the Account Settings page.
 *
 * updateAccountInfoAction — updates the business name and/or email for the
 *   currently authenticated user.
 *
 * changePasswordAction — verifies the current password against the stored hash,
 *   then saves the new hashed password.
 *
 * Both actions:
 *   - Read the session to identify the user (never trust client-supplied IDs)
 *   - Validate input with Zod
 *   - Return ActionResult — { success: true } | { success: false; error: string }
 */

import { auth, unstable_update } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import {
  accountInfoSchema,
  changePasswordSchema,
  type AccountInfoInput,
  type ChangePasswordInput,
} from '@/lib/validations/business-account.schema';
import type { ActionResult } from '@/lib/types/actions';

// ---------------------------------------------------------------------------
// Update Account Information
// ---------------------------------------------------------------------------

/**
 * Save a new business name and/or email address.
 *
 * Email uniqueness is enforced at the DB level (unique constraint on User.email).
 * We do a pre-check for a friendlier error, and catch the P2002 unique constraint
 * violation in case two requests race past the pre-check simultaneously.
 *
 * After an email change the JWT is refreshed so session.user.email reflects the
 * new value immediately without requiring a logout.
 */
export async function updateAccountInfoAction(
  data: AccountInfoInput,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  const parsed = accountInfoSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: 'Invalid input.' };

  const { companyName, email } = parsed.data;
  const userId = session.user.id;

  // Pre-check for a human-friendly error before hitting the DB constraint.
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== userId) {
    return { success: false, error: 'This email is already in use by another account.' };
  }

  try {
    // Update both records in a transaction so they succeed or fail together.
    await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: { email } }),
      prisma.business.update({ where: { ownerId: userId }, data: { companyName } }),
    ]);
  } catch (e: unknown) {
    // P2002 = unique constraint violation — another request claimed the email
    const err = e as { code?: string };
    if (err.code === 'P2002') {
      return { success: false, error: 'This email is already in use by another account.' };
    }
    throw e;
  }

  // Refresh the JWT so session.user.email reflects the new email immediately.
  await unstable_update({ user: { email } });

  return { success: true };
}

// ---------------------------------------------------------------------------
// Change Password
// ---------------------------------------------------------------------------

/**
 * Change the authenticated user's password.
 *
 * The current password is verified first. If it does not match, the action
 * returns an error without touching the database.
 */
export async function changePasswordAction(
  data: ChangePasswordInput,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  const parsed = changePasswordSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: 'Invalid input.' };

  const { currentPassword, newPassword } = parsed.data;

  // Fetch the stored hash — password may be null for OAuth-only accounts.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  });

  if (!user?.password) {
    return { success: false, error: 'No password is set on this account.' };
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return { success: false, error: 'Current password is incorrect.' };
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashed },
  });

  return { success: true };
}

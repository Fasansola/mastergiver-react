/**
 * Zod validation schemas for the Account Settings page.
 *
 * accountInfoSchema — Business Name + Email fields.
 * changePasswordSchema — Current password + new password (with match check).
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Account Information
// ---------------------------------------------------------------------------

export const accountInfoSchema = z.object({
  companyName: z.string().min(1, 'Business name is required').max(100),
  email: z.string().email('Please enter a valid email address'),
});

export type AccountInfoInput = z.infer<typeof accountInfoSchema>;

// ---------------------------------------------------------------------------
// Change Password
// ---------------------------------------------------------------------------

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

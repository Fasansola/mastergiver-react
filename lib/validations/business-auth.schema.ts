/**
 * Zod validation schemas for all business panel auth forms.
 *
 * These are the single source of truth for both client-side form validation
 * (via React Hook Form + zodResolver) and server-side action validation.
 */

import { z } from 'zod';

// Shared password rule — consistent with Phase 1 strength requirements
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// --- SIGN UP ---
export const businessSignUpSchema = z
  .object({
    businessName: z
      .string()
      .min(2, 'Business name must be at least 2 characters')
      .max(100, 'Business name cannot exceed 100 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: passwordSchema,
    confirmPassword: z.string(),
    agreeToTerms: z.literal(true, {
      message: 'You must agree to the Terms of Use and Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // attach the error to the confirmPassword field
  });

// --- SIGN IN ---
export const businessSignInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

// --- REQUEST PASSWORD RESET (step 1: enter email) ---
export const businessResetPasswordRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// --- RESET PASSWORD (step 2: enter new password) ---
export const businessResetPasswordSchema = z
  .object({
    // Token is read from the URL and passed as a hidden field — users never type this
    token: z.string().min(1, 'Reset token is missing. Please use the link from your email.'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Inferred TypeScript types — used as the generic parameter for useForm<T>
export type BusinessSignUpInput = z.infer<typeof businessSignUpSchema>;
export type BusinessSignInInput = z.infer<typeof businessSignInSchema>;
export type BusinessResetPasswordRequestInput = z.infer<typeof businessResetPasswordRequestSchema>;
export type BusinessResetPasswordInput = z.infer<typeof businessResetPasswordSchema>;

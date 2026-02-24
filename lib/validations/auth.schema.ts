import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must have at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  username: z
    .string()
    .min(4, 'Username must contain at least 4 characters')
    .max(32, 'Username cannot contain more than 32 characters')
    .regex(
      /^[A-Za-z0-9-_]+$/,
      'Username can only contain letters, numbers, hyphens, and underscores'
    )
    .regex(/^[A-Za-z0-9]/, 'Username must start with a letter or number')
    .regex(/[A-Za-z0-9]$/, 'Username must end with a letter or number')
    .toLowerCase(),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(64, 'First name cannot contain more than 64 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(64, 'Last name cannot contain more than 64 characters'),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const resetPasswordRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z
    .string()
    .min(8, 'Password must have at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

// Type inference for forms
export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ResetPasswordRequestInput = z.infer<
  typeof resetPasswordRequestSchema
>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

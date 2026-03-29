'use server';

import { signIn, signOut } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import {
  signUpSchema,
  loginSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
  SignUpInput,
  LoginInput,
  ResetPasswordRequestInput,
  ResetPasswordInput,
} from '@/lib/validations/auth.schema';
import {
  createVerificationToken,
  verifyEmailToken,
  createPasswordResetToken,
  verifyPasswordResetToken,
} from '@/lib/auth/token';
import { sendEmail } from '@/lib/email/client';
import VerifyEmail from '@/lib/email/templates/verify-email';
import ResetPassword from '@/lib/email/templates/reset-password';

// SIGN UP A NEW USER

export async function signUp(data: SignUpInput) {
  try {
    // Validate input
    const validatedFields = signUpSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        error: 'Invalid input. Please check your data.',
      };
    }

    const { email, password, username, firstName, lastName } =
      validatedFields.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: 'An account with this email already exists.',
      };
    }

    // Check if username is taken
    const existingUsername = await prisma.profile.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return {
        success: false,
        error: 'This username is already taken.',
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user and profile in a transaction

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {
            firstName,
            lastName,
            username,
          },
        },
        onboarding: {
          create: {
            currentStep: 1,
            completedSteps: [],
            isCompleted: false,
          },
        },
      },
    });

    // Generate verification token
    const verificationToken = await createVerificationToken(email);

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken.token}`;

    await sendEmail({
      to: email,
      subject: 'Verify your email address',
      react: VerifyEmail({
        username: firstName,
        verificationUrl,
      }),
    });

    return {
      success: true,
      message:
        'Account created! Please check your email to verify your account.',
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
}

// LOG IN A USER

export async function login(data: LoginInput) {
  try {
    const validatedFields = loginSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    const { email, password } = validatedFields.data;

    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    // Check onboarding status to determine redirection
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        onboarding: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found.',
      };
    }

    // Determines redirect based on onboarding status

    const redirectTo = user.onboarding?.isCompleted
      ? '/dashboard'
      : '/onboarding';

    return { success: true, redirectTo };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            success: false,
            error: 'Invalid email or password',
          };
        case 'CallbackRouteError':
          // Check if it's our custom email verification error
          if (error.cause?.err?.message === 'EMAIL_NOT_VERIFIED') {
            return {
              success: false,
              error: 'Please verify your email before logging in.',
            };
          }
          return {
            success: false,
            error: 'Invalid email or password.',
          };
        default:
          return {
            success: false,
            error: 'Something went wrong. Please try again.',
          };
      }
    }

    console.error('Login error: ', error);
    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
}

// VERIFY EMAIL WITH TOKEN

export async function verifyEmail(token: string) {
  try {
    // Verify token
    const result = await verifyEmailToken(token);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
        email: result.email,
      };
    }

    // Update user's emailVerified field
    await prisma.user.update({
      where: { email: result.email },
      data: { emailVerified: new Date() },
    });

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: { token },
    });

    return {
      success: true,
      email: result.email,
      message: 'Email verified successfully!',
    };
  } catch (error) {
    console.error('Email verification error:', error);
    return {
      success: false,
      error: 'Failed to verify email. Please try again.',
    };
  }
}

// REQUEST PASSWORD RESET

export async function requestPasswordReset(data: ResetPasswordRequestInput) {
  try {
    const validatedFields = resetPasswordRequestSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        error: 'Invalid email address.',
      };
    }

    const { email } = validatedFields.data;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    // Don't reveal if user exists or not (security)
    if (!user) {
      return {
        success: true,
        message:
          'If an account exists with this email, you will receive a password reset link.',
      };
    }

    //  Generate reset token
    const resetToken = await createPasswordResetToken(email);

    // Send reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken.token}`;

    await sendEmail({
      to: email,
      subject: 'Reset your password',
      react: ResetPassword({
        username: user.profile?.firstName || 'there',
        resetUrl,
      }),
    });

    return {
      success: true,
      message:
        'If an account exists with email, you will receive a password reset link.',
    };
  } catch (error) {
    console.error('Password reset request error:', error);
    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
}

//  RESET PASSWORD WITH TOKEN

export async function resetPassword(data: ResetPasswordInput) {
  try {
    const validatedFields = resetPasswordSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        error: 'Invalid input. Please check your data.',
      };
    }

    const { token, password } = validatedFields.data;

    // Verify token
    const result = await verifyPasswordResetToken(token);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user's password
    await prisma.user.update({
      where: { email: result.email },
      data: { password: hashedPassword },
    });

    // Delete the reset token
    await prisma.passwordResetToken.delete({
      where: { token },
    });

    return {
      success: true,
      message: 'Password reset successfully',
    };
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: 'Failed to reset password. Please try again.',
    };
  }
}

// LOG OUT THE CURRENT USER

export async function logout() {
  await signOut({ redirect: false });
}

// RESEND VERIFICATION EMAIL

const resendAttempts = new Map<string, { count: number; resetAt: number }>();

export async function resendVerificationEmail(email: string) {
  try {
    // Rate limiting: 3 attempts in 15 minutes

    const now = Date.now();
    const attempt = resendAttempts.get(email);

    if (attempt) {
      if (now < attempt.resetAt) {
        if (attempt.count >= 3) {
          return {
            success: false,
            error: 'Too many requests. Please try again later.',
          };
        }
        attempt.count++;
      } else {
        // Reset Counter
        resendAttempts.set(email, { count: 1, resetAt: now + 15 * 60 * 1000 });
      }
    } else {
      // Initial counter
      resendAttempts.set(email, { count: 1, resetAt: now + 15 * 60 * 1000 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found.',
      };
    }

    if (user.emailVerified) {
      return {
        success: false,
        error: 'Email is already verified.',
      };
    }

    // Generate new verification token
    const verificationToken = await createVerificationToken(email);

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken.token}`;

    await sendEmail({
      to: email,
      subject: 'Verify your email address',
      react: VerifyEmail({
        username: user.profile?.firstName || 'there',
        verificationUrl,
      }),
    });

    return {
      success: true,
      message: 'verification email sent!',
    };
  } catch (error) {
    console.log('Resend verification error: ', error);
    return {
      success: false,
      error: 'Failed to resend verification email.',
    };
  }
}

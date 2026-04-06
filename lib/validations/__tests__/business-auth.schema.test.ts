/**
 * Tests for all business panel auth Zod schemas.
 *
 * Each schema test has two groups:
 *   - Valid inputs  → safeParse should succeed
 *   - Invalid inputs → safeParse should fail with the right field errors
 *
 * These tests run entirely in memory — no database or network needed.
 */

import { describe, it, expect } from 'vitest';
import {
  businessSignUpSchema,
  businessSignInSchema,
  businessResetPasswordRequestSchema,
  businessResetPasswordSchema,
} from '../business-auth.schema';

// ---------------------------------------------------------------------------
// Sign Up Schema
// ---------------------------------------------------------------------------

describe('businessSignUpSchema', () => {
  const valid = {
    businessName: 'Acme Corp',
    email: 'admin@acme.com',
    password: 'Password1',
    confirmPassword: 'Password1',
  };

  it('accepts valid signup data', () => {
    expect(businessSignUpSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a business name shorter than 2 characters', () => {
    const result = businessSignUpSchema.safeParse({ ...valid, businessName: 'A' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      expect(fields.businessName).toBeDefined();
    }
  });

  it('rejects a business name longer than 100 characters', () => {
    const result = businessSignUpSchema.safeParse({
      ...valid,
      businessName: 'A'.repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email address', () => {
    const result = businessSignUpSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it('rejects a password shorter than 8 characters', () => {
    const result = businessSignUpSchema.safeParse({
      ...valid,
      password: 'Ab1',
      confirmPassword: 'Ab1',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toBeDefined();
    }
  });

  it('rejects a password with no uppercase letter', () => {
    const result = businessSignUpSchema.safeParse({
      ...valid,
      password: 'password1',
      confirmPassword: 'password1',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a password with no lowercase letter', () => {
    const result = businessSignUpSchema.safeParse({
      ...valid,
      password: 'PASSWORD1',
      confirmPassword: 'PASSWORD1',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a password with no number', () => {
    const result = businessSignUpSchema.safeParse({
      ...valid,
      password: 'PasswordNoNum',
      confirmPassword: 'PasswordNoNum',
    });
    expect(result.success).toBe(false);
  });

  it('rejects when passwords do not match', () => {
    const result = businessSignUpSchema.safeParse({
      ...valid,
      confirmPassword: 'DifferentPass1',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      // The mismatch error should be attached to confirmPassword
      expect(result.error.flatten().fieldErrors.confirmPassword).toBeDefined();
    }
  });

  it('accepts passwords that meet all requirements', () => {
    const variants = ['Password1', 'Abcdefg1', 'Zz123456', 'MyPass99'];
    for (const pw of variants) {
      expect(
        businessSignUpSchema.safeParse({ ...valid, password: pw, confirmPassword: pw }).success
      ).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Sign In Schema
// ---------------------------------------------------------------------------

describe('businessSignInSchema', () => {
  const valid = { email: 'admin@acme.com', password: 'anypassword' };

  it('accepts valid signin data', () => {
    expect(businessSignInSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const result = businessSignInSchema.safeParse({ ...valid, email: 'bad' });
    expect(result.success).toBe(false);
  });

  it('rejects an empty password', () => {
    const result = businessSignInSchema.safeParse({ ...valid, password: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toBeDefined();
    }
  });

  it('accepts any non-empty password (no strength check on signin)', () => {
    // Signin only needs a non-empty password — strength is enforced at signup
    expect(businessSignInSchema.safeParse({ ...valid, password: 'weak' }).success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Reset Password Request Schema
// ---------------------------------------------------------------------------

describe('businessResetPasswordRequestSchema', () => {
  it('accepts a valid email', () => {
    expect(
      businessResetPasswordRequestSchema.safeParse({ email: 'user@example.com' }).success
    ).toBe(true);
  });

  it('rejects a missing email', () => {
    expect(businessResetPasswordRequestSchema.safeParse({}).success).toBe(false);
  });

  it('rejects a malformed email', () => {
    expect(
      businessResetPasswordRequestSchema.safeParse({ email: 'not-valid' }).success
    ).toBe(false);
  });

  it('rejects an empty string', () => {
    expect(
      businessResetPasswordRequestSchema.safeParse({ email: '' }).success
    ).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Reset Password Schema
// ---------------------------------------------------------------------------

describe('businessResetPasswordSchema', () => {
  const valid = {
    token: 'abc123token',
    password: 'NewPass99',
    confirmPassword: 'NewPass99',
  };

  it('accepts valid reset data', () => {
    expect(businessResetPasswordSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a missing token', () => {
    const result = businessResetPasswordSchema.safeParse({
      ...valid,
      token: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.token).toBeDefined();
    }
  });

  it('rejects a weak password', () => {
    const result = businessResetPasswordSchema.safeParse({
      ...valid,
      password: 'weak',
      confirmPassword: 'weak',
    });
    expect(result.success).toBe(false);
  });

  it('rejects mismatched passwords', () => {
    const result = businessResetPasswordSchema.safeParse({
      ...valid,
      confirmPassword: 'DifferentPass1',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.confirmPassword).toBeDefined();
    }
  });

  it('accepts a strong password that matches confirmation', () => {
    expect(businessResetPasswordSchema.safeParse(valid).success).toBe(true);
  });
});

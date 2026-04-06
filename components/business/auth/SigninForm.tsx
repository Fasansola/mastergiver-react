'use client';

/**
 * Business panel sign-in form.
 *
 * Collects: Email, Password.
 * After authenticating, the server action checks the linked business status
 * and returns one of three outcomes:
 *   - PENDING   → redirect to /business/confirm (payment required)
 *   - ACTIVE    → redirect to /business/dashboard/edit-profile
 *   - SUSPENDED → show an inline suspension notice, no redirect
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Nextlink from 'next/link';
import {
  businessSignInSchema,
  type BusinessSignInInput,
} from '@/lib/validations/business-auth.schema';
import { businessSignInAction } from '@/lib/actions/business-auth.actions';
import BusinessPasswordInput from '@/components/business/shared/BusinessPasswordInput';
import {
  inputStyle,
  labelStyle,
  errorTextStyle,
  primaryButtonStyle,
} from '@/components/business/shared/styles';
import { Heading, HStack, Stack, Text, Link } from '@chakra-ui/react';

const SigninForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  // When the business is suspended, we show a special notice instead of a generic error
  const [isSuspended, setIsSuspended] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessSignInInput>({
    resolver: zodResolver(businessSignInSchema),
  });

  const onSubmit = async (data: BusinessSignInInput) => {
    setServerError(null);
    setIsSuspended(false);

    const result = await businessSignInAction(data);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    // Suspended accounts: show inline message, do not redirect
    if (result.suspended) {
      setIsSuspended(true);
      return;
    }

    // For PENDING and ACTIVE, navigate to the appropriate page
    if (result.redirectTo) {
      router.refresh(); // flush session into client router
      router.push(result.redirectTo);
    }
  };

  return (
    <Stack gap="10">
      {/* PAGE HEADING */}
      <Stack gap="4" align="center">
        <Heading
          className="font-display"
          fontSize="bigheading"
          fontWeight="700"
          textAlign="center"
          lineHeight="1.2em"
          color="text.heading"
        >
          Welcome back
        </Heading>

        <Text fontSize="body" textAlign="center" color="text.primary">
          Sign in to your MasterGiver business account.
        </Text>
      </Stack>

      {/* SUSPENDED ACCOUNT NOTICE */}
      {isSuspended && (
        <div
          style={{
            background: '#FFFAF0',
            border: '1px solid #F6AD55',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <p
            style={{
              fontWeight: 700,
              color: '#744210',
              fontSize: '14px',
              marginBottom: '4px',
            }}
          >
            Account suspended
          </p>
          <p style={{ color: '#744210', fontSize: '14px' }}>
            Your business account has been suspended, typically due to a failed
            payment. Please{' '}
            <a
              href="mailto:support@mastergiver.com"
              style={{ color: '#2F2B77', textDecoration: 'underline' }}
            >
              contact support
            </a>{' '}
            to restore access.
          </p>
        </div>
      )}

      {/* GENERIC SERVER ERROR */}
      {serverError && !isSuspended && (
        <div
          style={{
            background: '#FFF5F5',
            border: '1px solid #FEB2B2',
            borderRadius: '6px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#C53030',
            fontSize: '14px',
          }}
        >
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap="6">
          {/* EMAIL */}
          <Stack gap="3">
            <label style={labelStyle} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              style={inputStyle}
              placeholder="you@yourcompany.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p style={errorTextStyle}>{errors.email.message}</p>
            )}
          </Stack>

          {/* PASSWORD */}
          <Stack gap="3">
            <HStack justify="space-between" align="center">
              <label
                style={{ ...labelStyle, marginBottom: 0 }}
                htmlFor="password"
              >
                Password
              </label>
              <Link
                fontSize="small"
                color="text.link"
                textDecor="none"
                border="none"
              >
                <Nextlink href="/business/reset-password">
                  Forgot password?
                </Nextlink>
              </Link>
            </HStack>
            <BusinessPasswordInput
              id="password"
              {...register('password')}
              placeholder="Your password"
              disabled={isSubmitting}
            />
            {errors.password && (
              <p style={errorTextStyle}>{errors.password.message}</p>
            )}
          </Stack>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={primaryButtonStyle(isSubmitting)}
          >
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>
        </Stack>
      </form>

      {/* SIGN UP LINK */}
      <Text textAlign="center" fontSize="subheading" color="text.heading">
        Don&apos;t have an account?{' '}
        <Link color="brand.primary" fontWeight="600" textDecor="none">
          <Nextlink href="/business/signup">Create one</Nextlink>
        </Link>
      </Text>
    </Stack>
  );
};

export default SigninForm;

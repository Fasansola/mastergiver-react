'use client';

/**
 * Business panel sign-up form.
 *
 * Collects: Business Name, Email, Password, Confirm Password.
 * On success, the server action creates a User + Business record and signs
 * the user in automatically, then this component redirects to /business/confirm.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Nextlink from 'next/link';
import {
  businessSignUpSchema,
  type BusinessSignUpInput,
} from '@/lib/validations/business-auth.schema';
import { businessSignUpAction } from '@/lib/actions/business-auth.actions';
import BusinessPasswordInput from '@/components/business/shared/BusinessPasswordInput';
import {
  inputStyle,
  labelStyle,
  errorTextStyle,
  primaryButtonStyle,
} from '@/components/business/shared/styles';
import { Heading, Link, Stack, Text } from '@chakra-ui/react';

const SignupForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessSignUpInput>({
    resolver: zodResolver(businessSignUpSchema),
  });

  const onSubmit = async (data: BusinessSignUpInput) => {
    setServerError(null);
    const result = await businessSignUpAction(data);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    // Refresh the router so the new session cookie is picked up, then navigate
    router.refresh();
    router.push(result.redirectTo);
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
          Create your business profile
        </Heading>

        <Text fontSize="body" textAlign="center" color="text.primary">
          Start building your company&apos;s digital reputation today.
        </Text>
      </Stack>

      {/* SERVER-SIDE ERROR (e.g. duplicate email) */}
      {serverError && (
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
          {/* BUSINESS NAME */}
          <Stack gap="3">
            <label style={labelStyle} htmlFor="businessName">
              Business Name
            </label>
            <input
              id="businessName"
              {...register('businessName')}
              style={inputStyle}
              placeholder="Enter your business legal name..."
              disabled={isSubmitting}
            />
            {errors.businessName && (
              <p style={errorTextStyle}>{errors.businessName.message}</p>
            )}
          </Stack>

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
            <label style={labelStyle} htmlFor="password">
              Password
            </label>
            <BusinessPasswordInput
              id="password"
              {...register('password')}
              placeholder="At least 8 characters"
              disabled={isSubmitting}
            />
            {errors.password && (
              <p style={errorTextStyle}>{errors.password.message}</p>
            )}
          </Stack>

          {/* CONFIRM PASSWORD */}
          <Stack gap="3">
            <label style={labelStyle} htmlFor="confirmPassword">
              Confirm Password
            </label>
            <BusinessPasswordInput
              id="confirmPassword"
              {...register('confirmPassword')}
              placeholder="Repeat your password"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && (
              <p style={errorTextStyle}>{errors.confirmPassword.message}</p>
            )}
          </Stack>

          {/* AGREE TO TERMS */}
          <Stack gap="2">
            <label
              htmlFor="agreeToTerms"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                cursor: 'pointer',
              }}
            >
              <input
                id="agreeToTerms"
                type="checkbox"
                {...register('agreeToTerms')}
                disabled={isSubmitting}
                style={{
                  marginTop: '3px',
                  accentColor: '#2F2B77',
                  width: '16px',
                  height: '16px',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: '14px',
                  color: '#575C62',
                  lineHeight: '1.5',
                }}
              >
                I have read and agree to the{' '}
                <Nextlink
                  href="/terms"
                  style={{
                    color: '#2F2B77',
                    fontWeight: 600,
                    textDecoration: 'underline',
                  }}
                >
                  Terms of Use
                </Nextlink>{' '}
                and{' '}
                <Nextlink
                  href="/privacy"
                  style={{
                    color: '#2F2B77',
                    fontWeight: 600,
                    textDecoration: 'underline',
                  }}
                >
                  Privacy Policy
                </Nextlink>
                .
              </span>
            </label>
            {errors.agreeToTerms && (
              <p style={errorTextStyle}>{errors.agreeToTerms.message}</p>
            )}
          </Stack>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={primaryButtonStyle(isSubmitting)}
          >
            {isSubmitting ? 'Creating account…' : 'Create Account'}
          </button>
        </Stack>
      </form>

      {/* SIGN IN LINK */}
      <Text textAlign="center" fontSize="subheading" color="text.heading">
        Already have an account?{' '}
        <Link color="brand.primary" fontWeight="600" textDecor="none">
          <Nextlink href="/business/signin">Sign in</Nextlink>
        </Link>
      </Text>
    </Stack>
  );
};

export default SignupForm;

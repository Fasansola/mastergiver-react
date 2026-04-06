'use client';

/**
 * Business panel — request a password reset.
 *
 * Collects only the user's email address. After submission the form always
 * shows a success message regardless of whether the email exists in the
 * database — this prevents email enumeration (an attacker cannot tell from
 * the UI whether an account is registered).
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Nextlink from 'next/link';
import Image from 'next/image';
import {
  businessResetPasswordRequestSchema,
  type BusinessResetPasswordRequestInput,
} from '@/lib/validations/business-auth.schema';
import { businessRequestPasswordResetAction } from '@/lib/actions/business-auth.actions';
import {
  inputStyle,
  labelStyle,
  errorTextStyle,
  primaryButtonStyle,
} from '@/components/business/shared/styles';
import { Heading, Stack, Text, Link } from '@chakra-ui/react';
import SuccessIcon from '@/public/components-assets/Success Icon.svg';

const ResetPasswordForm = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessResetPasswordRequestInput>({
    resolver: zodResolver(businessResetPasswordRequestSchema),
  });

  const onSubmit = async (data: BusinessResetPasswordRequestInput) => {
    setServerError(null);
    setSuccessMessage(null);

    const result = await businessRequestPasswordResetAction(data);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    // Show the confirmation message — form is hidden after this
    setSuccessMessage(result.message);
  };

  // After submission, replace the form with a clean confirmation message
  if (successMessage) {
    return (
      <Stack align="center" gap="8">
        <Image
          alt="confirmation icon"
          src={SuccessIcon}
          width={100}
          height={100}
        />

        <Stack gap="4" align="center">
          <Heading
            className="font-display"
            fontSize="bigheading"
            fontWeight="700"
            textAlign="center"
            lineHeight="1.2em"
            color="text.heading"
          >
            Check your inbox
          </Heading>

          <Text color="text.primary">{successMessage}</Text>
        </Stack>

        {/* BACK TO SIGN IN */}
        <Link
          color="brand.primary"
          fontWeight="600"
          textDecor="none"
          textAlign="center"
          fontSize="subheading"
        >
          <Nextlink href="/business/signin">Back to sign in</Nextlink>
        </Link>
      </Stack>
    );
  }

  return (
    <Stack gap="10" align="center" w="100%">
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
          Reset your password
        </Heading>

        <Text fontSize="body" textAlign="center" color="text.primary">
          Enter your email and we&apos;ll send you a link to set a new password.
        </Text>
      </Stack>

      {/* SERVER ERROR */}
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

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="fullWidth">
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

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={primaryButtonStyle(isSubmitting)}
          >
            {isSubmitting ? 'Sending…' : 'Send Reset Link'}
          </button>
        </Stack>
      </form>

      {/* BACK TO SIGN IN */}
      <Link
        color="brand.primary"
        fontWeight="600"
        textDecor="none"
        textAlign="center"
        fontSize="subheading"
      >
        <Nextlink href="/business/signin">Back to sign in</Nextlink>
      </Link>
    </Stack>
  );
};

export default ResetPasswordForm;

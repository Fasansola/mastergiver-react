'use client';

/**
 * Business panel — set a new password using a reset token.
 *
 * This form is rendered after the user clicks the reset link in their email.
 * The `token` prop comes from the URL query string (?token=...) and is read
 * by the page component (app/business/reset-password/new/page.tsx), which
 * passes it here as a prop. The token is included as a hidden field so the
 * server action can validate it.
 *
 * On success  → redirects to /business/signin with a visual confirmation.
 * On failure  → shows an error with a link back to request a fresh link.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Nextlink from 'next/link';
import {
  businessResetPasswordSchema,
  type BusinessResetPasswordInput,
} from '@/lib/validations/business-auth.schema';
import { businessResetPasswordAction } from '@/lib/actions/business-auth.actions';
import BusinessPasswordInput from '@/components/business/shared/BusinessPasswordInput';
import {
  labelStyle,
  errorTextStyle,
  primaryButtonStyle,
} from '@/components/business/shared/styles';
import { Heading, Link, Stack, Text } from '@chakra-ui/react';

interface NewPasswordFormProps {
  /** The reset token extracted from the URL by the page component. */
  token: string;
}

const NewPasswordForm = ({ token }: NewPasswordFormProps) => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessResetPasswordInput>({
    resolver: zodResolver(businessResetPasswordSchema),
    defaultValues: { token }, // pre-fill the hidden token field
  });

  const onSubmit = async (data: BusinessResetPasswordInput) => {
    setServerError(null);
    const result = await businessResetPasswordAction(data);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    // Navigate to sign in — the page shows a success query param so a toast can appear
    router.push('/business/signin?passwordReset=true');
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
          Set new password
        </Heading>

        <Text fontSize="body" textAlign="center" color="text.primary">
          Choose a strong password for your business account.
        </Text>
      </Stack>

      {/* ERROR STATES */}
      {serverError && (
        <div
          style={{
            background: '#FFF5F5',
            border: '1px solid #FEB2B2',
            borderRadius: '6px',
            padding: '12px 16px',
            color: '#C53030',
            fontSize: '14px',
          }}
        >
          <p style={{ marginBottom: '8px' }}>{serverError}</p>
          {/* If the token is invalid/expired, guide the user to request a new one */}
          <Link
            color="brand.primary"
            fontSize="13px"
            textDecor="underline"
          >
            <Nextlink href="/business/reset-password">Request a new reset link →</Nextlink>
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Hidden token field — never displayed to the user */}
        <input type="hidden" {...register('token')} />

        <Stack gap="6">
          {/* NEW PASSWORD */}
          <Stack gap="3">
            <label style={labelStyle} htmlFor="password">
              New Password
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

          {/* CONFIRM NEW PASSWORD */}
          <Stack gap="3">
            <label style={labelStyle} htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <BusinessPasswordInput
              id="confirmPassword"
              {...register('confirmPassword')}
              placeholder="Repeat your new password"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && (
              <p style={errorTextStyle}>{errors.confirmPassword.message}</p>
            )}
          </Stack>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={primaryButtonStyle(isSubmitting)}
          >
            {isSubmitting ? 'Saving…' : 'Save New Password'}
          </button>
        </Stack>
      </form>
    </Stack>
  );
};

export default NewPasswordForm;

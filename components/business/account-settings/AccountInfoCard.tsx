'use client';

/**
 * Account Information card — Account Settings page.
 *
 * Lets the business owner update their Business Name and Email address.
 * Displays an inline success message or error message after submission.
 *
 * Uses React Hook Form + Zod for validation and TanStack Query useMutation
 * to call the server action, keeping data flow consistent with the rest of
 * the business panel.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { accountInfoSchema, type AccountInfoInput } from '@/lib/validations/business-account.schema';
import { updateAccountInfoAction } from '@/lib/actions/business-account.actions';
import {
  inputStyle,
  labelStyle,
  errorTextStyle,
  primaryButtonStyle,
} from '@/components/business/shared/styles';
import { Box, Stack } from '@chakra-ui/react';

interface AccountInfoCardProps {
  /** Current values loaded from the database by the Server Component. */
  defaultValues: AccountInfoInput;
}

const AccountInfoCard = ({ defaultValues }: AccountInfoCardProps) => {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountInfoInput>({
    resolver: zodResolver(accountInfoSchema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: updateAccountInfoAction,
    onSuccess: (result) => {
      if (!result.success) {
        setServerError(result.error);
        setSuccessMsg(null);
        return;
      }
      setSuccessMsg('Account information saved.');
      setServerError(null);
    },
  });

  const onSubmit = handleSubmit((data) => {
    setSuccessMsg(null);
    setServerError(null);
    mutation.mutate(data);
  });

  return (
    <Box
      background="#FFFFFF"
      borderRadius="12px"
      border="1px solid #E5E7EB"
      p={{ base: '5', md: '8' }}
    >
      {/* Card heading */}
      <h2
        className="font-display"
        style={{
          fontWeight: 700,
          fontSize: '20px',
          lineHeight: '150%',
          color: '#27262D',
          marginBottom: '24px',
        }}
      >
        Account Information
      </h2>

      <form onSubmit={onSubmit} noValidate>
        <Stack gap="6">
          {/* Business Name */}
          <Stack gap="3">
            <label style={labelStyle} htmlFor="companyName">
              Business Name
            </label>
            <input
              id="companyName"
              {...register('companyName')}
              style={inputStyle}
              placeholder="Acme Corp"
            />
            {errors.companyName && (
              <p style={errorTextStyle}>{errors.companyName.message}</p>
            )}
          </Stack>

          {/* Email */}
          <Stack gap="3">
            <label style={labelStyle} htmlFor="accountEmail">
              Email
            </label>
            <input
              id="accountEmail"
              type="email"
              {...register('email')}
              style={inputStyle}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p style={errorTextStyle}>{errors.email.message}</p>
            )}
          </Stack>

          {/* Feedback messages */}
          {serverError && (
            <p style={{ color: '#C53030', fontSize: '14px', margin: 0 }}>{serverError}</p>
          )}
          {successMsg && (
            <p style={{ color: '#276749', fontSize: '14px', margin: 0 }}>{successMsg}</p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            style={{
              ...primaryButtonStyle(mutation.isPending),
              width: 'auto',
              fontSize: '16px',
              height: '48px',
              padding: '0 32px',
              alignSelf: 'flex-start',
            }}
          >
            {mutation.isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </Stack>
      </form>
    </Box>
  );
};

export default AccountInfoCard;

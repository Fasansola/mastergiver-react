'use client';

/**
 * Change Password card — Account Settings page.
 *
 * Lets the business owner update their login password. Requires the current
 * password for verification before accepting a new one.
 *
 * The form resets after a successful save so the fields are cleared — this
 * is intentional (sensitive data should not linger in the DOM).
 *
 * Uses React Hook Form + Zod for validation and TanStack Query useMutation
 * to call the server action.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from '@/lib/validations/business-account.schema';
import { changePasswordAction } from '@/lib/actions/business-account.actions';
import BusinessPasswordInput from '@/components/business/shared/BusinessPasswordInput';
import {
  labelStyle,
  errorTextStyle,
  primaryButtonStyle,
} from '@/components/business/shared/styles';
import { Box, Stack } from '@chakra-ui/react';

const blank: ChangePasswordInput = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

const ChangePasswordCard = () => {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: blank,
  });

  const mutation = useMutation({
    mutationFn: changePasswordAction,
    onSuccess: (result) => {
      if (!result.success) {
        setServerError(result.error);
        setSuccessMsg(null);
        return;
      }
      // Clear the form — never leave passwords lingering in input fields
      reset(blank);
      setSuccessMsg('Password updated successfully.');
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
        Change Password
      </h2>

      <form onSubmit={onSubmit} noValidate>
        <Stack gap="6">
          {/* Current Password */}
          <Stack gap="3">
            <label style={labelStyle} htmlFor="currentPassword">
              Current Password
            </label>
            <BusinessPasswordInput
              id="currentPassword"
              placeholder="Your current password"
              {...register('currentPassword')}
            />
            {errors.currentPassword && (
              <p style={errorTextStyle}>{errors.currentPassword.message}</p>
            )}
          </Stack>

          {/* New Password */}
          <Stack gap="3">
            <label style={labelStyle} htmlFor="newPassword">
              New Password
            </label>
            <BusinessPasswordInput
              id="newPassword"
              placeholder="At least 8 chars, upper, lower, number"
              {...register('newPassword')}
            />
            {errors.newPassword && (
              <p style={errorTextStyle}>{errors.newPassword.message}</p>
            )}
          </Stack>

          {/* Confirm New Password */}
          <Stack gap="3">
            <label style={labelStyle} htmlFor="confirmNewPassword">
              Confirm New Password
            </label>
            <BusinessPasswordInput
              id="confirmNewPassword"
              placeholder="Repeat your new password"
              {...register('confirmNewPassword')}
            />
            {errors.confirmNewPassword && (
              <p style={errorTextStyle}>{errors.confirmNewPassword.message}</p>
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
            {mutation.isPending ? 'Saving…' : 'Update Password'}
          </button>
        </Stack>
      </form>
    </Box>
  );
};

export default ChangePasswordCard;

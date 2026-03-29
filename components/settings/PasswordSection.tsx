'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Stack,
  HStack,
  Text,
  Button,
  Field,
} from '@chakra-ui/react';
import { PasswordInput } from '@/components/ui/password-input';
import {
  changePasswordFormSchema,
  type ChangePasswordFormInput,
} from '@/lib/validations/account.schema';
import { updatePassword } from '@/lib/actions/account.actions';

export default function PasswordSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormInput>({
    resolver: zodResolver(changePasswordFormSchema),
  });

  const handleEdit = () => {
    reset();
    setServerError(null);
    setSuccessMessage(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset();
    setServerError(null);
    setIsEditing(false);
  };

  const onSubmit = async (data: ChangePasswordFormInput) => {
    setServerError(null);
    setIsLoading(true);

    const result = await updatePassword(data.currentPassword, data.newPassword);

    setIsLoading(false);

    if (!result.success) {
      setServerError(result.error ?? 'Something went wrong.');
      return;
    }

    reset();
    setSuccessMessage(result.message ?? 'Password updated successfully.');
    setIsEditing(false);
  };

  return (
    <Stack gap="4">
      <Text fontWeight="600" fontSize="subheading" color="text.heading">
        Password
      </Text>

      {successMessage && !isEditing && (
        <Text fontSize="small" color="green.600">
          {successMessage}
        </Text>
      )}

      {isEditing ? (
        <Stack gap="4" as="form" onSubmit={handleSubmit(onSubmit)}>
          {/* Current password */}
          <Field.Root invalid={!!errors.currentPassword}>
            <Field.Label color="text.primary" fontWeight="500">
              Current Password
            </Field.Label>
            <PasswordInput
              {...register('currentPassword')}
              className="inputForm fullWidth"
              placeholder="Enter current password"
            />
            {errors.currentPassword && (
              <Text color="text.error" fontSize="small">
                {errors.currentPassword.message}
              </Text>
            )}
          </Field.Root>

          {/* New password */}
          <Field.Root invalid={!!errors.newPassword}>
            <Field.Label color="text.primary" fontWeight="500">
              New Password
            </Field.Label>
            <PasswordInput
              {...register('newPassword')}
              className="inputForm fullWidth"
              placeholder="Enter new password"
            />
            {errors.newPassword && (
              <Text color="text.error" fontSize="small">
                {errors.newPassword.message}
              </Text>
            )}
          </Field.Root>

          {/* Confirm new password */}
          <Field.Root invalid={!!errors.confirmNewPassword}>
            <Field.Label color="text.primary" fontWeight="500">
              Confirm New Password
            </Field.Label>
            <PasswordInput
              {...register('confirmNewPassword')}
              className="inputForm fullWidth"
              placeholder="Re-enter new password"
            />
            {errors.confirmNewPassword && (
              <Text color="text.error" fontSize="small">
                {errors.confirmNewPassword.message}
              </Text>
            )}
          </Field.Root>

          {serverError && (
            <Text color="text.error" fontSize="small">
              {serverError}
            </Text>
          )}

          <HStack>
            <Button type="submit" loading={isLoading}>
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </HStack>
        </Stack>
      ) : (
        <HStack justify="space-between" align="center">
          <Text color="text.secondary" letterSpacing="widest">
            ••••••••
          </Text>
          <Button size="sm" variant="outline" onClick={handleEdit}>
            Edit
          </Button>
        </HStack>
      )}
    </Stack>
  );
}

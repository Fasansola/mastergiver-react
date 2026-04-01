'use client';

import {
  ResetPasswordInput,
  resetPasswordSchema,
} from '@/lib/validations/auth.schema';
import { Alert, Button, Field, Flex, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PasswordInput } from '../ui/password-input';
import { resetPasswordAction } from '@/lib/actions/auth.actions';

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Omit<ResetPasswordInput, 'token'>>({
    resolver: zodResolver(resetPasswordSchema.omit({ token: true })),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = async (data: Omit<ResetPasswordInput, 'token'>) => {
    setServerError(null);

    const result = await resetPasswordAction({
      token,
      password: data.password,
    });

    if (!result.success) {
      setServerError(result.error ?? 'Something went wrong.');
      return;
    }

    // Success - redirect to login
    router.push('/login?reset=success');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column" gap="formGap">
        {/* SERVER ERROR */}

        {serverError && (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{serverError}</Alert.Title>
            </Alert.Content>
          </Alert.Root>
        )}

        {/* NEW PASSWORD */}
        <Field.Root invalid={!!errors.password}>
          <Field.Label color="text.primary">New Password</Field.Label>
          <PasswordInput
            className="inputForm"
            {...register('password')}
            disabled={isSubmitting}
            placeholder="Enter your new password"
          />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
          <Text color="text.secondary" fontSize="small" mt="2">
            Must be at least 8 characters with uppercase, lowercase, and numbers
          </Text>
        </Field.Root>

        <Button
          type="submit"
          disabled={isSubmitting}
          variant="solid"
          w="fit-content"
        >
          {isSubmitting ? 'Resetting password...' : 'Reset Password'}
        </Button>
      </Flex>
    </form>
  );
};

export default ResetPasswordForm;

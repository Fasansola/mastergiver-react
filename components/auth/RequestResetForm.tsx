'use client';

import { requestPasswordResetAction } from '@/lib/actions/auth.actions';
import {
  resetPasswordRequestSchema,
  ResetPasswordRequestInput,
} from '@/lib/validations/auth.schema';
import { Flex, Alert, Field, Input, Button } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

const RequestResetForm = () => {
  const [serverMessage, setServerMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordRequestInput>({
    resolver: zodResolver(resetPasswordRequestSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ResetPasswordRequestInput) => {
    setServerMessage(null);

    const result = await requestPasswordResetAction(data);

    if (!result.success) {
      setServerMessage({
        type: 'error',
        text: result.error ?? 'Something went wrong',
      });
      return;
    }

    setServerMessage({
      type: 'success',
      text: result.message ?? 'Reset email sent! Check your inbox.',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column" gap="formGap">
        {/* SERVER ERROR */}

        {serverMessage && (
          <Alert.Root status={serverMessage.type}>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{serverMessage.text}</Alert.Title>
            </Alert.Content>
          </Alert.Root>
        )}

        {/* EMAIL */}
        <Field.Root invalid={!!errors.email}>
          <Field.Label color="text.primary">
            Email <Field.RequiredIndicator />
          </Field.Label>
          <Input
            className="inputForm"
            disabled={isSubmitting}
            {...register('email')}
          />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>

        <Button
          type="submit"
          disabled={isSubmitting}
          variant="solid"
          w="fit-content"
        >
          {isSubmitting ? 'Sending...' : 'Send reset link'}
        </Button>
      </Flex>
    </form>
  );
};

export default RequestResetForm;

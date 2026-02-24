'use client';

import { LoginInput, loginSchema } from '@/lib/validations/auth.schema';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Alert, Button, Field, Flex, Input, Text } from '@chakra-ui/react';
import { PasswordInput } from '@/components/ui/password-input';
import { login } from '@/lib/auth/auth.actions';
import Link from 'next/link';

const LoginForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);

    const result = await login(data);

    if (!result.success) {
      setServerError(result.error ?? 'Something went wrong');
      return;
    }

    if (result.redirectTo) {
      router.push(result.redirectTo);
    } else {
      // Redirect to dashboard
      router.push('/dashboard');
    }
    router.refresh(); // Refresh to update session
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

        {/* PASSWORD */}
        <Field.Root invalid={!!errors.password}>
          <Field.Label color="text.primary">Password</Field.Label>
          <PasswordInput className="inputForm" {...register('password')} />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>

        {/* FORGOT PASSWORD LINK */}
        <Flex justify="flex-end">
          <Link href="/reset-password">
            <Text
              color="brand.primary"
              fontSize="small"
              _hover={{ textDecoration: 'underline' }}
            >
              Forgot password?
            </Text>
          </Link>
        </Flex>

        <Button
          type="submit"
          disabled={isSubmitting}
          variant="solid"
          w="fit-content"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </Flex>
    </form>
  );
};

export default LoginForm;

'use client';

import { SignUpInput, signUpSchema } from '@/lib/validations/auth.schema';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Alert, Button, Checkbox, Field, Flex, Input } from '@chakra-ui/react';
import { PasswordInput } from '@/components/ui/password-input';
import { signUp } from '@/lib/auth/auth.actions';

const SignUpForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      username: '',
      firstName: '',
      lastName: '',
      terms: false,
    },
  });

  const invalidTerms = !!errors.terms;

  const onSubmit = async (data: SignUpInput) => {
    setServerError(null);

    const result = await signUp(data);

    if (!result.success) {
      setServerError(result.error ?? 'Something went wrong');
      return;
    }

    // Redirect to check-email confirmation page
    router.push('/verify-email/check-email');
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

        {/* FIRST & LAST NAME */}

        <Flex gap={3}>
          <Field.Root invalid={!!errors.firstName}>
            <Field.Label color="text.primary">
              First name
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              className="inputForm"
              disabled={isSubmitting}
              {...register('firstName')}
            />
            <Field.ErrorText>{errors.firstName?.message}</Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!errors.lastName}>
            <Field.Label color="text.primary">
              Last name <Field.RequiredIndicator />
            </Field.Label>
            <Input
              className="inputForm"
              disabled={isSubmitting}
              {...register('lastName')}
            />
            <Field.ErrorText>{errors.lastName?.message}</Field.ErrorText>
          </Field.Root>
        </Flex>

        {/* USERNAME */}
        <Field.Root invalid={!!errors.username}>
          <Field.Label color="text.primary">
            Username <Field.RequiredIndicator />
          </Field.Label>
          <Input
            className="inputForm"
            disabled={isSubmitting}
            {...register('username')}
          />
          <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
        </Field.Root>

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

        {/* TERMS */}

        <Controller
          control={control}
          name="terms"
          render={({ field }) => (
            <Field.Root invalid={invalidTerms} disabled={field.disabled}>
              <Checkbox.Root
                checked={field.value}
                onCheckedChange={({ checked }) => field.onChange(checked)}
                size="sm"
                variant="solid"
                colorPalette="brand"
              >
                <Checkbox.HiddenInput className="cursor-pointer" />
                <Checkbox.Control className="cursor-pointer" />
                <Checkbox.Label color="text.primary" className="cursor-pointer">
                  I have read and agree to the Terms of Use and Privacy Policy.
                </Checkbox.Label>
              </Checkbox.Root>
              <Field.ErrorText>{errors.terms?.message}</Field.ErrorText>
            </Field.Root>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          variant="solid"
          w="fit-content"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
      </Flex>
    </form>
  );
};

export default SignUpForm;

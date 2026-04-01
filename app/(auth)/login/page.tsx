import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import { Alert, Flex, Text } from '@chakra-ui/react';
import AuthHeading from '@/components/auth/AuthHeading';
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Login | MasterGiver',
  description: 'Sign in to your MasterGiver account',
};

interface LoginPageProps {
  searchParams: Promise<{ reset?: string }>;
}

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const session = await auth();

  if (session?.user) {
    redirect('/dashboard');
  }

  const showResetSuccess = (await searchParams).reset === 'success';
  return (
    <Flex direction="column" width="100%" gap="40px">
      <AuthHeading title="Welcome back">
        You don&apos;t have an account?{' '}
        <Link href="/signup">
          <Text as="span" color="text.link" fontWeight="500">
            Create an account
          </Text>
        </Link>
      </AuthHeading>

      {/* Password Reset Success Message */}
      {showResetSuccess && (
        <Alert.Root status="success" borderRadius="input">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>
              Password reset successful! You can now log in with your new
              password.
            </Alert.Title>
          </Alert.Content>
        </Alert.Root>
      )}

      <LoginForm />
    </Flex>
  );
};

export default LoginPage;

import AuthHeading from '@/components/auth/AuthHeading';
import RequestResetForm from '@/components/auth/RequestResetForm';
import { auth } from '@/lib/auth/auth';
import { Flex } from '@chakra-ui/react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Reset Password | MasterGiver',
  description: 'Reset your password',
};

const ResetPasswordPage = async () => {
  const session = await auth();

  if (session?.user) {
    redirect('/dashboard');
  }
  return (
    <Flex direction="column" width="100%" gap="40px">
      <AuthHeading title="Forgot your password?">
        No worries! Enter your email and we&apos;ll send you a reset link.
      </AuthHeading>
      <RequestResetForm />
    </Flex>
  );
};

export default ResetPasswordPage;

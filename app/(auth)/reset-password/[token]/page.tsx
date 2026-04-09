import type { Metadata } from 'next';
import AuthHeading from '@/components/auth/AuthHeading';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import SuccessVerifier from '@/components/auth/SuccessVerifier';
import { verifyPasswordResetToken } from '@/lib/auth/token';
import { Flex } from '@chakra-ui/react';

export const metadata: Metadata = {
  title: 'Set New Password | MasterGiver',
  description: 'Create a new password for your MasterGiver account.',
  robots: { index: false },
};

interface Props {
  params: Promise<{ token: string }>;
}

const page = async ({ params }: Props) => {
  const { token } = await params;

  // Verify token is valid

  const result = await verifyPasswordResetToken(token);

  // Invalid or expired token
  if (!result.success) {
    return (
      <SuccessVerifier title="Invalid reset link" status="error">
        {result.error || 'This password reset link is invalid or has expired.'}
      </SuccessVerifier>
    );
  }

  return (
    <Flex direction="column" width="100%" gap="40px">
      <AuthHeading title="Reset Password?">
        Please type something you&apos;ll remember.
      </AuthHeading>
      <ResetPasswordForm token={token} />
    </Flex>
  );
};

export default page;

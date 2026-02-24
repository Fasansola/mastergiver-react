import { redirect } from 'next/navigation';
import { verifyEmail } from '@/lib/auth/auth.actions';
import { prisma } from '@/lib/prisma';
import { VerificationResult } from '@/components/auth/VerificationResult';

interface VerifyEmailPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = await searchParams;
  const token = params.token;

  // No token provided
  if (!token) {
    return <VerificationResult status="missing-token" />;
  }

  // Verify the token
  const result = await verifyEmail(token);

  // Token invalid or expired
  if (!result.success) {
    return (
      <VerificationResult
        status="error"
        error={result.error}
        email={result.email}
      />
    );
  }

  // Get user to check onboarding status
  const user = await prisma.user.findUnique({
    where: { email: result.email },
    include: {
      onboarding: true,
    },
  });

  if (!user) {
    return <VerificationResult status="error" error="User not found" />;
  }

  // Check if onboarding is completed
  const shouldOnboard = !user.onboarding?.isCompleted;

  // Redirect based on onboarding status
  if (shouldOnboard) {
    redirect('/onboarding');
  } else {
    redirect('/dashboard');
  }
}

import { verifyEmail } from '@/lib/auth/auth.actions';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { VerificationResult } from '@/components/auth/VerificationResult';
import { verifyTokenAndRedirect } from '@/lib/auth/verify-token-page';

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

  const outcome = await verifyTokenAndRedirect({
    token,
    // successRedirect is omitted — the redirect destination depends on the
    // user's onboarding status, so verifyFn handles it after a DB lookup.
    verifyFn: async (t): Promise<{ success: boolean; error?: string; email?: string }> => {
      const result = await verifyEmail(t);

      if (!result.success) {
        return { success: false, error: result.error, email: result.email };
      }

      const user = await prisma.user.findUnique({
        where: { email: result.email },
        include: { onboarding: true },
      });

      if (!user) {
        return { success: false, error: 'User not found.' };
      }

      redirect(user.onboarding?.isCompleted ? '/dashboard' : '/onboarding');
    },
  });

  // Only reached on error — redirect always fires on success inside verifyFn.

  if (outcome.error === 'missing-token') {
    return <VerificationResult status="missing-token" />;
  }

  return (
    <VerificationResult
      status="error"
      error={outcome.error}
      email={outcome.email}
    />
  );
}

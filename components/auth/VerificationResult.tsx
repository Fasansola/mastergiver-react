'use client';

import { Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import SuccessVerifier from './SuccessVerifier';
import { useRouter } from 'next/navigation';
import { resendVerificationEmail } from '@/lib/auth/auth.actions';

interface VerificationResultProps {
  status: 'missing-token' | 'error' | 'verifying';
  error?: string;
  email?: string;
}

export function VerificationResult({
  status,
  email,
  error,
}: VerificationResultProps) {
  const router = useRouter();
  const [resendStatus, setResendStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [resendMessage, setResendMessage] = useState<string>('');

  useEffect(() => {
    if (resendStatus === 'success') {
      router.push('/verify-email/check-email');
    }
  }, [resendStatus, router]);

  const handleResend = async () => {
    if (!email) {
      // We don't have the email here, so user needs to go back to sign-up
      setResendStatus('error');
      setResendMessage(
        'Please return to the sign-up page to request a new verification email.'
      );
      return;
    }

    setResendStatus('loading');

    try {
      const result = await resendVerificationEmail(email);

      if (result.success) {
        setResendStatus('success');
        setResendMessage('Verification email sent! Please check your inbox.');
      } else {
        setResendStatus('error');
        setResendMessage(
          result.error || 'Failed to send email. Please try again.'
        );
      }
    } catch {
      setResendStatus('error');
      setResendMessage('Something went wrong. Please try again.');
    }
  };

  if (status === 'verifying') {
    return (
      <SuccessVerifier title="Verifying your email..." status={status}>
        Please wait while we verify your account.
      </SuccessVerifier>
    );
  }

  if (resendStatus === 'error') {
    return (
      <SuccessVerifier title="Unknown Error" status={status}>
        {resendMessage}
      </SuccessVerifier>
    );
  }

  if (status === 'missing-token') {
    return (
      <SuccessVerifier title="Invalid Verification Link" status={status}>
        The verification link is missing or incomplete.
      </SuccessVerifier>
    );
  }

  if (status === 'error') {
    return (
      <SuccessVerifier title="Verification Failed" status={status}>
        {error || 'Something went wrong. Please try again.'}

        {email && (
          <Button
            variant="outline"
            onClick={handleResend}
            disabled={resendStatus === 'loading'}
          >
            {resendStatus === 'loading' ? 'Sending...' : 'Resend Email'}
          </Button>
        )}
      </SuccessVerifier>
    );
  }

  return null;
}

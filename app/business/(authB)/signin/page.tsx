/**
 * Business sign-in page — /business/signin
 *
 * A thin Server Component that wraps the sign-in form in the centered
 * auth card. All form logic and redirect handling lives in <SigninForm>.
 *
 * Also handles the ?passwordReset=true query param that NewPasswordForm
 * appends after a successful password reset — shows a success banner above
 * the form so the user knows they can now sign in with their new password.
 */

import type { Metadata } from 'next';
import { type SearchParams } from 'next/dist/server/request/search-params';
import BusinessAuthCard from '@/components/business/auth/BusinessAuthCard';
import SigninForm from '@/components/business/auth/SigninForm';
import { redirectIfBusinessSession } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Business Sign In | MasterGiver',
  description: 'Sign in to your MasterGiver business account to manage your community impact profile.',
};

interface SigninPageProps {
  searchParams: Promise<SearchParams>;
}

const BusinessSigninPage = async ({ searchParams }: SigninPageProps) => {
  await redirectIfBusinessSession();

  const params = await searchParams;
  const passwordWasReset = params.passwordReset === 'true';

  return (
    <BusinessAuthCard>
      {/* Success banner shown after a password reset completes */}
      {passwordWasReset && (
        <div
          style={{
            background: '#F0FFF4',
            border: '1px solid #9AE6B4',
            borderRadius: '6px',
            padding: '12px 16px',
            marginBottom: '24px',
            color: '#276749',
            fontSize: '14px',
          }}
        >
          Password reset successfully. You can now sign in with your new password.
        </div>
      )}

      <SigninForm />
    </BusinessAuthCard>
  );
};

export default BusinessSigninPage;

/**
 * Business password reset request page — /business/reset-password
 *
 * Step 1 of password reset: the user enters their email address.
 * The form always shows a success confirmation after submission, regardless
 * of whether the email is registered (security best practice).
 *
 * Step 2 (entering the new password) happens at /business/reset-password/new
 * after the user clicks the link in the email.
 */

import type { Metadata } from 'next';
import BusinessAuthCard from '@/components/business/auth/BusinessAuthCard';
import ResetPasswordForm from '@/components/business/auth/ResetPasswordForm';
import { redirectIfBusinessSession } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Reset Password | MasterGiver Business',
  description: 'Reset your MasterGiver business account password.',
};

const BusinessResetPasswordPage = async () => {
  await redirectIfBusinessSession();

  return (
    <BusinessAuthCard>
      <ResetPasswordForm />
    </BusinessAuthCard>
  );
};

export default BusinessResetPasswordPage;

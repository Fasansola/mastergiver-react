/**
 * Business sign-up page — /business/signup
 *
 * A thin Server Component that wraps the sign-up form in the centered
 * auth card. All form logic lives in <SignupForm>.
 */

import type { Metadata } from 'next';
import BusinessAuthCard from '@/components/business/auth/BusinessAuthCard';
import SignupForm from '@/components/business/auth/SignupForm';
import { redirectIfBusinessSession } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Create a Business Account | MasterGiver',
  description: 'Join MasterGiver to showcase your business community impact and build verified reputation signals.',
};

const BusinessSignupPage = async () => {
  await redirectIfBusinessSession();

  return (
    <BusinessAuthCard>
      <SignupForm />
    </BusinessAuthCard>
  );
};

export default BusinessSignupPage;

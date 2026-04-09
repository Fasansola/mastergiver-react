/**
 * Business sign-up page — /business/signup
 *
 * A thin Server Component that wraps the sign-up form in the centered
 * auth card. All form logic lives in <SignupForm>.
 */

import BusinessAuthCard from '@/components/business/auth/BusinessAuthCard';
import SignupForm from '@/components/business/auth/SignupForm';
import { redirectIfBusinessSession } from '@/lib/auth/session';

const BusinessSignupPage = async () => {
  await redirectIfBusinessSession();

  return (
    <BusinessAuthCard>
      <SignupForm />
    </BusinessAuthCard>
  );
};

export default BusinessSignupPage;

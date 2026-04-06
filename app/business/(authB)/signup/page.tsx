/**
 * Business sign-up page — /business/signup
 *
 * A thin Server Component that wraps the sign-up form in the centered
 * auth card. All form logic lives in <SignupForm>.
 */

import BusinessAuthCard from '@/components/business/auth/BusinessAuthCard';
import SignupForm from '@/components/business/auth/SignupForm';

const BusinessSignupPage = () => {
  return (
    <BusinessAuthCard>
      <SignupForm />
    </BusinessAuthCard>
  );
};

export default BusinessSignupPage;

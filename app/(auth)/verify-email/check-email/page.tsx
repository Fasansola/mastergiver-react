import SuccessVerifier from '@/components/auth/SuccessVerifier';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Check your email | MasterGiver',
  description: 'Verify your email to continue',
};

const CheckEmailPage = () => {
  return (
    <SuccessVerifier title="Verify Your Email">
      Verify your email to proceed with your profile setup.
    </SuccessVerifier>
  );
};

export default CheckEmailPage;

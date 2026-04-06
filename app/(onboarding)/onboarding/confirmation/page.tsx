import SuccessVerifier from '@/components/auth/SuccessVerifier';
import { Button, Stack } from '@chakra-ui/react';
import Link from 'next/link';

const ConfirmarionPage = () => {
  return (
    <SuccessVerifier
      title={'Congratulations, your account is live now.'}
      status="confirmation"
    >
      <Stack gap="8" align="center">
        Go to your Dashboard to explore your new profile.
        <Link href="/dashboard">
          <Button colorScheme="brand" size="md">
            Go to Dashboard
          </Button>
        </Link>
      </Stack>
    </SuccessVerifier>
  );
};

export default ConfirmarionPage;

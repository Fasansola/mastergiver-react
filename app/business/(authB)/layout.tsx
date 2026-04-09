import BusinessHeader from '@/components/business/layout/BusinessHeader';
import { Stack } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <BusinessHeader />
      <Stack
        minH="calc(100vh - 100px)"
        align="center"
        justify="center"
        py={{ base: '8', md: '10' }}
        px={{ base: '4', md: '6' }}
      >
        {children}
      </Stack>
    </>
  );
};

export default AuthLayout;

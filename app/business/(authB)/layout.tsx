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
        py="6"
        px="4"
      >
        {children}
      </Stack>
    </>
  );
};

export default AuthLayout;

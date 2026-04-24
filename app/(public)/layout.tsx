import BusinessHeader from '@/components/business/layout/BusinessHeader';
import Footer from '@/components/layout/Footer';
import { Stack } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

const PublicLayout = ({ children }: PropsWithChildren) => {
  return (
    <Stack gap="0" bgColor="white" overflowX="hidden" className="font-body">
      <BusinessHeader bgColor="linear-gradient(107.69deg, #F3F6FF 0%, #F1F5FF 100%)" hideAuthButtons />
      {children}
      <Footer />
    </Stack>
  );
};

export default PublicLayout;

import BusinessHeader from '@/components/business/layout/BusinessHeader';
import Footer from '@/components/layout/Footer';
import { Stack } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import { HERO_GRADIENT } from '@/lib/theme/gradients';

const PublicLayout = ({ children }: PropsWithChildren) => {
  return (
    <Stack gap="0" bgColor="background.white" overflowX="hidden" className="font-body">
      <BusinessHeader bgColor={HERO_GRADIENT} />
      {children}
      <Footer />
    </Stack>
  );
};

export default PublicLayout;

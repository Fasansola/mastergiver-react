/**
 * Centered card wrapper used by all business auth pages.
 *
 * Provides the white card on a light-grey background that frames the
 * signup, signin, and password-reset forms. The dashboard layout does
 * NOT use this component — it has its own sidebar-based layout.
 */

import { Stack } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

const BusinessAuthCard = ({ children }: PropsWithChildren) => {
  return (
    <Stack
      bgColor="#FFFFFF"
      maxW="660px"
      p={{ base: '6', md: '12' }}
      borderRadius="16px"
      w="100%"
      boxShadow="0px 1px 2px 0px #4646490F, 0px 5px 3px 0px #4646490A"
    >
      {children}
    </Stack>
  );
};

export default BusinessAuthCard;

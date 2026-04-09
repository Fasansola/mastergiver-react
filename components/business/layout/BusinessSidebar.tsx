/**
 * Business dashboard sidebar.
 *
 * A Server Component that composes all sidebar pieces:
 *   - Avatar (logo or initials)
 *   - Company name
 *   - Navigation links + logout (Client Component — needs usePathname/router)
 *
 * Receives business data as props (already fetched by the layout) to avoid
 * an extra database round-trip.
 */

import BusinessSidebarNav from './BusinessSidebarNav';
import { Heading, Stack } from '@chakra-ui/react';

interface BusinessSidebarProps {
  isDrawer?: boolean;
}

const BusinessSidebar = ({ isDrawer = false }: BusinessSidebarProps) => {
  return (
    <Stack
      as="aside"
      w={isDrawer ? 'full' : '25%'}
      minW={isDrawer ? undefined : '320px'}
      maxW={isDrawer ? undefined : '400px'}
      h={isDrawer ? undefined : 'calc(100vh - 100px)'}
      minH={isDrawer ? undefined : 'calc(100vh - 100px)'}
      p={isDrawer ? '6' : '10'}
      borderRight={isDrawer ? 'none' : '1px solid'}
      borderColor="border.default"
      gap="6"
    >
      {/* Section label + nav (nav includes logout at the bottom) */}
      <Heading
        fontSize="heading"
        fontWeight="700"
        textTransform="uppercase"
        color="text.primary"
      >
        Settings
      </Heading>
      <BusinessSidebarNav />
    </Stack>
  );
};

export default BusinessSidebar;

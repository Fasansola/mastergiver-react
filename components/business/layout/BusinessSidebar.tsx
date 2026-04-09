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

const BusinessSidebar = () => {
  return (
    <Stack
      as="aside"
      w="25%"
      minW="320px"
      maxW="400px"
      h="calc(100vh - 100px)"
      minH="calc(100vh - 100px)"
      p="10"
      borderRight="1px solid"
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

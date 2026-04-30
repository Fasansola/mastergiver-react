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
import { Heading, Stack, Text, HStack, Link } from '@chakra-ui/react';
import Image from 'next/image';
import MailIcon from '@/public/components-assets/mail.svg';

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

      {/* Contact Us box — pushed away from nav with top margin */}
      <Stack
        mt="8"
        p="5"
        gap="3"
        bgColor="white"
        borderRadius="16px"
        border="1px solid"
        borderColor="border.default"
        boxShadow="0px 1px 2px 0px #4646490F, 0px 1px 3px 0px #4646490A"
      >
        <Heading
          fontSize="subheading"
          fontWeight="700"
          color="text.primary"
          className="font-body"
          textTransform="uppercase"
          letterSpacing="1.16px"
        >
          Contact Us
        </Heading>
        <HStack gap="2" align="center">
          <Image src={MailIcon} alt="" width={18} height={18} style={{ flexShrink: 0 }} />
          <Link
            href="mailto:support@mastergiver.com"
            style={{ textDecoration: 'none' }}
          >
            <Text
              fontSize="14px"
              fontWeight="500"
              color="text.secondary"
              _hover={{ color: 'brand.primary' }}
            >
              support@mastergiver.com
            </Text>
          </Link>
        </HStack>
      </Stack>
    </Stack>
  );
};

export default BusinessSidebar;

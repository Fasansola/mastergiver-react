import { HStack, Stack, Text, VStack, Link } from '@chakra-ui/react';
import Image from 'next/image';
import WhiteLogo from '@/public/brand-assets/logo-white.svg';
import NavItemList from './NavItemList';
import SidebarFooterBadge from './SidebarFooterBadge';

// Shared inner content used by both the desktop Sidebar and the mobile SidebarDrawer.
// The parent provides the outer shell (dimensions, bg, sticky positioning).

const SidebarContent = () => {
  return (
    <Stack flex="1" justifyContent="space-between" gap="8">
      <VStack align="start" gap="8">
        <HStack align="start" p="4">
          <Image src={WhiteLogo} alt="Logo" width={100} height={42} />
          <Text fontSize="small" color="text.white">
            BETA
          </Text>
        </HStack>
        <NavItemList />
      </VStack>

      <SidebarFooterBadge />
    </Stack>
  );
};

export default SidebarContent;

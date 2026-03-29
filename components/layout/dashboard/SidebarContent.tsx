import { HStack, Stack, Text, VStack, Link } from '@chakra-ui/react';
import Image from 'next/image';
import WhiteLogo from '@/public/brand-assets/logo-white.svg';
import MasterGiverBadge from '@/public/brand-assets/MastergiverBadge.png';
import NavItemList from './NavItemList';

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

      <VStack align="center" px="3" py="4" bgColor="brand.accent" gap="4">
        <Image
          src={MasterGiverBadge}
          alt="MasterGiver Badge"
          width={100}
          height={100}
        />
        <Text
          fontSize="sm"
          color="text.heading"
          textAlign="center"
          fontWeight="500"
        >
          Show Off Your Good Side!{' '}
          <Link
            href={MasterGiverBadge.src}
            download="MasterGiverBadge.png"
            color="text.link"
            display="inline"
          >
            Download your MasterGiver badge
          </Link>{' '}
          to add to your email signature or share on social media
        </Text>
      </VStack>
    </Stack>
  );
};

export default SidebarContent;

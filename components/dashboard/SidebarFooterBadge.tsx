import { VStack, Text, Link } from '@chakra-ui/react';
import MasterGiverBadge from '@/public/brand-assets/MastergiverBadge.png';
import Image from 'next/image';

const SidebarFooterBadge = () => {
  return (
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
  );
};

export default SidebarFooterBadge;

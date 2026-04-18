import { HStack } from '@chakra-ui/react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

interface FooterNavItemProps {
  image?: StaticImageData | string;
  href: string;
  children: ReactNode;
}

const FooterNavItem = ({ image, href, children }: FooterNavItemProps) => {
  return (
    <Link href={href} target={image && '_blank'}>
      <HStack
        gap="2"
        align="center"
        // fontWeight="500"
        fontSize="small"
        color="text.primary"
        _hover={{ color: 'brand.primary' }}
      >
        {image && <Image src={image} alt="Nav item icon" />}
        {children}
      </HStack>
    </Link>
  );
};

export default FooterNavItem;

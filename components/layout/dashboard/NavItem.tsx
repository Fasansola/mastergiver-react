'use client';

import { HStack } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
  href: string;
  iconSrc: string;
  label: string;
}

const NavItem = ({ href, iconSrc, label }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} className="w-full cursor-pointer">
      <HStack
        p="4"
        gap="3"
        bgColor={isActive ? 'background.hover' : ''}
        color="text.white"
        fontSize="sm"
        _hover={{ bgColor: 'background.hover' }}
      >
        <Image alt="Dashboard" src={iconSrc} width={24} height={24} />
        {label}
      </HStack>
    </Link>
  );
};

export default NavItem;

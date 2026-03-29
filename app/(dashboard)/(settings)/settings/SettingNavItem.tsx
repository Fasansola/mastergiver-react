'use client';

import { HStack } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SettingsNavItemProps {
  href: string;
  label: string;
}

const SettingNavItem = ({ href, label }: SettingsNavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} className="w-full cursor-pointer">
      <HStack
        px={{ base: '3', lg: '5' }}
        py={{ base: '3', lg: '6' }}
        gap="3"
        bgColor={isActive ? 'background.white' : ''}
        color={isActive ? 'text.primary' : ''}
        fontWeight="500"
        fontSize={{ base: 'sm', lg: 'md' }}
        justify={{ base: 'center', lg: 'flex-start' }}
        _hover={{ bgColor: 'background.white', color: 'brand.primary' }}
        borderBottom={{ base: 'none', lg: '1px solid' }}
        borderColor="border.default"
      >
        {label}
      </HStack>
    </Link>
  );
};

export default SettingNavItem;

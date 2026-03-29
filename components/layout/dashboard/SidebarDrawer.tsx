'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Drawer, HStack, IconButton, Portal } from '@chakra-ui/react';
import { LuMenu } from 'react-icons/lu';
import Image from 'next/image';
import WhiteLogo from '@/public/brand-assets/logo-white.svg';

interface SidebarDrawerProps {
  children: React.ReactNode;
}

// Renders the mobile top bar (logo + hamburger) and the slide-in sidebar Drawer.
// Only visible on base/md — the parent hides this on lg+ via the top bar's display prop.
// Closes automatically when the pathname changes (i.e. a nav link was clicked).

const SidebarDrawer = ({ children }: SidebarDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile top bar — hidden on lg+ */}
      <HStack
        display={{ base: 'flex', lg: 'none' }}
        px="4"
        py="3"
        bgColor="brand.primary"
        align="center"
        justify="space-between"
      >
        <Image src={WhiteLogo} alt="MasterGiver" width={100} height={42} />
        <IconButton
          aria-label="Open navigation menu"
          variant="ghost"
          color="white"
          _hover={{ bg: 'whiteAlpha.200' }}
          onClick={() => setIsOpen(true)}
        >
          <LuMenu size={24} />
        </IconButton>
      </HStack>

      <Drawer.Root
        open={isOpen}
        onOpenChange={(details) => setIsOpen(details.open)}
        placement="start"
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content maxW="264px" bgColor="brand.primary" p="0">
              {children}
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
};

export default SidebarDrawer;

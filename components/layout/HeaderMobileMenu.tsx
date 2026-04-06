'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Drawer, Portal } from '@chakra-ui/react';
import Menu from '@/public/components-assets/menu.svg';
import Image from 'next/image';

// Hamburger trigger + slide-in drawer for the public header on base/md viewports.
// Closes automatically when the pathname changes (link was tapped).

const HeaderMobileMenu = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <Image
        src={Menu}
        alt="Hamburger menu"
        width="28"
        onClick={() => setIsOpen(true)}
      />

      <Drawer.Root
        open={isOpen}
        onOpenChange={(details) => setIsOpen(details.open)}
        placement="end"
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content maxW="280px" bgColor="brand.primary">
              {children}
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
};

export default HeaderMobileMenu;

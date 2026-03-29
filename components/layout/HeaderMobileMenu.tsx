'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Drawer, IconButton, Portal, Stack } from '@chakra-ui/react';
import { LuMenu } from 'react-icons/lu';
import HeaderButtons from './HeaderButtons';

// Hamburger trigger + slide-in drawer for the public header on base/md viewports.
// Closes automatically when the pathname changes (link was tapped).

const HeaderMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <IconButton
        aria-label="Open menu"
        variant="ghost"
        colorPalette="brand"
        onClick={() => setIsOpen(true)}
      >
        <LuMenu size={24} />
      </IconButton>

      <Drawer.Root
        open={isOpen}
        onOpenChange={(details) => setIsOpen(details.open)}
        placement="end"
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content maxW="280px">
              <Drawer.Header borderBottomWidth="1px">
                <Drawer.Title>Menu</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Stack gap="3" pt="2">
                  <HeaderButtons direction="column" />
                </Stack>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
};

export default HeaderMobileMenu;

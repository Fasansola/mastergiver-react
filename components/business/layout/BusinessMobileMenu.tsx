/**
 * Mobile hamburger trigger + slide-in drawer for the business dashboard header.
 *
 * A Client Component because it uses useState/usePathname.
 * Renders a hamburger icon that opens a drawer from the left containing the
 * business sidebar (passed as children). Closes automatically when the route
 * changes (a nav link was tapped).
 *
 * Used only at base/md viewports — the parent hides it at lg+.
 */

'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Drawer, Portal } from '@chakra-ui/react';
import Image from 'next/image';
import Menu from '@/public/components-assets/menu.svg';

const BusinessMobileMenu = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer whenever the user navigates to a new page
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <Image
        src={Menu}
        alt="Open navigation menu"
        width={28}
        height={28}
        style={{ cursor: 'pointer' }}
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
            {/* White background to match the business sidebar design */}
            <Drawer.Content w="400px" maxW="100vw" bg="#FFFFFF" overflowY="auto">
              {children}
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
};

export default BusinessMobileMenu;

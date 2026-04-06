'use client';

/**
 * Logout nav item for the individual user sidebar.
 *
 * Renders exactly like a NavItem (same HStack + icon + label) but instead of
 * navigating to a route it opens a confirmation dialog before signing out.
 * On confirm it calls the shared logoutAction and redirects to /login.
 */

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { HStack } from '@chakra-ui/react';
import LogOutIcon from '@/public/components-assets/log-out.svg';
import { logoutAction } from '@/lib/actions/auth.actions';
import LogoutConfirmDialog from '@/components/shared/LogoutConfirmDialog';

const LogoutNavItem = () => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirm = async () => {
    setIsLoggingOut(true);
    await logoutAction();
    router.push('/login');
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        style={{ width: '100%', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
      >
        <HStack
          p="4"
          gap="3"
          color="text.white"
          fontSize="sm"
          _hover={{ bgColor: 'background.hover' }}
        >
          <Image alt="Log out" src={LogOutIcon.src} width={24} height={24} />
          Log Out
        </HStack>
      </button>

      <LogoutConfirmDialog
        isOpen={dialogOpen}
        isLoading={isLoggingOut}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default LogoutNavItem;

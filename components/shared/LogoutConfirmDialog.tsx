'use client';

/**
 * Shared logout confirmation dialog.
 *
 * Used by both the individual user sidebar and the business dashboard sidebar.
 * Presents a simple "Are you sure?" prompt before the caller performs the
 * logout action. Fully controlled — open/close/loading state is owned by the
 * parent.
 *
 * Responsive: dialog width is capped at 90vw on mobile, sm on tablet+.
 */

import { Dialog, Portal, Button, HStack, Text, Stack } from '@chakra-ui/react';

interface LogoutConfirmDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmDialog = ({
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: LogoutConfirmDialogProps) => {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => {
        if (!isLoading) onClose();
        // suppress unused warning — details is part of the Chakra callback signature
        void details;
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW={{ base: '90vw', md: 'sm' }}>
            <Dialog.Header>
              <Dialog.Title>Sign out?</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Stack gap="2">
                <Text color="text.primary">
                  Are you sure you want to sign out of your account?
                </Text>
              </Stack>
            </Dialog.Body>

            <Dialog.Footer>
              <HStack gap="3" justify="flex-end">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  color="white"
                  bg="#2F2B77"
                  _hover={{ bg: '#1e1a5e' }}
                  _active={{ bg: '#17145a' }}
                  onClick={onConfirm}
                  loading={isLoading}
                >
                  Yes, sign out
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default LogoutConfirmDialog;

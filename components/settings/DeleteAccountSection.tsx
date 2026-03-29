'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stack, HStack, Text, Button, Dialog, Portal } from '@chakra-ui/react';
import { LuTriangleAlert } from 'react-icons/lu';
import { deleteAccount } from '@/lib/actions/account.actions';

export default function DeleteAccountSection() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setError(null);
    setIsLoading(true);

    const result = await deleteAccount();

    setIsLoading(false);

    if (!result.success) {
      setError(result.error ?? 'Something went wrong. Please try again.');
      return;
    }

    router.push(result.redirectTo ?? '/');
  };

  return (
    <>
      {/* Danger zone card */}
      <Stack
        p="6"
        gap="4"
        borderRadius="card"
        border="1px solid"
        borderColor="border.error"
        bg="#FFF5F5"
      >
        <HStack gap="3" alignItems="start">
          <LuTriangleAlert
            size={20}
            color="#E53E3E"
            style={{ marginTop: '2px', flexShrink: 0 }}
          />
          <Stack gap="1">
            <Text fontWeight="600" color="text.error">
              Delete Account
            </Text>
            <Text fontSize="small" color="text.secondary">
              Permanently delete your account and all associated data including
              your profile, organizations, causes, and skills. This action
              cannot be undone.
            </Text>
          </Stack>
        </HStack>

        <Button
          variant="outline"
          w="fit-content"
          color="text.error"
          borderColor="border.error"
          _hover={{ bg: '#FED7D7', borderColor: 'text.error' }}
          onClick={() => {
            setError(null);
            setIsOpen(true);
          }}
        >
          Delete Account
        </Button>
      </Stack>

      {/* Confirmation dialog */}
      <Dialog.Root
        open={isOpen}
        onOpenChange={(details) => {
          if (!isLoading) setIsOpen(details.open);
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Delete your account?</Dialog.Title>
              </Dialog.Header>

              <Dialog.Body>
                <Stack gap="4">
                  <Text color="text.primary">
                    This will permanently delete your MasterGiver profile and
                    all associated data:
                  </Text>
                  <Stack gap="1" pl="4">
                    <Text fontSize="small" color="text.secondary">
                      • Your public profile and giving pledge
                    </Text>
                    <Text fontSize="small" color="text.secondary">
                      • All causes, skills, and organizations you&apos;ve added
                    </Text>
                    <Text fontSize="small" color="text.secondary">
                      • Your account credentials
                    </Text>
                  </Stack>
                  <Text fontWeight="600" color="text.error" fontSize="small">
                    This action is permanent and cannot be undone.
                  </Text>

                  {error && (
                    <Text color="text.error" fontSize="small">
                      {error}
                    </Text>
                  )}
                </Stack>
              </Dialog.Body>

              <Dialog.Footer>
                <HStack gap="3">
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="white"
                    bg="text.error"
                    _hover={{ bg: '#C53030' }}
                    _active={{ bg: '#9B2C2C' }}
                    onClick={handleConfirm}
                    loading={isLoading}
                  >
                    Yes, Delete My Account
                  </Button>
                </HStack>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}

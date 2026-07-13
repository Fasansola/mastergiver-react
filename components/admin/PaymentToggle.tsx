'use client';

/**
 * PaymentToggle
 *
 * Admin toggle for the site-wide paymentRequired flag.
 * When turned OFF, all PENDING businesses are bulk-migrated to ACTIVE/FREE.
 * When turned ON, new signups will be routed through Stripe checkout again.
 */

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Box, HStack, Text, Stack } from '@chakra-ui/react';
import { setPaymentRequiredAction } from '@/lib/actions/admin-settings.actions';

interface Props {
  paymentRequired: boolean;
}

const PaymentToggle = ({ paymentRequired: initialValue }: Props) => {
  const [enabled, setEnabled] = useState(initialValue);
  const [isPending, startTransition] = useTransition();
  const [lastMigrated, setLastMigrated] = useState<number | null>(null);
  const router = useRouter();

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next); // optimistic
    setLastMigrated(null);
    startTransition(async () => {
      const result = await setPaymentRequiredAction(next);
      if (!result.success) {
        setEnabled(!next); // revert on failure
        alert(`Failed to update setting: ${result.error}`);
        return;
      }
      if (typeof result.migratedCount === 'number' && result.migratedCount > 0) {
        setLastMigrated(result.migratedCount);
      }
      router.refresh();
    });
  };

  return (
    <Stack gap="3">
      <HStack gap="4" align="center">
        {/* Toggle pill */}
        <Box
          as="button"
          role="switch"
          aria-checked={enabled}
          aria-label={enabled ? 'Disable payment requirement' : 'Enable payment requirement'}
          onClick={handleToggle}
          _disabled={{ opacity: 0.7, cursor: 'wait' }}
          aria-disabled={isPending}
          pointerEvents={isPending ? 'none' : 'auto'}
          w="52px"
          h="28px"
          borderRadius="full"
          bg={enabled ? '#F59E0B' : '#10B981'}
          position="relative"
          transition="background 0.2s"
          cursor={isPending ? 'wait' : 'pointer'}
          opacity={isPending ? 0.7 : 1}
          flexShrink="0"
          fontFamily="inherit"
        >
          <Box
            position="absolute"
            top="4px"
            left={enabled ? '27px' : '4px'}
            w="20px"
            h="20px"
            borderRadius="full"
            bg="white"
            boxShadow="0px 1px 3px rgba(0,0,0,0.2)"
            transition="left 0.2s"
          />
        </Box>

        <Stack gap="0">
          <Text
            fontSize="15px"
            fontWeight="700"
            color={enabled ? '#F59E0B' : '#10B981'}
            className="font-body"
          >
            {enabled ? 'Payment Required' : 'Free Access'}
          </Text>
          <Text fontSize="12px" color="text.secondary" className="font-body">
            {enabled
              ? 'New signups are routed through Stripe checkout'
              : 'New signups go directly to the dashboard'}
          </Text>
        </Stack>
      </HStack>

      {lastMigrated !== null && lastMigrated > 0 && (
        <Text fontSize="13px" color="#10B981" fontWeight="600" className="font-body">
          {lastMigrated} pending account{lastMigrated !== 1 ? 's' : ''} upgraded to free access.
        </Text>
      )}
    </Stack>
  );
};

export default PaymentToggle;

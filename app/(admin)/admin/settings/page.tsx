/**
 * /admin/settings — Site-wide feature flag controls.
 *
 * Currently exposes one toggle: paymentRequired.
 * Turning it OFF bulk-migrates all PENDING businesses to ACTIVE/FREE and
 * lets new signups skip the Stripe checkout entirely.
 * Turning it ON re-enables the payment gate for all new signups (existing
 * FREE accounts keep their access).
 */

import { Container, Stack, Heading, Text, Box, HStack, Grid } from '@chakra-ui/react';
import Link from 'next/link';
import { LuArrowLeft } from 'react-icons/lu';
import { getPaymentSettingsAction } from '@/lib/actions/admin-settings.actions';
import PaymentToggle from '@/components/admin/PaymentToggle';

export const dynamic = 'force-dynamic';

// ─── Stat pill ────────────────────────────────────────────────────────────────

const Stat = ({
  label,
  value,
  color = 'text.heading',
}: {
  label: string;
  value: number;
  color?: string;
}) => (
  <Stack gap="0" flex="1">
    <Text fontSize="24px" fontWeight="700" color={color} className="font-display">
      {value}
    </Text>
    <Text fontSize="12px" color="text.secondary" className="font-body">
      {label}
    </Text>
  </Stack>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminSettingsPage = async () => {
  const result = await getPaymentSettingsAction();

  if (!result.success) {
    return (
      <Container maxW="800px">
        <Text color="red.500">Failed to load settings: {result.error}</Text>
      </Container>
    );
  }

  const { paymentRequired, pendingCount, freeCount, proCount } = result;

  return (
    <Container maxW="800px">
      <Stack gap="8">
        {/* Back link */}
        <Link href="/admin">
          <HStack gap="1.5" color="text.secondary" _hover={{ color: 'brand.primary' }} transition="color 0.15s">
            <LuArrowLeft size={14} />
            <Text fontSize="13px" fontWeight="500" className="font-body">
              Admin Dashboard
            </Text>
          </HStack>
        </Link>

        {/* Page header */}
        <Stack gap="1">
          <Heading
            as="h1"
            className="font-display"
            fontWeight="700"
            fontSize={{ base: '24px', lg: '30px' }}
            color="text.heading"
          >
            Site Settings
          </Heading>
          <Text fontSize="14px" color="text.secondary" className="font-body">
            Control site-wide feature flags. Changes take effect immediately.
          </Text>
        </Stack>

        {/* Payment toggle card */}
        <Box
          bg="background.white"
          border="1px solid"
          borderColor="border.default"
          borderRadius="12px"
          overflow="hidden"
        >
          <Box h="3px" bg="#8B5CF6" />
          <Stack gap="6" p="6">
            <Stack gap="1">
              <Text fontSize="16px" fontWeight="700" color="text.heading" className="font-body">
                Payment Requirement
              </Text>
              <Text fontSize="13px" color="text.secondary" className="font-body" maxW="560px">
                When <strong>free access</strong> is active, new businesses sign up and go straight
                to their dashboard — no Stripe checkout. Flip back to{' '}
                <strong>payment required</strong> any time to re-enable billing for new signups.
                Existing free accounts are never affected by toggling this on.
              </Text>
            </Stack>

            <PaymentToggle paymentRequired={paymentRequired} />

            {/* Account breakdown */}
            <Box
              pt="5"
              borderTop="1px solid"
              borderColor="border.default"
            >
              <Stack gap="3">
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  color="text.secondary"
                  textTransform="uppercase"
                  letterSpacing="0.08em"
                  className="font-body"
                >
                  Business account breakdown
                </Text>
                <Grid templateColumns="repeat(3, 1fr)" gap="4">
                  <Stat
                    label="Free accounts"
                    value={freeCount}
                    color="#10B981"
                  />
                  <Stat
                    label="Paid (PRO)"
                    value={proCount}
                    color="#2F2B77"
                  />
                  <Stat
                    label="Pending (blocked)"
                    value={pendingCount}
                    color={pendingCount > 0 ? '#F59E0B' : 'text.heading'}
                  />
                </Grid>
                {pendingCount > 0 && (
                  <Text fontSize="12px" color="#F59E0B" className="font-body">
                    {pendingCount} account{pendingCount !== 1 ? 's are' : ' is'} currently blocked
                    at the payment gate. Switching to free access will upgrade{' '}
                    {pendingCount !== 1 ? 'them' : 'it'} immediately.
                  </Text>
                )}
              </Stack>
            </Box>
          </Stack>
        </Box>

        {/* Info box */}
        <Box
          bg="background.lightPurple"
          border="1px solid"
          borderColor="border.default"
          borderRadius="10px"
          p="5"
        >
          <Stack gap="2">
            <Text fontSize="13px" fontWeight="700" color="brand.primary" className="font-body">
              How this works
            </Text>
            <Stack gap="1" as="ul" listStyleType="disc" pl="4">
              {[
                'Free access → Payment required: future signups go through Stripe; no existing accounts are affected.',
                'Payment required → Free access: all pending accounts are upgraded to ACTIVE/FREE instantly.',
                'Stripe webhooks, billing portal, and subscription logic stay intact — the flag just bypasses the checkout gate.',
              ].map((line) => (
                <Text key={line} as="li" fontSize="12px" color="text.secondary" className="font-body">
                  {line}
                </Text>
              ))}
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export default AdminSettingsPage;

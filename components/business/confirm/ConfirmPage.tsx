'use client';

/**
 * Interactive confirm page for the business panel.
 *
 * State A — No session ID: shows the plan summary and "Continue to Payment" button.
 *   Clicking calls the server action to create a Stripe Checkout Session, then
 *   redirects to the Stripe-hosted payment page.
 *
 * State B — Session ID present (returned from Stripe): polls
 *   /api/business/activation-status every 3 s (up to 5 attempts) waiting for
 *   the webhook to activate the account.
 *   - ACTIVE → redirect to dashboard.
 *   - Exhausted → show fallback with manual retry and support link.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createCheckoutSessionAction } from '@/lib/actions/business-stripe.actions';
import { primaryButtonStyle } from '@/components/business/shared/styles';
import { Box, Heading, HStack, Separator, Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Badge from '@/public/brand-assets/MastergiverBadge.png';

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 5;

interface ConfirmPageProps {
  sessionId: string | null;
}

const FEATURES = [
  'Public Reputation Profile',
  'Verified Impact Badge',
  'Discoverable by AI & search engines',
  'Shareable with customers & partners',
];

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

/** Circular check pill + label row */
const CheckItem = ({ label }: { label: string }) => (
  <HStack gap="3" align="center">
    <Box
      w="22px"
      h="22px"
      borderRadius="full"
      bgColor="#ECEBF8"
      flexShrink={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <span style={{ color: '#2F2B77', fontSize: '11px', fontWeight: 700 }}>
        ✓
      </span>
    </Box>
    <Text fontSize="15px" color="#27262D" lineHeight="1.4">
      {label}
    </Text>
  </HStack>
);

// ---------------------------------------------------------------------------
// Polling / timeout states
// ---------------------------------------------------------------------------

const PollingState = () => (
  <Stack align="center" justify="center" minH="340px" gap="6">
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <Box
      w="56px"
      h="56px"
      border="3px solid #E2E1FF"
      borderTopColor="#2F2B77"
      borderRadius="full"
      style={{ animation: 'spin 0.9s linear infinite' }}
    />
    <Stack align="center" gap="2">
      <Heading
        className="font-display"
        fontSize="22px"
        fontWeight="700"
        color="#27262D"
        textAlign="center"
      >
        Confirming your payment…
      </Heading>
      <Text fontSize="16px" color="#575C62" textAlign="center" lineHeight="1.6">
        This usually takes just a few seconds.
        <br />
        Please don&apos;t close this tab.
      </Text>
    </Stack>
  </Stack>
);

const TimeoutState = ({ onRetry }: { onRetry: () => void }) => (
  <Stack align="center" justify="center" minH="340px" gap="6">
    <Text fontSize="48px">⏳</Text>
    <Stack align="center" gap="3" maxW="460px">
      <Heading
        className="font-display"
        fontSize="22px"
        fontWeight="700"
        color="#27262D"
        textAlign="center"
      >
        Still confirming…
      </Heading>
      <Text fontSize="16px" color="#575C62" textAlign="center" lineHeight="1.6">
        Your payment may have gone through but we haven&apos;t received
        confirmation yet. This can occasionally take a minute or two.
      </Text>
      <Text fontSize="14px" color="#9CA3AF" textAlign="center">
        If the problem persists, please{' '}
        <a
          href="mailto:support@mastergiver.com"
          style={{ color: '#2F2B77', textDecoration: 'underline' }}
        >
          contact support
        </a>
        .
      </Text>
    </Stack>
    <button
      type="button"
      onClick={onRetry}
      style={{ ...primaryButtonStyle(false), maxWidth: '320px' }}
    >
      Check Again
    </button>
  </Stack>
);

// ---------------------------------------------------------------------------
// Main payment prompt — two-column layout
// ---------------------------------------------------------------------------

const PaymentPrompt = ({
  onPay,
  isLoading,
  error,
}: {
  onPay: () => void;
  isLoading: boolean;
  error: string | null;
}) => (
  <Stack
    direction={{ base: 'column', md: 'row' }}
    gap={{ base: '10', md: '0' }}
    align="stretch"
  >
    {/* ── Left column: value proposition ── */}
    <Stack
      flex="1"
      gap="8"
      justify="center"
      pr={{ base: '0', md: '12' }}
      pb={{ base: '10', md: '0' }}
      borderBottom={{ base: '1px solid #E9EAED', md: 'none' }}
    >
      <Image src={Badge} alt="MasterGiver Badge" width={100} height={100} />

      <Stack gap="4">
        <Heading
          className="font-display"
          fontFamily="'Libre Bodoni', Georgia, serif"
          fontSize={{ base: '28px', md: '36px' }}
          fontWeight="700"
          lineHeight="1.15"
          color="#27262D"
        >
          Your reputation,
          <br />
          built right.
        </Heading>
        <Text color="text.primary" lineHeight="1.7" maxW="400px">
          Give your business a structured, public record of community impact —
          seen by customers, search engines, and AI.
        </Text>
      </Stack>

      <Separator borderColor="#E9EAED" />

      <Stack gap="3">
        <Text
          fontSize="11px"
          fontWeight="700"
          textTransform="uppercase"
          letterSpacing="0.1em"
          color="#9CA3AF"
        >
          What&apos;s included
        </Text>
        {FEATURES.map((f) => (
          <CheckItem key={f} label={f} />
        ))}
      </Stack>
    </Stack>

    {/* ── Vertical divider (desktop only) ── */}
    <Box
      display={{ base: 'none', md: 'block' }}
      w="1px"
      bgColor="#E9EAED"
      flexShrink={0}
    />

    {/* ── Right column: pricing + CTA ── */}
    <Stack
      gap="6"
      w={{ base: '100%', md: '440px' }}
      flexShrink={0}
      pl={{ base: '0', md: '12' }}
      justify="space-between"
    >
      {/* Price block */}
      <Stack gap="1">
        <Text
          fontSize="11px"
          fontWeight="700"
          textTransform="uppercase"
          letterSpacing="0.12em"
          color="#9CA3AF"
        >
          Annual Profile Subscription
        </Text>
        <HStack align="baseline" gap="2">
          <Text
            className="font-display"
            fontSize="80px"
            fontWeight="700"
            color="#2F2B77"
            lineHeight="1"
            letterSpacing="-2px"
          >
            $59
          </Text>
          <Text fontSize="16px" color="#575C62" fontWeight="400">
            annually
          </Text>
        </HStack>
      </Stack>

      <Separator borderColor="#E9EAED" />

      {/* Billing terms + CTA */}
      <Stack gap="4">
        <Text fontSize="14px" color="text.primary" lineHeight="1.6">
          Billed annually. Renews automatically each year.
          <br />
          Cancel any time from your dashboard.
        </Text>

        {error && (
          <Box
            bg="#FFF5F5"
            border="1px solid #FEB2B2"
            borderRadius="8px"
            p="3"
            color="#C53030"
            fontSize="14px"
          >
            {error}
          </Box>
        )}

        <button
          type="button"
          onClick={onPay}
          disabled={isLoading}
          style={primaryButtonStyle(isLoading)}
        >
          {isLoading ? 'Redirecting to payment…' : 'Continue to Secure Payment'}
        </button>

        <Text fontSize="13px" textAlign="center" color="#9CA3AF">
          🔒 Payments processed securely by Stripe
        </Text>
      </Stack>
    </Stack>
  </Stack>
);

// ---------------------------------------------------------------------------
// Main component — manages polling state machine
// ---------------------------------------------------------------------------

const ConfirmPage = ({ sessionId }: ConfirmPageProps) => {
  const router = useRouter();

  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingTimedOut, setPollingTimedOut] = useState(false);
  const pollAttemptsRef = useRef(0);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pollOnce = useCallback(async () => {
    pollAttemptsRef.current += 1;

    try {
      const url = sessionId
        ? `/api/business/activation-status?session_id=${sessionId}`
        : '/api/business/activation-status';

      const res = await fetch(url);
      const data = (await res.json()) as { status?: string };

      if (data.status === 'ACTIVE') {
        router.push('/business/dashboard/edit-profile');
        return;
      }
    } catch {
      // Network error — keep trying
    }

    if (pollAttemptsRef.current >= MAX_POLL_ATTEMPTS) {
      setIsPolling(false);
      setPollingTimedOut(true);
      return;
    }

    pollTimerRef.current = setTimeout(pollOnce, POLL_INTERVAL_MS);
  }, [router, sessionId]);

  const startPolling = useCallback(() => {
    pollAttemptsRef.current = 0;
    setPollingTimedOut(false);
    setIsPolling(true);
    pollTimerRef.current = setTimeout(pollOnce, POLL_INTERVAL_MS);
  }, [pollOnce]);

  useEffect(() => {
    if (sessionId) startPolling();
    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, [sessionId, startPolling]);

  const handlePay = async () => {
    setPaymentError(null);
    setIsCreatingSession(true);

    const result = await createCheckoutSessionAction();

    if (!result.success) {
      setPaymentError(result.error);
      setIsCreatingSession(false);
      return;
    }

    if (result.redirectTo) {
      router.push(result.redirectTo);
      return;
    }

    if (result.checkoutUrl) {
      window.location.href = result.checkoutUrl;
    }
  };

  if (isPolling) return <PollingState />;
  if (pollingTimedOut) return <TimeoutState onRetry={startPolling} />;

  return (
    <PaymentPrompt
      onPay={handlePay}
      isLoading={isCreatingSession}
      error={paymentError}
    />
  );
};

export default ConfirmPage;

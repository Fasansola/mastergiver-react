'use client';

/**
 * Interactive confirm page for the business panel.
 *
 * This component handles two distinct states depending on whether a Stripe
 * session ID is present in the URL:
 *
 * State A — No session ID (user just registered, hasn't paid yet):
 *   Shows the plan summary ($59/year) and a "Continue to Payment" button.
 *   Clicking the button calls the server action to create a Stripe Checkout
 *   Session, then redirects the browser to the Stripe-hosted payment page.
 *
 * State B — Session ID present (user returned from Stripe):
 *   Immediately starts polling /api/business/activation-status every 3 seconds,
 *   up to 5 attempts, waiting for the webhook to activate the account.
 *   - If ACTIVE before attempts run out → redirect to the dashboard.
 *   - If all attempts exhausted → show a "Still confirming…" fallback with a
 *     manual refresh button and a support contact note.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createCheckoutSessionAction } from '@/lib/actions/business-stripe.actions';
import { primaryButtonStyle } from '@/components/business/shared/styles';
import { Heading, HStack, Separator, Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Badge from '@/public/brand-assets/MastergiverBadge.png';

// How often to poll (ms) and how many times to try before showing the fallback
const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 5;

interface ConfirmPageProps {
  /** The Stripe session ID from ?session_id=... — null if the user hasn't paid yet. */
  sessionId: string | null;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Displayed while we are polling for the webhook to activate the account. */
const PollingState = () => (
  <div style={{ textAlign: 'center', padding: '16px 0' }}>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

    {/* Spinner */}
    <div
      style={{
        width: '52px',
        height: '52px',
        border: '3px solid #E2E1FF',
        borderTopColor: '#2F2B77',
        borderRadius: '50%',
        margin: '0 auto 28px',
        animation: 'spin 0.9s linear infinite',
      }}
    />

    <h2
      className="font-display"
      style={{
        fontWeight: 700,
        fontSize: '22px',
        color: '#27262D',
        marginBottom: '10px',
      }}
    >
      Confirming your payment…
    </h2>
    <p style={{ fontSize: '15px', lineHeight: '160%', color: '#575C62' }}>
      This usually takes just a few seconds.
      <br />
      Please don&apos;t close this tab.
    </p>
  </div>
);

/** Displayed when all polling attempts are exhausted without activation. */
const TimeoutState = ({ onRetry }: { onRetry: () => void }) => (
  <div style={{ textAlign: 'center', padding: '8px 0' }}>
    <div style={{ fontSize: '44px', marginBottom: '20px' }}>⏳</div>

    <h2
      className="font-display"
      style={{
        fontWeight: 700,
        fontSize: '22px',
        color: '#27262D',
        marginBottom: '10px',
      }}
    >
      Still confirming your payment…
    </h2>

    <p
      style={{
        fontSize: '15px',
        lineHeight: '160%',
        color: '#575C62',
        marginBottom: '8px',
      }}
    >
      Your payment may have gone through but we haven&apos;t received
      confirmation yet. This can occasionally take a minute or two.
    </p>

    <p
      style={{
        fontSize: '13px',
        lineHeight: '150%',
        color: '#9CA3AF',
        marginBottom: '28px',
      }}
    >
      If you believe your payment was successful, try again below. If the
      problem persists, please{' '}
      <a
        href="mailto:support@mastergiver.com"
        style={{ color: '#2F2B77', textDecoration: 'underline' }}
      >
        contact support
      </a>
      .
    </p>

    <button onClick={onRetry} style={primaryButtonStyle(false)}>
      Check Again
    </button>
  </div>
);

/** Displayed when the user has registered but not yet clicked Pay. */
const PaymentPrompt = ({
  onPay,
  isLoading,
  error,
}: {
  onPay: () => void;
  isLoading: boolean;
  error: string | null;
}) => (
  <Stack gap="8" align="center">
    {/* Badge icon */}

    <Image src={Badge} alt="MasterGiver Badge" width="140" height="140" />

    <Stack gap="4" align="center">
      <Heading
        className="font-display"
        fontSize="bigheading"
        fontWeight="700"
        textAlign="center"
        lineHeight="1.2em"
        color="text.heading"
      >
        Create Your MasterGiver
        <br />
        Reputation Profile
      </Heading>

      <Text fontSize="small" textAlign="center" color="text.primary">
        You&apos;re about to activate your public Reputation Profile — a
        structured, discoverable record of your business&apos;s community
        involvement and partnerships.
      </Text>
    </Stack>

    {/* Pricing card */}
    <Stack
      border="1.5px solid #E0DEFF"
      borderRadius="12px"
      gap="5"
      p="6"
      bgColor="#FAFAFE"
    >
      {/* Plan label row */}
      <Heading
        fontSize="small"
        fontWeight="700"
        textTransform="uppercase"
        color="text.secondary"
      >
        Annual Profile Subscription
      </Heading>

      {/* Price */}
      <HStack align="baseline" gap="2">
        <span
          className="font-display"
          style={{
            fontSize: '48px',
            fontWeight: 700,
            color: '#2F2B77',
            lineHeight: '1',
          }}
        >
          $59
        </span>
        <Text color="text.secondary" fontWeight="400">
          per year
        </Text>
      </HStack>

      <Separator borderColor="border.default" />

      {/* Billing note */}
      <Text fontSize="small" color="text.secondary">
        Billed annually. Renews automatically each year. Cancel any-time from
        your dashboard.
      </Text>
    </Stack>

    {/* Error */}
    {error && (
      <div
        style={{
          background: '#FFF5F5',
          border: '1px solid #FEB2B2',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '12px',
          color: '#C53030',
          fontSize: '14px',
        }}
      >
        {error}
      </div>
    )}

    <Stack gap="6" w="100%" align="center">
      {/* CTA */}
      <button
        onClick={onPay}
        disabled={isLoading}
        style={{ ...primaryButtonStyle(isLoading), marginTop: '8px' }}
      >
        {isLoading ? 'Redirecting to payment…' : 'Continue to Secure Payment'}
      </button>

      {/* Security note */}
      <Text fontSize="small" textAlign="center" color="text.secondary">
        🔒 Payments processed securely by Stripe
      </Text>
    </Stack>
  </Stack>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const ConfirmPage = ({ sessionId }: ConfirmPageProps) => {
  const router = useRouter();

  // State A — payment prompt
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // State B — polling after returning from Stripe
  const [isPolling, setIsPolling] = useState(false);
  const [pollingTimedOut, setPollingTimedOut] = useState(false);
  const pollAttemptsRef = useRef(0);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Poll the activation status endpoint once and schedule the next attempt. */
  const pollOnce = useCallback(async () => {
    pollAttemptsRef.current += 1;

    try {
      // Pass the session_id so the server can verify directly with Stripe
      // if the webhook hasn't arrived yet, eliminating the race condition.
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
      // Network error on a poll attempt — keep trying
    }

    if (pollAttemptsRef.current >= MAX_POLL_ATTEMPTS) {
      setIsPolling(false);
      setPollingTimedOut(true);
      return;
    }

    pollTimerRef.current = setTimeout(pollOnce, POLL_INTERVAL_MS);
  }, [router, sessionId]);

  /** Start (or restart) the polling cycle. */
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

  /** Called when the user clicks "Continue to Secure Payment". */
  const handlePay = async () => {
    setPaymentError(null);
    setIsCreatingSession(true);

    const result = await createCheckoutSessionAction();

    if (!result.success) {
      setPaymentError(result.error);
      setIsCreatingSession(false);
      return;
    }

    // Action found an existing active subscription — skip checkout entirely
    if (result.redirectTo) {
      router.push(result.redirectTo);
      return;
    }

    // Normal path — redirect to Stripe-hosted checkout
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

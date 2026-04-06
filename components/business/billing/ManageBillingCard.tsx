'use client';

/**
 * Manage Billing card — Billing Settings page.
 *
 * Contains a single button that triggers a server action to create a Stripe
 * Customer Portal session. The returned URL is used to redirect the browser
 * directly to the Stripe-hosted portal where the user can:
 *   - Update their payment method
 *   - Download invoice PDFs
 *   - Cancel their subscription
 *
 * useMutation is used so we can show a loading state while the server call
 * is in flight (portal session creation takes ~200–400 ms).
 */

import { useMutation } from '@tanstack/react-query';
import { createBillingPortalAction } from '@/lib/actions/business-billing.actions';
import { Box } from '@chakra-ui/react';
import {
  primaryButtonStyle,
} from '@/components/business/shared/styles';

const ManageBillingCard = () => {
  const mutation = useMutation({
    mutationFn: createBillingPortalAction,
    onSuccess: (result) => {
      if (!result.success) return; // error shown below
      // Redirect the entire browser window to the Stripe-hosted portal
      window.location.href = result.url;
    },
  });

  return (
    <Box
      background="#FFFFFF"
      borderRadius="12px"
      border="1px solid #E5E7EB"
      p={{ base: '5', md: '8' }}
    >
      <h2
        className="font-display"
        style={{
          fontWeight: 700,
          fontSize: '20px',
          lineHeight: '150%',
          color: '#27262D',
          marginBottom: '8px',
        }}
      >
        Manage Billing
      </h2>
      <p style={{ fontSize: '14px', color: '#575C62', marginBottom: '24px' }}>
        Update your payment method, download invoices, or cancel your subscription
        through the Stripe billing portal.
      </p>

      <button
        type="button"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        style={{
          ...primaryButtonStyle(mutation.isPending),
          width: 'auto',
          fontSize: '16px',
          height: '48px',
          padding: '0 32px',
        }}
      >
        {mutation.isPending ? 'Opening portal…' : 'Update Payment Method / View Invoices'}
      </button>

      {/* Show an inline error if the portal session could not be created */}
      {mutation.isError || (mutation.data && !mutation.data.success) ? (
        <p style={{ color: '#C53030', fontSize: '14px', marginTop: '12px' }}>
          {mutation.data && !mutation.data.success
            ? mutation.data.error
            : 'Could not open the billing portal. Please try again.'}
        </p>
      ) : null}
    </Box>
  );
};

export default ManageBillingCard;

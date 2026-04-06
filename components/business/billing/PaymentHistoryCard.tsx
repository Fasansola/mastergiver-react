'use client';

/**
 * Payment History card — Billing Settings page.
 *
 * Fetches the list of Stripe invoices from the /api/business/payment-history
 * route using TanStack Query's useQuery. Renders a table with three columns:
 *   Date | Amount | Status
 *
 * Three render states:
 *   Loading — skeleton rows while the fetch is in flight
 *   Empty   — friendly message when no invoices exist yet
 *   Filled  — table of invoice rows with an optional PDF download link
 */

import { useQuery } from '@tanstack/react-query';
import { Box } from '@chakra-ui/react';
import type { PaymentHistoryItem } from '@/app/api/business/payment-history/route';

/** Format a Unix timestamp (seconds) as a human-readable date string. */
function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Format cents to a dollar amount string, e.g. 5900 → "$59.00". */
function formatAmount(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/** Capitalise first letter of the Stripe status string. */
function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

// Colour coding for the status badge
function statusColor(status: string): string {
  if (status === 'paid') return '#276749';
  if (status === 'open') return '#C05621';
  return '#6B7280';
}

const PaymentHistoryCard = () => {
  const { data, isLoading, isError } = useQuery<{ invoices: PaymentHistoryItem[] }>({
    queryKey: ['business-payment-history'],
    queryFn: () => fetch('/api/business/payment-history').then((r) => r.json()),
    // Cache for 5 minutes — invoice history does not change frequently
    staleTime: 5 * 60 * 1000,
  });

  const invoices = data?.invoices ?? [];

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
          marginBottom: '24px',
        }}
      >
        Payment History
      </h2>

      {/* Loading state — three placeholder rows */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: '36px',
                borderRadius: '6px',
                background: '#F3F4F6',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <p style={{ fontSize: '14px', color: '#C53030' }}>
          Could not load payment history. Please refresh the page.
        </p>
      )}

      {/* Empty state */}
      {!isLoading && !isError && invoices.length === 0 && (
        <p style={{ fontSize: '14px', color: '#6B7280' }}>
          No payments found. Your invoice history will appear here after your first payment.
        </p>
      )}

      {/* Invoice table — horizontally scrollable on small screens */}
      {!isLoading && !isError && invoices.length > 0 && (
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '360px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
              {['Date', 'Amount', 'Status', ''].map((heading) => (
                <th
                  key={heading}
                  style={{
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#575C62',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    paddingBottom: '10px',
                    paddingRight: '16px',
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '14px 16px 14px 0', fontSize: '14px', color: '#27262D' }}>
                  {formatDate(inv.date)}
                </td>
                <td style={{ padding: '14px 16px 14px 0', fontSize: '14px', color: '#27262D' }}>
                  {formatAmount(inv.amount)}
                </td>
                <td style={{ padding: '14px 16px 14px 0' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: statusColor(inv.status),
                    }}
                  >
                    {formatStatus(inv.status)}
                  </span>
                </td>
                <td style={{ padding: '14px 0', textAlign: 'right' }}>
                  {inv.pdfUrl && (
                    <a
                      href={inv.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '13px', color: '#2F2B77', textDecoration: 'none', fontWeight: 600 }}
                    >
                      PDF ↗
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </Box>
  );
};

export default PaymentHistoryCard;

/**
 * Current Plan card — Billing Settings page.
 *
 * A purely presentational component — all data is passed as props by the
 * Server Component page (no client-side fetching needed here).
 *
 * Displays:
 *   - Plan name (always "Business" for Phase 2)
 *   - Subscription status — ACTIVE is shown in green, SUSPENDED in orange
 *   - Next renewal date (from business.currentPeriodEnd)
 *   - Price ($59 / year — fixed)
 */


import { Box } from '@chakra-ui/react';

interface CurrentPlanCardProps {
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  /** ISO date string of the next renewal, or null if not yet available. */
  currentPeriodEnd: string | null;
}

/** Format a date string like "April 2, 2027" for display. */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const CurrentPlanCard = ({ status, currentPeriodEnd }: CurrentPlanCardProps) => {
  // Style the status badge based on subscription state
  const statusLabel =
    status === 'ACTIVE' ? 'Active' :
    status === 'SUSPENDED' ? 'Suspended' : 'Pending';

  const statusColor =
    status === 'ACTIVE' ? '#276749' :
    status === 'SUSPENDED' ? '#C05621' : '#6B7280';

  const statusBg =
    status === 'ACTIVE' ? '#F0FFF4' :
    status === 'SUSPENDED' ? '#FFFAF0' : '#F3F4F6';

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
        Current Plan
      </h2>

      {/* Plan detail rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Plan name */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#575C62' }}>Plan</span>
          <span style={{ fontSize: '16px', fontWeight: 600, color: '#27262D' }}>Business</span>
        </div>

        {/* Status badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#575C62' }}>Status</span>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: statusColor,
              background: statusBg,
              padding: '3px 10px',
              borderRadius: '12px',
            }}
          >
            {statusLabel}
          </span>
        </div>

        {/* Renewal date */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#575C62' }}>Next renewal</span>
          <span style={{ fontSize: '16px', color: '#27262D' }}>
            {currentPeriodEnd ? formatDate(currentPeriodEnd) : '—'}
          </span>
        </div>

        {/* Price */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#575C62' }}>Amount</span>
          <span style={{ fontSize: '16px', color: '#27262D' }}>$59 / year</span>
        </div>
      </div>
    </Box>
  );
};

export default CurrentPlanCard;

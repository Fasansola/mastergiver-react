/**
 * Business profile completion progress bar.
 *
 * Displays a labelled horizontal bar showing how much of the business profile
 * has been filled in, expressed as a percentage (0–100).
 *
 * The filled portion uses the business primary colour (#2F2B77).
 * The track uses a soft purple tint (#E2E1FF).
 *
 * Pure display component — receives the computed percentage as a prop.
 */

import { Stack, Text } from '@chakra-ui/react';

interface BusinessProgressBarProps {
  /** Completion percentage, 0–100. */
  percent: number;
}

const BusinessProgressBar = ({ percent }: BusinessProgressBarProps) => {
  // Clamp to [0, 100] so a rounding edge case never breaks the bar visually
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <Stack
      border="1px solid #E2B226"
      borderRadius="12px"
      px="5"
      py="4"
      bgColor="white"
    >
      {/* Label row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '1.16px',
            textTransform: 'uppercase',
            color: '#575C62',
          }}
        >
          Profile complete
        </span>
        <span
          style={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#2F2B77',
          }}
        >
          {clamped}%
        </span>
      </div>

      {/* Track */}
      <div
        style={{
          width: '100%',
          height: '18px',
          borderRadius: '999px',
          background: '#E2E1FF',
          overflow: 'hidden',
        }}
      >
        {/* Fill */}
        <div
          style={{
            height: '100%',
            width: `${clamped}%`,
            borderRadius: '999px',
            background: '#2F2B77',
            transition: 'width 0.4s ease',
          }}
        />
      </div>
      <Text fontSize="sm" color="text.secondary">
        {clamped < 100
          ? 'Having a complete verified account will increase the chances of getting visibilty.'
          : 'Your profile is complete! You can update it anytime to keep it fresh.'}
      </Text>
    </Stack>
  );
};

export default BusinessProgressBar;

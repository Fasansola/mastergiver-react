'use client';

/**
 * Section 4 — Areas of Impact
 *
 * Renders all available causes as a selectable tag/chip grid. The user
 * toggles causes on/off; clicking Save Section persists the selection.
 *
 * Cause data comes from the database (fetched server-side in the page
 * and passed as props). Phase 1 UI components are not imported here.
 */

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { saveAreasOfImpactAction } from '@/lib/actions/business-profile.actions';
import { primaryButtonStyle } from '@/components/business/shared/styles';
import { HStack, Stack, Text } from '@chakra-ui/react';

interface Cause {
  id: string;
  name: string;
  color: string;
}

interface AreasOfImpactSectionProps {
  onSave: () => void;
  allCauses: Cause[];
  selectedCauseIds: string[];
}

const AreasOfImpactSection = ({
  onSave,
  allCauses,
  selectedCauseIds,
}: AreasOfImpactSectionProps) => {
  const router = useRouter();
  // Filter to only IDs present in allCauses — drops any stale individual-panel
  // cause IDs that may have been saved before the business cause list existed.
  const validCauseIds = new Set(allCauses.map((c) => c.id));
  const [selected, setSelected] = useState<Set<string>>(
    new Set(selectedCauseIds.filter((id) => validCauseIds.has(id)))
  );
  const [serverError, setServerError] = useState<string | null>(null);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const mutation = useMutation({
    mutationFn: () =>
      saveAreasOfImpactAction({ causeIds: Array.from(selected) }),
    onSuccess: (result) => {
      if (!result.success) {
        setServerError(result.error);
        return;
      }
      router.refresh();
      onSave();
    },
  });

  return (
    <Stack gap="5">
      <Text style={{ fontSize: '14px', color: '#575C62' }}>
        Select the cause areas that reflect your business&apos;s community
        focus.
      </Text>

      {/* Chip grid */}
      <HStack flexWrap="wrap" gap="2.5">
        {allCauses.map((cause) => {
          const isSelected = selected.has(cause.id);
          return (
            <button
              key={cause.id}
              type="button"
              onClick={() => toggle(cause.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                border: `2px solid ${isSelected ? '#2F2B77' : '#E5E7EB'}`,
                background: isSelected ? '#2F2B77' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#000000',
                fontSize: '14px',
                fontWeight: isSelected ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {cause.name}
            </button>
          );
        })}
      </HStack>

      {serverError && (
        <Text style={{ color: '#C53030', fontSize: '14px' }}>
          {serverError}
        </Text>
      )}

      <HStack
        align="center"
        justify={{ base: '', md: 'end' }}
        gap="6"
        flexWrap="wrap"
      >
        <button
          type="button"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          style={primaryButtonStyle(mutation.isPending)}
        >
          {mutation.isPending ? 'Saving…' : 'Save Section'}
        </button>
      </HStack>
    </Stack>
  );
};

export default AreasOfImpactSection;

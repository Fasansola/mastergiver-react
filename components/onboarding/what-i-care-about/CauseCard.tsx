'use client';

import { CauseItem, useOnboardingStore } from '@/lib/store/onboarding.store';
import { X } from 'lucide-react';
import { HStack, Span, IconButton } from '@chakra-ui/react';
import Image from 'next/image';

interface CausesCardProps {
  cause: CauseItem;
}

export function CauseCard({ cause }: CausesCardProps) {
  const { removeCause } = useOnboardingStore();
  return (
    <HStack
      gap="2"
      px="3"
      py="2"
      borderRadius="md"
      borderWidth="1px"
      justify="space-between"
    >
      <HStack gap="2">
        {/* Color chip */}
        {cause.icon && <Image alt={cause.name} src={cause.icon} width={36} height={36} />}
        <Span textStyle="sm" fontWeight="medium">
          {cause.name}
        </Span>
      </HStack>

      <IconButton
        aria-label={`Remove ${cause.name}`}
        variant="ghost"
        size="xs"
        onClick={() => removeCause(cause.id)}
      >
        <X size={12} />
      </IconButton>
    </HStack>
  );
}

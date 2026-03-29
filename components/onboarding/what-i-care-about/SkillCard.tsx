'use client';

import { HStack, Span, IconButton } from '@chakra-ui/react';
import { X } from 'lucide-react';
import {
  useOnboardingStore,
  type SkillItem,
} from '@/lib/store/onboarding.store';

interface SkillCardProps {
  skill: SkillItem;
}

export function SkillCard({ skill }: SkillCardProps) {
  const { removeSkill } = useOnboardingStore();

  return (
    <HStack
      gap="2"
      px="3"
      py="2"
      borderRadius="md"
      borderWidth="1px"
      justify="space-between"
    >
      <Span textStyle="sm" fontWeight="medium">
        {skill.name}
      </Span>

      <IconButton
        aria-label={`Remove ${skill.name}`}
        variant="ghost"
        size="xs"
        onClick={() => removeSkill(skill.id)}
      >
        <X size={12} />
      </IconButton>
    </HStack>
  );
}

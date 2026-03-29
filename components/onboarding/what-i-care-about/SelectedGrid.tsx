'use client';

import { SimpleGrid, Box, Span } from '@chakra-ui/react';
import { useOnboardingStore } from '@/lib/store/onboarding.store';
import { CauseCard } from './CauseCard';
import { SkillCard } from './SkillCard';
import { OrgCard } from './OrgCard';

export type GridType = 'causes' | 'skills' | 'organizations';

interface SelectedGridProps {
  type: GridType;
}

export function SelectedGrid({ type }: SelectedGridProps) {
  const { selectedCauses, selectedSkills, selectedOrgs } = useOnboardingStore();

  const isEmpty =
    (type === 'causes' && selectedCauses.length === 0) ||
    (type === 'skills' && selectedSkills.length === 0) ||
    (type === 'organizations' && selectedOrgs.length === 0);

  if (isEmpty) return null;

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap="2" mt="3">
      {type === 'causes' &&
        selectedCauses.map((cause) => (
          <CauseCard key={cause.id} cause={cause} />
        ))}

      {type === 'skills' &&
        selectedSkills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}

      {type === 'organizations' &&
        selectedOrgs.map((org) => <OrgCard key={org.pledgeOrgId} org={org} />)}
    </SimpleGrid>
  );
}

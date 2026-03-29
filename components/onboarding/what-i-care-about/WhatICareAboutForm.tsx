'use client';

import { saveCausesSkillsOrgs } from '@/lib/actions/onboarding.actions';
import {
  CauseItem,
  OrgItem,
  SkillItem,
  useOnboardingStore,
} from '@/lib/store/onboarding.store';
import {
  Stack,
  Field,
  Textarea,
  Span,
  Button,
  Flex,
  Text,
  Heading,
  HStack,
} from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CausesSelect from './CausesSelect';
import OrganizationsSelect from './OrganizationsSelect';
import { SelectedGrid } from './SelectedGrid';
import SkillsSelect from './SkillsSelect';
import help from '@/public/components-assets/help.svg';

interface WhatICareAboutFormProps {
  causes: CauseItem[];
  skills: SkillItem[];
  existingCauses: CauseItem[];
  existingSkills: SkillItem[];
  existingOrgs: OrgItem[];
  existingWhyIGive: string;
}

const WhatICareAboutForm = ({
  causes,
  skills,
  existingCauses,
  existingSkills,
  existingOrgs,
  existingWhyIGive,
}: WhatICareAboutFormProps) => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skillsTooltip, setSkillsTooltip] = useState<'none' | 'block'>('none');

  const {
    selectedCauses,
    selectedSkills,
    selectedOrgs,
    whyIGive,
    setWhyIGive,
    addCause,
    addSkill,
    addOrg,
    clearAll,
  } = useOnboardingStore();

  // Hydrate store with existing data on mount

  useEffect(() => {
    existingCauses.forEach(addCause);
    existingSkills.forEach(addSkill);
    existingOrgs.forEach(addOrg);
    setWhyIGive(existingWhyIGive);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    const results = await saveCausesSkillsOrgs({
      causeIds: selectedCauses.map((c) => c.id),
      skillIds: selectedSkills.map((s) => s.id),
      organizations: selectedOrgs.map((org) => ({
        pledgeOrgId: org.pledgeOrgId,
        name: org.name,
        ein: org.ein,
        logo: org.logo,
        location: org.location,
        website: org.website,
        mission: org.mission,
      })),
      whyIGive,
    });

    if (!results.success) {
      setError(results.error || 'Something went wrong. Please try again.');
      setIsSaving(false);
      return;
    }

    clearAll();
    router.push('/onboarding/preview');
  };

  return (
    <Stack gap="8" className="fullWidth">
      {/* Section 1 — Why I Give */}
      <Field.Root gap="2">
        <Flex justify="space-between" align="center" width={'100%'}>
          <Field.Label color="text.primary" fontSize="md" fontWeight="500">
            Why I Give
          </Field.Label>
          <Text
            fontSize="small"
            color={whyIGive.length >= 255 ? 'fg.error' : 'fg.muted'}
          >
            {whyIGive.length}/255
          </Text>
        </Flex>
        <Textarea
          placeholder="Share what drives your generosity..."
          value={whyIGive}
          onChange={(e) => setWhyIGive(e.target.value)}
          maxLength={255}
          fontSize="md"
          rows={4}
          resize="none"
        />
      </Field.Root>

      {/* Section 2 — What I Care About */}
      <Stack gap="2">
        <Text fontSize="md" fontWeight="500">
          What I Care About
        </Text>
        <CausesSelect causes={causes} />
        <SelectedGrid type="causes" />
      </Stack>

      {/* Section 3 — Giving Skills */}
      <Stack gap="2">
        <HStack>
          <Text fontSize="md" fontWeight="500">
            Giving Skills
          </Text>
          <Image
            src={help}
            alt="Giving Skills tooltip"
            onClick={() =>
              setSkillsTooltip(skillsTooltip === 'none' ? 'block' : 'none')
            }
            className="cursor-pointer"
          />
        </HStack>
        <Text
          fontSize="sm"
          p="3"
          bgColor="brand.accent"
          borderRadius="md"
          display={skillsTooltip}
          maxW="700px"
        >
          <b>Giving Skills</b> are talents or professional abilities you&apos;re
          open to sharing with organizations on a volunteer basis. Select skills
          that reflect what you can offer—whether it&apos;s graphic design,
          marketing, financial planning, or any other expertise—to help make a
          difference!
        </Text>
        <SkillsSelect skills={skills} />
        <SelectedGrid type="skills" />
      </Stack>

      {/* Section 4 — Organizations I Support */}
      <Stack gap="3">
        <Text fontSize="md" fontWeight="500">
          My Organizations and Causes
        </Text>
        <Stack gap="6">
          <Heading fontSize="heading" fontWeight="700">
            Find Your Charity or Cause
          </Heading>
          <OrganizationsSelect />
        </Stack>
        <SelectedGrid type="organizations" />
      </Stack>

      {/* Error */}
      {error && (
        <Span color="fg.error" textStyle="sm">
          {error}
        </Span>
      )}

      {/* Save */}
      <Button
        onClick={handleSave}
        loading={isSaving}
        loadingText="Saving..."
        size="md"
        fontWeight="600"
        width="fit"
      >
        Complete Profile
      </Button>
    </Stack>
  );
};

export default WhatICareAboutForm;

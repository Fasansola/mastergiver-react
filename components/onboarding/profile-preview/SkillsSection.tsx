import { SkillItem } from '@/lib/store/onboarding.store';
import ListSections from './ListSections';
import { Stack, Heading, HStack, Button, Text } from '@chakra-ui/react';
import Image from 'next/image';
import help from '@/public/components-assets/help.svg';
import { useState } from 'react';

import { SelectedGrid } from '../what-i-care-about/SelectedGrid';
import SkillsSelect from '../what-i-care-about/SkillsSelect';

interface SkillsSectionProps {
  allSkills: SkillItem[];
  isEditing: boolean;
  onToggleEdit: () => void;
}

const SkillsSection = ({
  allSkills,
  isEditing,
  onToggleEdit,
}: SkillsSectionProps) => {
  const [skillsTooltip, setSkillsTooltip] = useState<'none' | 'block'>('none');

  if (isEditing) {
    return (
      <Stack align="start" gap="5" w="100%">
        <Stack gap="3" w="100%">
          <HStack>
            <Heading>Giving Skills</Heading>
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
            <b>Giving Skills</b> are talents or professional abilities
            you&apos;re open to sharing with organizations on a volunteer basis.
            Select skills that reflect what you can offer—whether it&apos;s
            graphic design, marketing, financial planning, or any other
            expertise—to help make a difference!
          </Text>
          <SkillsSelect skills={allSkills} />
          <SelectedGrid type="skills" />
        </Stack>

        <HStack>
          <Button onClick={onToggleEdit} variant="solid" w="fit-content">
            Done
          </Button>
        </HStack>
      </Stack>
    );
  }
  return (
    <ListSections label="Giving Skills" list="skills" onClick={onToggleEdit} />
  );
};

export default SkillsSection;

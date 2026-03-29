import { CauseItem } from '@/lib/store/onboarding.store';
import { HStack, Heading, Stack, Button } from '@chakra-ui/react';
import ListSections from './ListSections';
import CausesSelect from '../what-i-care-about/CausesSelect';
import { SelectedGrid } from '../what-i-care-about/SelectedGrid';

interface CausesSectionProps {
  allCauses: CauseItem[];
  isEditing: boolean;
  onToggleEdit: () => void;
}

const CausesSection = ({
  allCauses,
  isEditing,
  onToggleEdit,
}: CausesSectionProps) => {
  if (isEditing) {
    return (
      <Stack align="start" gap="5" w="100%">
        <Stack gap="3" w="100%">
          <Heading>What I Care About</Heading>
          <CausesSelect causes={allCauses} />
          <SelectedGrid type="causes" />
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
    <ListSections
      label="What I Care About"
      list="causes"
      onClick={onToggleEdit}
    />
  );
};

export default CausesSection;

import { useState } from 'react';
import LocationSelector from '../LocationSelector';
import ElementsSections from './ElementsSections';
import { HStack, Button, Stack, Text } from '@chakra-ui/react';

interface LocationSectionProps {
  state: string | null;
  city: string | null;
  isEditing: boolean;
  onToggleEdit: () => void;
  onChange: (state: string, city: string) => void;
}

const LocationSection = ({
  state,
  city,
  isEditing,
  onToggleEdit,
  onChange,
}: LocationSectionProps) => {
  const [draft, setDraft] = useState({ state: state ?? '', city: city ?? '' });
  const handleDone = () => {
    onChange(draft.state, draft.city);
    onToggleEdit();
  };
  const handleCancel = () => {
    setDraft({ state: state ?? '', city: city ?? '' });
    onToggleEdit();
  };
  if (isEditing) {
    return (
      <Stack gap={5}>
        <Stack gap={3}>
          <Text fontSize="lg" fontWeight="600">
            Location
          </Text>
          <LocationSelector
            mode="controlled"
            value={draft}
            onChange={(state, city) => setDraft({ state, city })}
          />
        </Stack>

        <HStack>
          <Button
            onClick={handleDone}
            colorScheme="blue"
            variant="solid"
            w="fit-content"
          >
            Done
          </Button>
          <Button onClick={handleCancel} variant="outline" w="fit-content">
            Cancel
          </Button>
        </HStack>
      </Stack>
    );
  }
  return (
    <ElementsSections
      label="Location"
      value={city && state ? `${city}, ${state}` : 'No location added yet.'}
      onClick={onToggleEdit}
    />
  );
};

export default LocationSection;

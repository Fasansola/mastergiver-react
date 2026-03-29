import { Stack, Heading, Text, Button, HStack, VStack } from '@chakra-ui/react';
import OrganizationsSelect from '../what-i-care-about/OrganizationsSelect';
import { SelectedGrid } from '../what-i-care-about/SelectedGrid';
import ListSections from './ListSections';

interface OrganizationsSectionProps {
  isEditing: boolean;
  onToggleEdit: () => void;
}

const OrganizationsSection = ({
  isEditing,
  onToggleEdit,
}: OrganizationsSectionProps) => {
  if (isEditing)
    return (
      <VStack align="start" gap="5">
        <Stack gap="3" w="100%">
          <Text fontSize="md" fontWeight="500">
            My Organizations and Causes
          </Text>
          <Stack gap="6" w="100%">
            <Heading fontSize="heading" fontWeight="700">
              Find Your Charity or Cause
            </Heading>
            <OrganizationsSelect />
          </Stack>
          <SelectedGrid type="organizations" />
        </Stack>

        <HStack>
          <Button onClick={onToggleEdit} variant="solid" w="fit-content">
            Done
          </Button>
        </HStack>
      </VStack>
    );

  return (
    <ListSections
      label="Organizations I Support"
      list="organizations"
      onClick={onToggleEdit}
    />
  );
};

export default OrganizationsSection;

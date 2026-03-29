import { useState } from 'react';
import ElementsSections from './ElementsSections';
import { Flex, Field, Input, Stack, HStack, Button } from '@chakra-ui/react';

interface NameSectionProps {
  firstName: string;
  lastName: string;
  isEditing: boolean;
  onToggleEdit: () => void;
  onChange: (firstName: string, lastName: string) => void;
}

const NameSection = ({
  firstName,
  lastName,
  isEditing,
  onToggleEdit,
  onChange,
}: NameSectionProps) => {
  // Local draft only commits to element on preview
  const [draft, setDraft] = useState({ firstName, lastName });

  const handleDone = () => {
    onChange(draft.firstName, draft.lastName);
    onToggleEdit();
  };

  const handleCancel = () => {
    setDraft({ firstName, lastName });
    onToggleEdit();
  };

  if (isEditing) {
    return (
      <Stack gap={5}>
        <Flex gap={3} direction={{ base: 'column', md: 'row' }}>
          <Field.Root>
            <Field.Label color="text.primary" fontWeight="600" fontSize="lg">
              First name
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              className="inputForm"
              value={draft.firstName}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, firstName: e.target.value }))
              }
            />
          </Field.Root>
          <Field.Root>
            <Field.Label color="text.primary" fontWeight="600" fontSize="lg">
              Last name <Field.RequiredIndicator />
            </Field.Label>
            <Input
              className="inputForm"
              value={draft.lastName}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, lastName: e.target.value }))
              }
            />
          </Field.Root>
        </Flex>
        <HStack>
          <Button onClick={handleDone} variant="solid" w="fit-content">
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
      label="Name"
      value={`${firstName} ${lastName}`}
      onClick={onToggleEdit}
    />
  );
};

export default NameSection;

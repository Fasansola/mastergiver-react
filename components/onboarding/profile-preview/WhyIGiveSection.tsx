import {
  Button,
  Field,
  Flex,
  HStack,
  Textarea,
  VStack,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import TextareaPreviewSection from './TextareaPreviewSection';

interface WhyIGiveSectionProps {
  whyIGive: string | null;
  isEditing: boolean;
  onToggleEdit: () => void;
  onChange: (value: string) => void;
}
const WhyIGiveSection = ({
  whyIGive,
  isEditing,
  onToggleEdit,
  onChange,
}: WhyIGiveSectionProps) => {
  const [draft, setDraft] = useState(whyIGive ?? '');

  const handleDone = () => {
    onChange(draft);
    onToggleEdit();
  };

  const handleCancel = () => {
    setDraft(whyIGive ?? '');
    onToggleEdit();
  };
  if (isEditing) {
    return (
      <VStack align="start" gap={5}>
        <Field.Root gap="3">
          <Flex justify="space-between" align="center" width={'100%'}>
            <Field.Label color="text.primary" fontSize="lg" fontWeight="600">
              Why I Give
            </Field.Label>
            <Text
              fontSize="small"
              color={draft.length >= 255 ? 'fg.error' : 'fg.muted'}
            >
              {draft.length} / 255
            </Text>
          </Flex>
          <Textarea
            maxLength={255}
            rows={4}
            className="inputForm"
            color="text.primary"
            placeholder="Your Personal and Professional Bio here"
            fontSize="md"
            resize="none"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
        </Field.Root>
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
      </VStack>
    );
  }
  return (
    <TextareaPreviewSection
      label="Why I Give"
      value={whyIGive || ''}
      onClick={onToggleEdit}
    />
  );
};

export default WhyIGiveSection;

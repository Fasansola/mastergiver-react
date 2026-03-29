import { VStack, Text, HStack } from '@chakra-ui/react';

interface ElementsSectionsProps {
  label: string;
  value: string;
  onClick?: () => void;
}

const TextareaPreviewSection = ({
  label,
  value,
  onClick,
}: ElementsSectionsProps) => {
  return (
    <VStack align="start" gap={3}>
      <HStack justifyContent="space-between" w="full">
        <Text fontSize="lg" fontWeight="600">
          {label}
        </Text>
        <Text
          fontSize="sm"
          color="text.link"
          fontWeight="600"
          className="cursor-pointer"
          onClick={onClick}
        >
          Edit
        </Text>
      </HStack>
      <Text fontSize="sm">{value}</Text>
    </VStack>
  );
};

export default TextareaPreviewSection;

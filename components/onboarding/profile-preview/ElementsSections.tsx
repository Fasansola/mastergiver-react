import { VStack, Text, HStack } from '@chakra-ui/react';

interface ElementsSectionsProps {
  label: string;
  value: string;
  onClick?: () => void;
}

const ElementsSections = ({ label, value, onClick }: ElementsSectionsProps) => {
  return (
    <VStack align="start" gap={3}>
      <HStack justifyContent="space-between" w="full">
        <Text fontSize="md" fontWeight="500">
          {label}
        </Text>
        {label !== 'Username' && (
          <Text
            fontSize="sm"
            color="text.link"
            fontWeight="600"
            className="cursor-pointer"
            onClick={onClick}
          >
            Edit
          </Text>
        )}
      </HStack>
      <Text fontSize="lg" fontWeight="600">
        {value}
      </Text>
    </VStack>
  );
};

export default ElementsSections;

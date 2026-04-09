import { Heading, Stack, Text } from '@chakra-ui/react';

interface FaqBoxProps {
  title: string;
  description: string;
  theme?: boolean;
}

const FaqBox = ({ title, description, theme }: FaqBoxProps) => {
  return (
    <Stack
      p="6"
      gap="4"
      bgColor={theme ? '#F7F8FA' : 'white'}
      border="1px solid"
      borderColor="border.default"
      borderRadius="12px"
    >
      <Heading className="font-display" fontSize="heading" lineHeight="120%">
        {title}
      </Heading>
      <Text className="font-body" fontWeight="400" lineHeight="180%">
        {description}
      </Text>
    </Stack>
  );
};

export default FaqBox;

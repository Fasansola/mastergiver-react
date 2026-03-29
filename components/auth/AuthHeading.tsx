import { Flex, Heading, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
}

const AuthHeading = ({ title, children }: Props) => {
  return (
    <Flex direction="column" gap="4">
      <Heading
        color="text.heading"
        fontSize="heading"
        fontWeight="600"
      >
        {title}
      </Heading>
      <Text color="text.secondary" fontWeight="500">
        {children}
      </Text>
    </Flex>
  );
};

export default AuthHeading;

import { Container, HStack, Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';

const ReyondReviews = () => {
  return (
    <Stack bgColor="background.page">
      <Container py={{ base: '12', md: '16' }}>
        <Stack align="center" gap="6">
          <HStack gap="2" align="center" width="fit-content">
            <Image alt="" src="/path/to/image.jpg" width={24} height={24} />
            <Text>INTRODUCING VERIFIED COMMUNITY IMPACT</Text>
          </HStack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default ReyondReviews;

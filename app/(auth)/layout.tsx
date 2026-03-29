import { Container, Flex } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

import { Header } from '@/components/layout';

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <Flex minH="100vh" direction="column" bg="background.page">
      <Header />
      <Flex align="center" justify="center" py={{ base: '6', lg: 'sectionGap' }}>
        <Container alignItems="center" justifyContent="center" className="flex">
          <Flex
            background="background.card"
            w="100%"
            maxW="700px"
            borderRadius="card"
            minH="300px"
            p={{ base: '6', lg: 'sectionGap' }}
            shadow="formBox"
          >
            {children}
          </Flex>
        </Container>
      </Flex>
    </Flex>
  );
};

export default AuthLayout;

import { Header } from '@/components/layout';
import { Flex, Container } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

const OnboardingLayout = ({ children }: PropsWithChildren) => {
  return (
    <Flex minH="100vh" direction="column" bg="background.page">
      <Header />
      <Flex align="center" justify="center" py="sectionGap">
        <Container alignItems="center" justifyContent="center" className="flex">
          <Flex
            background="background.card"
            width="974px"
            borderRadius="card"
            minH="300px"
            p="sectionGap"
            shadow="formBox"
          >
            {children}
          </Flex>
        </Container>
      </Flex>
    </Flex>
  );
};

export default OnboardingLayout;

import FaqBox from '@/components/landing/FaqBox';
import LandingH from '@/components/landing/LandingH';
import { Container, Grid, Stack } from '@chakra-ui/react';

type FaqItem = {
  title: string;
  description: string;
};

type FAQSectionProps = {
  faqs: FaqItem[];
};

const FAQSection = ({ faqs }: FAQSectionProps) => {
  return (
    <Stack bgColor="white" borderY="1px solid #E9EAED">
      <Container
        py={{ base: '60px', lg: '100px' }}
        alignItems="center"
        display="flex"
        flexDir="column"
        gap="12"
      >
        <Stack textAlign="center" align="center" gap="6">
          <Stack w="100%" maxW="872px">
            <LandingH>Frequently Asked Questions</LandingH>
          </Stack>
        </Stack>

        <Grid templateColumns="repeat(1, 1fr)" gap="6" w="100%" maxW="1112px">
          {faqs.map((item, i) => (
            <FaqBox
              key={i}
              title={item.title}
              description={item.description}
              theme={true}
            />
          ))}
        </Grid>
      </Container>
    </Stack>
  );
};

export default FAQSection;

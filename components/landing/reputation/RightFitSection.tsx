/**
 * RightFitSection — "Is This the Right Fit for Your Business?"
 *
 * Three CommunityRepBox cards covering the three ideal customer profiles:
 * already giving back, want to be intentional, and marketing multiplier.
 */
import { Container, Grid, Stack, Text } from '@chakra-ui/react';
import GivingIcon from '@/public/reputation/Giving.svg';
import IntentionalIcon from '@/public/reputation/Intentional.svg';
import MarketingIcon from '@/public/reputation/Marketing.svg';
import CommunityRepBox from '@/components/landing/CommunityRepBox';
import LandingH from '@/components/landing/LandingH';

const rightFit = [
  {
    image: GivingIcon,
    title: 'Already Giving Back',
    description:
      'Perfect if you already sponsor events, support schools, or contribute in ways that currently go undocumented.',
  },
  {
    image: IntentionalIcon,
    title: 'Want to Be Intentional',
    description:
      'A natural starting point for businesses wanting a structure to build their community involvement over time.',
  },
  {
    image: MarketingIcon,
    title: 'Marketing Multiplier',
    description:
      'Reinforces your existing marketing. Reviews become more believable, pricing feels justified, and choosing you feels easier.',
  },
];

const RightFitSection = () => {
  return (
    <Stack bgColor="#F7F8FA" borderY="1px solid #E9EAED">
      <Container
        py={{ base: '60px', lg: '100px' }}
        alignItems="center"
        display="flex"
        flexDir="column"
        gap="12"
      >
        <Stack textAlign="center" align="center" gap="6">
          <Stack w="100%">
            <LandingH>Is This the Right Fit for Your Business?</LandingH>
          </Stack>
          <Text color="text.primary" maxW="1032px">
            MasterGiver is designed for local businesses that believe their
            community involvement should be part of how they&apos;re known.
          </Text>
        </Stack>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="5">
          {rightFit.map(({ image, title, description }, i) => (
            <CommunityRepBox
              key={i}
              image={image}
              title={title}
              description={description}
            />
          ))}
        </Grid>
      </Container>
    </Stack>
  );
};

export default RightFitSection;

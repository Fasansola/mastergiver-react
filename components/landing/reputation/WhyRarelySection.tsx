/**
 * WhyRarelySection — "Why Community Impact Rarely Becomes a Reputation Signal"
 *
 * Two dark cards (brand.primary bg) explaining the two root causes:
 * impact is scattered & unorganized, and invisible to customers & tech.
 */
import { Container, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import NextImage from 'next/image';
import ScatterIcon from '@/public/reputation/Scatter.svg';
import InvisibleIcon from '@/public/reputation/Invisible.svg';
import LandingH from '@/components/landing/LandingH';

const problems = [
  {
    image: ScatterIcon,
    title: 'Scattered & Unorganized',
    description:
      'A mention on an event page here, a social media post there, a line in a local news article — it never accumulates into a coherent reputation record. The full picture is rarely visible in any one place.',
  },
  {
    image: InvisibleIcon,
    title: 'Invisible to Customers & Tech',
    description:
      'Customers only see fragments, so it rarely registers as a trust signal like reviews do. Unorganized involvement is increasingly invisible not just to customers, but to the tech shaping discovery.',
  },
];

const WhyRarelySection = () => {
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
          <Stack w="100%" maxW="872px">
            <LandingH>
              Why Community Impact Rarely Becomes a Reputation Signal
            </LandingH>
          </Stack>
          <Text color="text.primary" maxW="1032px">
            Local businesses contribute to their communities in real and
            meaningful ways, but the reputation benefit simply isn&apos;t being
            captured.
          </Text>
        </Stack>

        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
          gap="4"
          w="100%"
        >
          {problems.map(({ image, title, description }, i) => (
            <Stack
              p={{ base: '6', lg: '10' }}
              gap="6"
              bg="brand.primary"
              boxShadow="0px 1px 2px 0px #4646490F, 0px 5px 3px 0px #4646490A"
              borderRadius="12px"
              align="center"
              textAlign="center"
              w="100%"
              color="white"
              key={i}
            >
              <Stack gap="10" align="center">
                <Stack
                  bgColor="#ECEBF8"
                  borderRadius="16px"
                  maxW="100px"
                  maxH="100px"
                  w="100px"
                  h="100px"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink="0"
                  border="0.5px solid #AECCFF"
                >
                  <NextImage alt={title} src={image} width={60} height={60} />
                </Stack>
                <Heading className="font-display" fontSize="28px">
                  {title}
                </Heading>
              </Stack>
              <Text className="font-body" lineHeight="180%" fontSize="body">
                {description}
              </Text>
            </Stack>
          ))}
        </Grid>
      </Container>
    </Stack>
  );
};

export default WhyRarelySection;

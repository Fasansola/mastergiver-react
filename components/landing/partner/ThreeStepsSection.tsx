/**
 * ThreeStepsSection — "Three Steps. Done in Under a Minute."
 *
 * Three numbered step cards (fill form → get toolkit → share network)
 * followed by a pull-quote callout targeting the right type of organization.
 */
import { Container, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import LandingH from '@/components/landing/LandingH';

const steps = [
  {
    title: 'Complete the Short Form',
    description:
      "Tell us about your organization and who we should contact. We'll use this information to personalize the resources we provide.",
  },
  {
    title: 'Receive Sponsor Resources',
    description:
      "We'll send you everything you need to introduce MasterGiver to your sponsors, including a ready-to-share email and educational resources.",
  },
  {
    title: 'Share with your Sponsors',
    description:
      'Simply forward the email, include it in your newsletter, or share the resources with current and prospective sponsors.',
  },
];

const ThreeStepsSection = () => {
  return (
    <Stack bgColor="background.section" borderY="1px solid #E9EAED">
      <Container
        py={{ base: '60px', lg: '100px' }}
        alignItems="center"
        display="flex"
        flexDir="column"
        gap={{ base: '12', lg: '20' }}
      >
        <Stack gap={{ base: '10', lg: '60px' }} align="center">
          <Stack textAlign="center" align="center" gap="6">
            <Stack w="100%" maxW="872px" gap="0">
              <LandingH>Three Steps.</LandingH>
              <LandingH>Done in Under a Minute.</LandingH>
            </Stack>
          </Stack>

          <Grid
            templateColumns={{
              base: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            }}
            gap="5"
          >
            {steps.map(({ title, description }, i) => (
              <Stack
                key={i}
                textAlign="center"
                align="center"
                gap="10"
                p="8"
                bgColor="background.white"
                borderRadius="16px"
              >
                <Stack
                  h="100px"
                  w="100px"
                  align="center"
                  justify="center"
                  color="white"
                  fontSize="46px"
                  bg="brand.primary"
                  borderRadius="20px"
                  className="font-display"
                  fontWeight="700"
                >
                  {i + 1}
                </Stack>
                <Stack gap="4">
                  <Heading
                    fontSize="28px"
                    className="font-display"
                    color="brand.primary"
                  >
                    {title}
                  </Heading>
                  <Text fontSize="16px" color="text.primary" lineHeight="180%">
                    {description}
                  </Text>
                </Stack>
              </Stack>
            ))}
          </Grid>

          <Stack
            padding="6"
            borderRadius="0 16px 16px 0"
            border="1px solid"
            borderLeft="4px solid"
            borderColor="#5851BF"
            bg="background.white"
            maxW="1032px"
          >
            <Text
              className="font-body"
              fontSize={{ base: '18px', lg: '21px' }}
              lineHeight="170%"
              textAlign="start"
            >
              If your organization connects and supports local businesses,
              this partnership is designed for you.
            </Text>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default ThreeStepsSection;

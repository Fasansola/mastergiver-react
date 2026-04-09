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
      "Tell us your organization name, contact, and type. That's all we need to get you started.",
  },
  {
    title: 'Get Your Partner Toolkit',
    description:
      "We'll send your custom $20 partner discount code and a ready-to-send email template.",
  },
  {
    title: 'Share With Your Network.',
    description:
      'Forward the email to your members, sponsors, or supporters. Copy, paste, and done.',
  },
];

const ThreeStepsSection = () => {
  return (
    <Stack bgColor="#F7F8FA" borderY="1px solid #E9EAED">
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
                bgColor="white"
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
            bg="#FFFFFF"
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

/**
 * ReturnOnReputationSection — "A reputation profile that works while you work."
 *
 * Covers the ROI argument: three pricing-value cards (cost vs. return) plus
 * three influence cards explaining how profiles compound over time.
 * Includes a pull-quote callout at the bottom.
 */
import { Container, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import LandingH from '@/components/landing/LandingH';
import PricingValueBox from '@/components/landing/PricingValueBox';

const pricingBox = [
  {
    price: 'Just 1 Customer',
    title: 'Covers your annual cost',
    description:
      'If your profile influences even one new customer, it typically pays for itself—often many times over.',
  },
  {
    price: '$100–$1k+',
    title: 'REVENUE PER CUSTOMER',
    description:
      'A single visit, project, or client relationship typically exceeds the annual cost of the profile many times over.',
  },
  {
    price: '$59/yr',
    title: 'UNDER $1.20 PER WEEK',
    description:
      "A permanent, always-on asset in your business's digital presence — not a recurring ad budget.",
  },
];

const influenceBox = [
  {
    title: 'Search & AI discovery',
    description:
      "Structured profiles are indexed by Google and surfaced by AI tools like ChatGPT and Perplexity when someone asks \"who's the best [service] near me.",
  },
  {
    title: 'Trust at the decision moment',
    description:
      'Customers comparing options in the final stage of a decision are significantly more likely to choose a business with visible credentials and social proof.',
  },
  {
    title: 'Compounding over time',
    description:
      'Every review, credential, and endorsement added to your profile strengthens its authority — growing your competitive edge with each passing month.',
  },
];

const ReturnOnReputationSection = () => {
  return (
    <Stack bgColor="#F7F8FA" borderY="1px solid #E9EAED">
      <Container
        py={{ base: '60px', lg: '100px' }}
        alignItems="center"
        display="flex"
        flexDir="column"
        gap={{ base: '12', lg: '20' }}
      >
        <Stack gap="12">
          <Stack textAlign="center" align="center" gap="6">
            <Text color="brand.primary" fontSize="heading" fontWeight="500">
              THE RETURN ON REPUTATION
            </Text>
            <Stack w="100%" maxW="872px">
              <LandingH>
                A reputation profile that works while you work.
              </LandingH>
            </Stack>
            <Text color="text.primary" maxW="1032px">
              Unlike advertising spend that stops the moment you pause it, a
              structured reputation profile compounds over time — building
              indexed, discoverable trust that search engines and AI tools
              surface to customers when it matters most.
            </Text>
          </Stack>

          <Grid
            templateColumns={{
              base: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            }}
            gap="4"
          >
            {pricingBox.map((item, i) => (
              <PricingValueBox
                key={i}
                price={item.price}
                title={item.title}
                description={item.description}
              />
            ))}
          </Grid>
        </Stack>

        <Stack gap="12" textAlign="center" align="center">
          <Heading
            className="font-display"
            fontWeight="700"
            fontSize={{ base: '26px', md: '36px', lg: '46px' }}
            lineHeight="120%"
            color="brand.primary"
          >
            How a profile actually influences customer decisions
          </Heading>

          <Grid
            templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }}
            gap="10"
          >
            {influenceBox.map((item, i) => (
              <Stack gap="4" key={i} align="start" textAlign="start">
                <Heading
                  className="font-display"
                  fontSize={{ base: '20px', lg: '28px' }}
                  color="brand.primary"
                  fontWeight="500"
                >
                  {item.title}
                </Heading>
                <Text
                  color="text.primary"
                  className="font-body"
                  lineHeight="180%"
                  fontSize="body"
                >
                  {item.description}
                </Text>
              </Stack>
            ))}
          </Grid>

          <Stack
            padding="8"
            borderRadius="0 16px 16px 0"
            border="1px solid"
            borderLeft="4px solid"
            borderColor="#BDBDFA"
            bg="#FFFFFF"
            maxW="1032px"
          >
            <Text
              className="font-body"
              fontSize={{ base: '16px', lg: '20px' }}
              lineHeight="150%"
              textAlign="start"
            >
              <b>
                Reputation is the one asset your competitors can&apos;t easily
                copy.
              </b>{' '}
              A profile built today keeps generating trust signals — in search
              results, AI answers, and customer conversations — long after
              it&apos;s set up.
            </Text>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default ReturnOnReputationSection;

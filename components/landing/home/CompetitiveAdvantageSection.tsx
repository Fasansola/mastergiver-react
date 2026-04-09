/**
 * CompetitiveAdvantageSection — "Turn Community Impact Into Competitive Advantage"
 *
 * Two-part section:
 * 1. Pricing card — $59/yr with feature checklist and CTA.
 * 2. Dark comparison card — contrasts MasterGiver cost against Google Ads / SEO.
 */
import {
  Button,
  Container,
  Grid,
  Heading,
  Separator,
  Span,
  Stack,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import LandingH from '@/components/landing/LandingH';
import GreenCheck from '@/components/landing/GreenCheck';

const CompetitiveAdvantageSection = () => {
  return (
    <Stack>
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
              Turn Community Impact Into Competitive Advantage
            </LandingH>
          </Stack>
          <Text color="text.primary" maxW="1032px">
            You already invest in: Marketing, Ads, SEO, Brand awareness.
            MasterGiver doesn&apos;t replace those. It strengthens all of them
            by making your reputation visible to AI, search engines, and
            customers.
          </Text>
        </Stack>

        {/* Pricing card */}
        <Stack
          p={{ base: '8', lg: '60px' }}
          boxShadow="0px 25px 50px -12px #00000040"
          bgColor="white"
          align="center"
          border="0.5px solid #E9EAED"
          borderRadius="16px"
          w={{ base: '100%', lg: 'auto' }}
          maxW="700px"
          alignItems="center"
          gap="8"
        >
          <Stack gap="6" align="center">
            <Heading
              className="font-display"
              fontWeight="700"
              fontSize={{ base: '26px', lg: '40px' }}
              lineHeight="120%"
              color="text.primary"
              textAlign="center"
            >
              Get Your MasterGiver Reputation Profile
            </Heading>

            <Separator borderColor="border.default" w="100%" />

            <Stack textAlign="center">
              <Heading
                className="font-display"
                fontWeight="700"
                fontSize={{ base: '40px', lg: '48px' }}
                lineHeight="100%"
                color="text.primary"
              >
                $59
                <Span
                  className="font-display"
                  fontSize="20px"
                  lineHeight="100%"
                  color="text.primary"
                >
                  {' '}
                  / year
                </Span>
              </Heading>
              <Text>That&apos;s just $4.92/month</Text>
            </Stack>

            <Stack
              padding={{ base: '6', lg: '8' }}
              borderRadius="8px"
              border="1px solid"
              borderLeft="4px solid"
              borderColor="#AECCFF"
              bg="#F5F8FF"
            >
              <Text
                className="font-display"
                fontWeight="600"
                fontSize={{ base: '16px', lg: '18px' }}
                lineHeight="130%"
                textAlign="start"
                color="brand.primary"
              >
                Less than $5/month to ensure your reputation signals show up
                and drive new customers to your business.
              </Text>
            </Stack>
          </Stack>

          <Stack w="100%" gap="2">
            {[
              'Verified reputation profile that AI and search engines can read',
              'Trust badge for your website, emails & marketing materials',
              'Directory inclusion for customers and AI to discover you',
              'Ongoing profile updates as your community impact grows',
            ].map((item, i) => (
              <GreenCheck key={i} item={item} />
            ))}
          </Stack>

          <Separator borderColor="border.default" width="100%" />

          <Link href="/reputation" className="w-full">
            <Button
              bg="#2F2B77"
              color="white"
              fontWeight="700"
              fontSize={{ base: '16px', lg: '20px' }}
              lineHeight="160%"
              borderRadius="8px"
              px={{ base: '6', lg: '8' }}
              py="4"
              h="auto"
              w="100%"
              whiteSpace="normal"
              boxShadow="0px 8px 10px -6px #E2E1FF, 0px 20px 25px -5px #D4D1FF"
            >
              Get Your Reputation Profile
            </Button>
          </Link>
        </Stack>

        {/* Spending comparison */}
        <Stack
          bgColor="#1F2937"
          p={{ base: '8', lg: '10' }}
          color="white!"
          w={{ base: '100%', lg: 'auto' }}
          maxW="866px"
          borderRadius="16px"
          textAlign="center"
          gap="10"
        >
          <Heading className="font-display" fontSize="bigheading" lineHeight="120%">
            What You&apos;re Already Spending vs. What You Get
          </Heading>
          <Stack gap="6">
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
              gap="3"
            >
              {[
                { title: '$500+', description: 'GOOGLE ADS' },
                { title: '$1200+', description: 'SEO SERVICES' },
                { title: '$59', description: 'MASTERGIVER' },
              ].map((item, id) => (
                <Stack
                  key={id}
                  border="1px solid"
                  bgColor="#2D394A"
                  borderRadius="8px"
                  borderColor="#49505A"
                  p="6"
                  gap="4"
                  boxShadow="0px 1px 2px 0px #4646490F, 0px 5px 3px 0px #4646490A"
                >
                  <Heading className="font-display" fontSize="28px">
                    {item.title}
                  </Heading>
                  <Text>{item.description}</Text>
                </Stack>
              ))}
            </Grid>
            <Text fontWeight="500" className="font-body">
              While other marketing investments compete for attention,
              MasterGiver builds lasting reputation equity that works 24/7 to
              get you recommended and discovered.
            </Text>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default CompetitiveAdvantageSection;

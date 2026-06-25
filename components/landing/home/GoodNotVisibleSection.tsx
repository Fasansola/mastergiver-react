/**
 * GoodNotVisibleSection — "The Good You Do Isn't Automatically Visible"
 *
 * Explains the visibility gap between offline good deeds and online presence.
 * Pull-quote callout + grid of WhatWeDoBox cards (web, AI, customers, search).
 */
import { Box, Container, Grid, HStack, Stack, Text } from '@chakra-ui/react';
import Web from '@/public/landing/Web.svg';
import Customer from '@/public/landing/Customer.svg';
import Search from '@/public/landing/SearchIcon.svg';
import Assistant from '@/public/landing/Assistant.svg';
import WhatWeDoBox from '@/components/landing/WhatWeDoBox';
import LandingH from '@/components/landing/LandingH';
import BrandCheck from '@/components/landing/BrandCheck';

const whatWeDo = [
  {
    image: Web.src,
    title: 'Build Trust',
    description:
      'Customers increasingly look beyond ratings and reviews. Community involvement provides another layer of credibility that helps reinforce trust in your business.',
  },
  {
    image: Assistant.src,
    title: 'Stand Out From Competitors',
    description:
      'Most businesses look similar online. A documented record of community involvement highlights the values and actions that make your organization different.',
  },
  {
    image: Customer.src,
    title: 'Strengthen Your Reputation',
    description:
      'Your sponsorships, donations, volunteer efforts, and nonprofit partnerships are already contributing to your reputation. MasterGiver helps make those contributions visible.',
  },
  {
    image: Search.src,
    title: 'Increase Discoverability',
    description:
      'Structured community impact data creates additional trust signals that can support visibility across search, AI systems, and other digital discovery channels.',
  },
];

const GoodNotVisibleSection = () => {
  return (
    <Stack>
      <Container
        py={{ base: '60px', lg: '100px' }}
        alignItems="center"
        justifyContent="center"
        display="flex"
        flexDir="column"
        gap="10"
        w="100%"
      >
        <Box textAlign="center" w="100%" maxW="960px">
          <LandingH>
            Turn Your Community Impact Into a Reputation Advantage
          </LandingH>
        </Box>

        <Stack
          direction={{ base: 'column', lg: 'row' }}
          p={{ base: '6', lg: '10' }}
          bg="background.section"
          border="0.5px solid #E9EAED"
          w="100%"
          gap="12"
          justify="space-between"
          borderRadius="16px"
        >
          <Stack gap="6" w={{ base: '100%', lg: '760px' }}>
            <HStack gap="4" flexWrap="wrap">
              {[
                'You support local organizations and causes.',
                'You invest in the communities where your customers live and work.',
                'You believe business success should create community impact.',
              ].map((item, i) => (
                <BrandCheck key={i} item={item} />
              ))}
            </HStack>

            <Stack gap="2">
              <Text>
                But while most businesses spend years building reviews,
                websites, and advertising campaigns, very few have a structured
                way to showcase the community involvement that helps build trust
                and differentiate them from competitors.
              </Text>
              <Text>
                MasterGiver helps transform those efforts into a visible
                reputation asset that supports trust, discoverability, and
                customer choice.
              </Text>
            </Stack>
          </Stack>

          <Stack
            p={{ base: '5', lg: '8' }}
            w={{ base: '100%', lg: '350px' }}
            borderLeft="4px solid"
            borderColor="brand.primary"
            borderRadius="12px"
            bg="#EEEDFF"
            flexShrink="0"
          >
            <Text
              className="font-display"
              fontSize={{ base: '22px', md: '28px', lg: '36px' }}
              lineHeight="130%"
              color="brand.primary"
              fontWeight="700"
            >
              &quot;If algorithms can&apos;t see it, they can&apos;t reward
              it.&quot;
            </Text>
          </Stack>
        </Stack>

        <Grid
          gap="8"
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
          // maxW="1066px"
        >
          {whatWeDo.map((item, i) => (
            <WhatWeDoBox
              image={item.image}
              title={item.title}
              description={item.description}
              key={i}
            />
          ))}
        </Grid>
      </Container>
    </Stack>
  );
};

export default GoodNotVisibleSection;

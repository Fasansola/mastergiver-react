/**
 * GoodNotVisibleSection — "The Good You Do Isn't Automatically Visible"
 *
 * Explains the visibility gap between offline good deeds and online presence.
 * Pull-quote callout + grid of WhatWeDoBox cards (web, AI, customers, search).
 */
import {
  Box,
  Container,
  Grid,
  Heading,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';
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
    title: 'The Web',
    description:
      'Your real-world good is digital silence. Community impact deserves digital visibility.',
  },
  {
    image: Assistant.src,
    title: 'AI Assistants',
    description:
      "Can't factor your impact into recommendations. Your values remain invisible to algorithms.",
  },
  {
    image: Customer.src,
    title: 'Customers',
    description:
      "Don't see the values that make you different. Your community commitment stays hidden.",
  },
  {
    image: Search.src,
    title: 'Search Engines',
    description:
      'Missing your community data in rankings. Good deeds go unseen in search results.',
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
        <Box textAlign="center" w="100%" maxW="">
          <LandingH>
            The Good Your Business Does Isn’t Being Seen. <br />
            And That’s Costing You.
          </LandingH>
        </Box>

        <Stack
          direction={{ base: 'column', lg: 'row' }}
          p={{ base: '6', lg: '10' }}
          bg="#F8F8F8"
          border="0.5px solid #E9EAED"
          w="100%"
          gap="12"
          justify="space-between"
          borderRadius="16px"
        >
          <Stack gap="6" w={{ base: '100%', lg: '760px' }}>
            <HStack gap="4" flexWrap="wrap">
              {[
                'You sponsor local teams.',
                'You donate to causes.',
                'You support your community.',
              ].map((item, i) => (
                <BrandCheck key={i} item={item} />
              ))}
            </HStack>

            <Heading
              className="font-body"
              fontWeight="400"
              // fontSize={{ base: '22px', md: '24px', lg: '28px' }}
              fontSize="16px"
              lineHeight="120%"
              color="text.primary"
            >
              But online? It&apos;s like none of it ever happened.
            </Heading>

            <Stack gap="2">
              <Text>
                Your website doesn&apos;t surface it in a meaningful way. Search
                engines don&apos;t understand it. AI tools don&apos;t recognize
                it when deciding which businesses to recommend.
              </Text>
              <Text>
                So the very things that make your business different — your
                giving, your values, your community involvement, are missing
                from the systems now shaping visibility, rankings, and
                recommendations.
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
          maxW="966px"
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

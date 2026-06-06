/**
 * DirectoryHero
 *
 * Hero section for the /good-businesses hub page.
 * Uses a semantic <h1> for the headline for proper SEO hierarchy.
 * The city search typeahead is a client component island.
 */

import { Box, Container, Heading, Stack, Text } from '@chakra-ui/react';
import type { CityGroup } from '@/lib/directory';
import DirectorySearchClient from './DirectorySearchClient';

interface Props {
  cities: CityGroup[];
}

const DirectoryHero = ({ cities }: Props) => {
  return (
    <Stack
      as="section"
      bg="var(--gradient-hero-directory)"
      py={{ base: '56px', md: '72px', lg: '100px' }}
      position="relative"
    >
      {/* Decorative circles — clipped to their own box so overflow:hidden doesn't
          cut off the absolutely-positioned search dropdown */}
      <Box position="absolute" inset="0" overflow="hidden" pointerEvents="none">
        <Box
          position="absolute"
          top="-120px"
          right="-120px"
          w={{ base: '280px', lg: '500px' }}
          h={{ base: '280px', lg: '500px' }}
          borderRadius="full"
          bg="rgba(47,43,119,0.05)"
        />
        <Box
          position="absolute"
          bottom="-80px"
          left="-80px"
          w={{ base: '200px', lg: '320px' }}
          h={{ base: '200px', lg: '320px' }}
          borderRadius="full"
          bg="rgba(47,43,119,0.04)"
        />
      </Box>

      <Container position="relative">
        <Stack
          align="center"
          textAlign="center"
          gap={{ base: '6', md: '8', lg: '10' }}
          maxW="760px"
          mx="auto"
        >
          {/* Eyebrow pill */}
          <Box
            px="14px"
            py="6px"
            borderRadius="100px"
            bg="background.white"
            border="1px solid #DDD8FF"
            display="inline-flex"
            alignItems="center"
            boxShadow="0px 2px 8px rgba(47,43,119,0.08)"
          >
            <Text
              fontSize="11px"
              fontWeight="700"
              color="#2F2B77"
              className="font-body"
              letterSpacing={{ base: '0.4px', md: '0.7px' }}
              textTransform="uppercase"
            >
              GOOD Businesses™ • Verified by MasterGiver
            </Text>
          </Box>

          {/* H1 — semantic page title */}
          <Heading
            as="h1"
            className="font-display"
            fontWeight="700"
            fontSize={{ base: '28px', md: '40px', lg: '56px' }}
            lineHeight="125%"
            color="#1E1B4B"
            letterSpacing="-0.5px"
          >
            Discover Businesses Making A Positive Community Impact
          </Heading>

          {/* Subheadline */}
          <Text
            className="font-body"
            fontSize={{ base: '15px', md: '16px', lg: '18px' }}
            lineHeight="175%"
            color="#4B5563"
            maxW="520px"
          >
            Browse businesses showcasing verified community involvement,
            sponsorships, and local impact.
          </Text>

          {/* Search */}
          <Box w="100%" maxW="540px">
            <DirectorySearchClient cities={cities} />
          </Box>
        </Stack>
      </Container>
    </Stack>
  );
};

export default DirectoryHero;

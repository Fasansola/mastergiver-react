/**
 * DirectoryHero
 *
 * Hero section for the /good-businesses hub page.
 * Premium lavender gradient with headline, trust stats bar,
 * and the city search typeahead (client component).
 *
 * Derives total business count from the cities array so no extra DB
 * query is needed — the hub page already fetches cities.
 */

import { Box, Container, Stack, Text } from '@chakra-ui/react';
import type { CityGroup } from '@/lib/directory';
import DirectorySearchClient from './DirectorySearchClient';

interface Props {
  cities: CityGroup[];
}

const DirectoryHero = ({ cities }: Props) => {
  return (
    <Stack
      bg="linear-gradient(160deg, #F0F4FF 0%, #EAF0FF 40%, #F5F3FF 100%)"
      py={{ base: '64px', lg: '100px' }}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative circles — pure CSS, no images needed */}
      <Box
        position="absolute"
        top="-120px"
        right="-120px"
        w="500px"
        h="500px"
        borderRadius="full"
        bg="rgba(47,43,119,0.05)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-80px"
        left="-80px"
        w="320px"
        h="320px"
        borderRadius="full"
        bg="rgba(47,43,119,0.04)"
        pointerEvents="none"
      />

      <Container position="relative">
        <Stack align="center" textAlign="center" gap={{ base: '8', lg: '10' }} maxW="760px" mx="auto">

          {/* Eyebrow pill */}
          <Box
            px="16px"
            py="7px"
            borderRadius="100px"
            bg="white"
            border="1px solid #DDD8FF"
            display="inline-flex"
            alignItems="center"
            gap="6px"
            boxShadow="0px 2px 8px rgba(47,43,119,0.08)"
          >
            <Box w="6px" h="6px" borderRadius="full" bg="#2F2B77" flexShrink="0" />
            <Text
              fontSize="12px"
              fontWeight="700"
              color="#2F2B77"
              className="font-body"
              letterSpacing="0.8px"
              textTransform="uppercase"
            >
              GOOD Businesses™ · Powered by MasterGiver
            </Text>
          </Box>

          {/* Headline */}
          <Text
            className="font-display"
            fontWeight="700"
            fontSize={{ base: '32px', md: '46px', lg: '56px' }}
            lineHeight="110%"
            color="#1E1B4B"
            letterSpacing="-0.5px"
          >
            Discover Businesses Creating Real Community Impact
          </Text>

          {/* Subheadline */}
          <Text
            className="font-body"
            fontSize={{ base: '16px', lg: '18px' }}
            lineHeight="175%"
            color="#4B5563"
            maxW="540px"
          >
            Browse verified reputation profiles from businesses that turn
            community involvement into visible trust signals.
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

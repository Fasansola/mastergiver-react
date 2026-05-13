/**
 * CityGrid
 *
 * Browse-by-city section on the /good-businesses hub page.
 * Renders a responsive grid of city links sorted by business count.
 * Each cell links to /good-businesses/[citySlug].
 */

import { Box, Container, Grid, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { LuMapPin, LuArrowRight } from 'react-icons/lu';
import type { CityGroup } from '@/lib/directory';

interface Props {
  cities: CityGroup[];
}

const CityGrid = ({ cities }: Props) => {
  if (cities.length === 0) return null;

  return (
    <Stack as="section" bg="white" py={{ base: '56px', md: '72px', lg: '88px' }}>
      <Container>
        <Stack gap="10">
          {/* Section header */}
          <Stack
            direction={{ base: 'column', md: 'row' }}
            align={{ base: 'start', md: 'end' }}
            justify="space-between"
            gap="4"
          >
            <Stack gap="2">
              <Text
                fontSize="12px"
                fontWeight="700"
                color="#2F2B77"
                className="font-body"
                letterSpacing="0.8px"
                textTransform="uppercase"
              >
                Browse by Location
              </Text>
              <Heading
                className="font-display"
                fontWeight="700"
                fontSize={{ base: '24px', md: '28px', lg: '34px' }}
                color="#1E1B4B"
                lineHeight="120%"
              >
                Find GOOD Businesses Near You
              </Heading>
            </Stack>
            <Text
              className="font-body"
              color="#6B7280"
              fontSize="14px"
              flexShrink="0"
            >
              {cities.length} {cities.length === 1 ? 'city' : 'cities'} listed
            </Text>
          </Stack>

          {/* City grid */}
          <Grid
            templateColumns={{
              base: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            }}
            gap="3"
          >
            {cities.map((city) => (
              <Link key={city.slug} href={`/good-businesses/${city.slug}`}>
                <HStack
                  bg="#FAFBFF"
                  border="1px solid #E8EBFF"
                  borderRadius="12px"
                  px="16px"
                  py="14px"
                  gap="3"
                  justify="space-between"
                  _hover={{
                    bg: '#F0EEFF',
                    borderColor: '#2F2B77',
                    transform: 'translateY(-1px)',
                    boxShadow: '0px 4px 12px rgba(47,43,119,0.10)',
                  }}
                  transition="all 0.15s"
                  cursor="pointer"
                >
                  <HStack gap="2.5" align="start" minW="0">
                    <Box color="#2F2B77" flexShrink="0" pt="2px" display="flex">
                      <LuMapPin size={13} />
                    </Box>
                    <Stack gap="0" minW="0">
                      <Text
                        fontWeight="600"
                        fontSize="13px"
                        color="#1E1B4B"
                        className="font-body"
                        lineHeight="140%"
                        style={{
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {city.city}, {city.state}
                      </Text>
                      <Text
                        fontSize="11px"
                        color="#9CA3AF"
                        className="font-body"
                      >
                        {city.count}{' '}
                        {city.count === 1 ? 'business' : 'businesses'}
                      </Text>
                    </Stack>
                  </HStack>
                  <Box color="#C4C0F0" flexShrink="0" display="flex">
                    <LuArrowRight size={14} />
                  </Box>
                </HStack>
              </Link>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Stack>
  );
};

export default CityGrid;

/**
 * /good-businesses — GOOD Businesses directory hub.
 *
 * Public discovery layer for MasterGiver business profiles.
 * Server-rendered on every request so new businesses and cities
 * appear immediately without a redeploy.
 *
 * Sections:
 *   1. Hero with city search typeahead + trust stats
 *   2. Browse by city grid
 *   3. Recently added businesses (up to 12)
 *   4. CTA for businesses to sign up
 */

import type { Metadata } from 'next';
import { Box, Container, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { getAllDirectoryBusinesses, getCityGroups } from '@/lib/directory';
import DirectoryHero from '@/components/landing/directory/DirectoryHero';
import CityGrid from '@/components/landing/directory/CityGrid';
import BusinessDirectoryCard from '@/components/landing/directory/BusinessDirectoryCard';
import DirectoryCta from '@/components/landing/directory/DirectoryCta';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'GOOD Businesses Directory | MasterGiver',
  description:
    'Discover businesses creating visible community impact. Browse GOOD Businesses by city — verified reputation profiles powered by MasterGiver.',
  alternates: { canonical: 'https://mastergiver.com/good-businesses' },
  openGraph: {
    title: 'GOOD Businesses Directory | MasterGiver',
    description:
      'Discover businesses creating visible community impact. Browse GOOD Businesses by city — verified reputation profiles powered by MasterGiver.',
    url: 'https://mastergiver.com/good-businesses',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GOOD Businesses Directory | MasterGiver',
    description:
      'Discover businesses creating visible community impact. Browse GOOD Businesses by city — verified reputation profiles powered by MasterGiver.',
  },
};

const GoodBusinessesPage = async () => {
  const [businesses, cities] = await Promise.all([
    getAllDirectoryBusinesses(),
    getCityGroups(),
  ]);

  const totalBusinesses = businesses.length;

  return (
    <>
      <DirectoryHero cities={cities} />
      <CityGrid cities={cities} />

      {businesses.length > 0 && (
        <Stack bg="#F8F9FF" py={{ base: '64px', lg: '88px' }}>
          <Container>
            <Stack gap="10">
              {/* Section header */}
              <Stack gap="2">
                <Text
                  fontSize="12px"
                  fontWeight="700"
                  color="#2F2B77"
                  className="font-body"
                  letterSpacing="0.8px"
                  textTransform="uppercase"
                >
                  Recently Added
                </Text>
                <Heading
                  className="font-display"
                  fontWeight="700"
                  fontSize={{ base: '26px', lg: '34px' }}
                  color="#1E1B4B"
                  lineHeight="120%"
                >
                  GOOD Businesses Making an Impact
                </Heading>
                <Text className="font-body" color="#6B7280" fontSize="15px" maxW="480px">
                  Businesses that have documented and published their community
                  impact on MasterGiver.
                </Text>
              </Stack>

              <Grid
                templateColumns={{
                  base: '1fr',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                }}
                gap="6"
              >
                {businesses.slice(0, 12).map((b) => (
                  <BusinessDirectoryCard key={b.slug} business={b} />
                ))}
              </Grid>

              {/* Empty state fallback — should never show since we guard above */}
              {businesses.length === 0 && (
                <Box
                  textAlign="center"
                  py="16"
                  color="#9CA3AF"
                  className="font-body"
                >
                  No businesses listed yet. Check back soon.
                </Box>
              )}
            </Stack>
          </Container>
        </Stack>
      )}

      <DirectoryCta />
    </>
  );
};

export default GoodBusinessesPage;

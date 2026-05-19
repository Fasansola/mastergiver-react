/**
 * /good-businesses — GOOD Businesses directory hub.
 *
 * Public discovery layer for MasterGiver business profiles.
 * Server-rendered on every request so new businesses and cities
 * appear immediately without a redeploy.
 *
 * SEO: H1 lives in DirectoryHero, H2s here. JSON-LD ItemList
 * structured data for Google to understand the directory.
 */

import type { Metadata } from 'next';
import { Box, Container, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import {
  getAllDirectoryBusinesses,
  getCityGroups,
  type DirectoryBusiness,
  type CityGroup,
} from '@/lib/directory';
import DirectoryHero from '@/components/landing/directory/DirectoryHero';
import CityGrid from '@/components/landing/directory/CityGrid';
import BusinessDirectoryCard from '@/components/landing/directory/BusinessDirectoryCard';
import DirectoryCta from '@/components/landing/directory/DirectoryCta';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mastergiver.com';

// Max businesses shown in the "Recently Added" section
const FEATURED_COUNT = 12;

export const metadata: Metadata = {
  title: 'GOOD Businesses Directory | MasterGiver',
  description:
    'Discover businesses creating visible community impact. Browse GOOD Businesses by city — verified reputation profiles powered by MasterGiver.',
  alternates: { canonical: 'https://mastergiver.com/good-businesses' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'GOOD Businesses Directory | MasterGiver',
    description:
      'Discover businesses creating visible community impact. Browse GOOD Businesses by city — verified reputation profiles powered by MasterGiver.',
    url: 'https://mastergiver.com/good-businesses',
    type: 'website',
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
  ]).catch((err) => {
    console.error('[good-businesses] page data fetch failed:', err);
    return [[], []] as [DirectoryBusiness[], CityGroup[]];
  });

  // JSON-LD: ItemList schema so Google understands this is a curated directory.
  // Escape < to \u003c to prevent </script> injection via user-controlled data.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'GOOD Businesses Directory',
    description:
      'Businesses creating visible community impact, verified by MasterGiver.',
    url: `${BASE_URL}/good-businesses`,
    numberOfItems: businesses.length,
    itemListElement: businesses.slice(0, FEATURED_COUNT).map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE_URL}/business/${b.slug}`,
      name: b.companyName ?? 'Business',
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      {/* Pass ALL cities (incl. Coming Soon) to search, only active to grid */}
      <DirectoryHero cities={cities} />
      <CityGrid cities={cities.filter((c) => c.count > 0)} />

      {businesses.length > 0 ? (
        <Stack
          as="section"
          aria-label="Recently added businesses"
          bg="#F8F9FF"
          py={{ base: '56px', md: '72px', lg: '88px' }}
        >
          <Container>
            <Stack gap={{ base: '8', lg: '10' }}>
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
                  as="h2"
                  className="font-display"
                  fontWeight="700"
                  fontSize={{ base: '24px', md: '28px', lg: '34px' }}
                  color="#1E1B4B"
                  lineHeight="120%"
                >
                  GOOD Businesses Making an Impact
                </Heading>
                <Text
                  className="font-body"
                  color="#6B7280"
                  fontSize={{ base: '14px', lg: '15px' }}
                  maxW="480px"
                >
                  Businesses that have documented and published their community
                  impact on MasterGiver.
                </Text>
              </Stack>

              <Grid
                templateColumns={{
                  base: '1fr',
                  md: 'repeat(2, 1fr)',
                }}
                gap={{ base: '6', md: '12' }}
              >
                {businesses.slice(0, FEATURED_COUNT).map((b) => (
                  <BusinessDirectoryCard key={b.slug} business={b} />
                ))}
              </Grid>
            </Stack>
          </Container>
        </Stack>
      ) : (
        /* Empty state — shown when no businesses are published yet */
        <Stack
          as="section"
          bg="#F8F9FF"
          py={{ base: '56px', md: '72px', lg: '88px' }}
          align="center"
          textAlign="center"
        >
          <Container>
            <Stack align="center" gap="5" maxW="460px" mx="auto">
              <Heading
                as="h2"
                className="font-display"
                fontWeight="700"
                fontSize={{ base: '22px', md: '26px' }}
                color="#1E1B4B"
                lineHeight="130%"
              >
                Be the First GOOD Business Listed
              </Heading>
              <Text className="font-body" fontSize="15px" color="#6B7280" lineHeight="170%">
                No businesses are listed yet. Create your reputation profile and
                show your community your impact.
              </Text>
              <Link href="/business/signup">
                <Box
                  as="button"
                  bg="#2F2B77"
                  color="white"
                  fontWeight="700"
                  fontSize="15px"
                  borderRadius="10px"
                  h="48px"
                  px="8"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontFamily="inherit"
                  cursor="pointer"
                  _hover={{ bg: '#3d3899' }}
                  transition="background 0.15s"
                >
                  Get Listed →
                </Box>
              </Link>
            </Stack>
          </Container>
        </Stack>
      )}

      <DirectoryCta />
    </>
  );
};

export default GoodBusinessesPage;

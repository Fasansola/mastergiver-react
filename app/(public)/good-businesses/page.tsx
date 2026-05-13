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
import { Container, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { getAllDirectoryBusinesses, getCityGroups } from '@/lib/directory';
import DirectoryHero from '@/components/landing/directory/DirectoryHero';
import CityGrid from '@/components/landing/directory/CityGrid';
import BusinessDirectoryCard from '@/components/landing/directory/BusinessDirectoryCard';
import DirectoryCta from '@/components/landing/directory/DirectoryCta';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mastergiver.com';

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
  ]);

  // JSON-LD: ItemList schema so Google understands this is a curated directory
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'GOOD Businesses Directory',
    description:
      'Businesses creating visible community impact, verified by MasterGiver.',
    url: `${BASE_URL}/good-businesses`,
    numberOfItems: businesses.length,
    itemListElement: businesses.slice(0, 12).map((b, i) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <DirectoryHero cities={cities} />
      <CityGrid cities={cities} />

      {businesses.length > 0 && (
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
                  lg: 'repeat(3, 1fr)',
                }}
                gap={{ base: '4', md: '5', lg: '6' }}
              >
                {businesses.slice(0, 12).map((b) => (
                  <BusinessDirectoryCard key={b.slug} business={b} />
                ))}
              </Grid>
            </Stack>
          </Container>
        </Stack>
      )}

      <DirectoryCta />
    </>
  );
};

export default GoodBusinessesPage;

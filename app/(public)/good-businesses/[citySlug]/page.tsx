/**
 * /good-businesses/[citySlug] — City-specific directory page.
 *
 * e.g. /good-businesses/wilmington-nc shows all active + published
 * businesses in Wilmington, NC.
 *
 * SEO: H1 is the city name. JSON-LD ItemList scoped to this city.
 * Returns 404 if no businesses exist for that city slug.
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  Box,
  Container,
  Grid,
  Heading,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';
import { LuMapPin } from 'react-icons/lu';
import { getBusinessesByCity, parseCitySlug } from '@/lib/directory';
import BusinessDirectoryCard from '@/components/landing/directory/BusinessDirectoryCard';
import DirectoryCta from '@/components/landing/directory/DirectoryCta';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mastergiver.com';

interface Props {
  params: Promise<{ citySlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { citySlug } = await params;
  const { city, state } = parseCitySlug(citySlug);
  const label = `${city}, ${state}`;

  return {
    title: `GOOD Businesses in ${label} | MasterGiver`,
    description: `Discover businesses in ${label} creating visible community impact. Verified reputation profiles powered by MasterGiver.`,
    alternates: {
      canonical: `https://mastergiver.com/good-businesses/${citySlug}`,
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: `GOOD Businesses in ${label} | MasterGiver`,
      description: `Discover businesses in ${label} creating visible community impact. Verified reputation profiles powered by MasterGiver.`,
      url: `https://mastergiver.com/good-businesses/${citySlug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `GOOD Businesses in ${label} | MasterGiver`,
      description: `Discover businesses in ${label} creating visible community impact. Verified reputation profiles powered by MasterGiver.`,
    },
  };
}

const CityDirectoryPage = async ({ params }: Props) => {
  const { citySlug } = await params;
  const businesses = await getBusinessesByCity(citySlug);

  if (businesses.length === 0) notFound();

  const { city, state } = parseCitySlug(citySlug);
  const label = `${city}, ${state}`;

  // JSON-LD: ItemList schema scoped to this city
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `GOOD Businesses in ${label}`,
    description: `Businesses in ${label} creating visible community impact, verified by MasterGiver.`,
    url: `${BASE_URL}/good-businesses/${citySlug}`,
    numberOfItems: businesses.length,
    itemListElement: businesses.map((b, i) => ({
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

      {/* Page header */}
      <Stack
        as="section"
        bg="linear-gradient(160deg, #F0F4FF 0%, #EAF0FF 40%, #F5F3FF 100%)"
        py={{ base: '44px', md: '56px', lg: '72px' }}
        position="relative"
      >
        {/* Decorative circle — wrapped so overflow:hidden doesn't clip content */}
        <Box position="absolute" inset="0" overflow="hidden" pointerEvents="none">
          <Box
            position="absolute"
            top="-100px"
            right="-100px"
            w={{ base: '240px', lg: '400px' }}
            h={{ base: '240px', lg: '400px' }}
            borderRadius="full"
            bg="rgba(47,43,119,0.05)"
          />
        </Box>

        <Container position="relative">
          <Stack gap={{ base: '5', md: '6' }} maxW="760px">
            {/* H1 — city name */}
            <HStack gap={{ base: '2', md: '3' }} align="center">
              <Box
                color="#2F2B77"
                display="flex"
                flexShrink="0"
                fontSize={{ base: '20px', md: '24px', lg: '28px' }}
              >
                <LuMapPin />
              </Box>
              <Heading
                as="h1"
                className="font-display"
                fontWeight="700"
                fontSize={{ base: '24px', md: '36px', lg: '48px' }}
                lineHeight="110%"
                color="#1E1B4B"
                letterSpacing={{ base: '-0.2px', lg: '-0.3px' }}
              >
                {label}
              </Heading>
            </HStack>

            <Text
              className="font-body"
              fontSize={{ base: '14px', md: '16px' }}
              color="#4B5563"
              lineHeight="165%"
            >
              Explore businesses in {city} showcasing community involvement,
              sponsorships, and local impact.
            </Text>
          </Stack>
        </Container>
      </Stack>

      {/* Business grid */}
      <Stack
        as="section"
        aria-label={`Businesses in ${label}`}
        bg="#F8F9FF"
        py={{ base: '40px', md: '56px', lg: '72px' }}
      >
        <Container maxW="1100px">
          <Grid
            templateColumns={{
              base: '1fr',
              md: 'repeat(2, 1fr)',
            }}
            gap={{ base: '4', md: '5', lg: '6' }}
          >
            {businesses.map((b) => (
              <BusinessDirectoryCard key={b.slug} business={b} />
            ))}
          </Grid>
        </Container>
      </Stack>

      <DirectoryCta />
    </>
  );
};

export default CityDirectoryPage;

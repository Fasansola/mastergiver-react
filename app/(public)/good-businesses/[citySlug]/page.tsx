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
import Link from 'next/link';
import { LuArrowLeft, LuMapPin } from 'react-icons/lu';
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Page header */}
      <Stack
        as="section"
        bg="linear-gradient(160deg, #F0F4FF 0%, #EAF0FF 40%, #F5F3FF 100%)"
        py={{ base: '44px', md: '56px', lg: '72px' }}
        position="relative"
        overflow="hidden"
      >
        {/* Decorative circle */}
        <Box
          position="absolute"
          top="-100px"
          right="-100px"
          w={{ base: '240px', lg: '400px' }}
          h={{ base: '240px', lg: '400px' }}
          borderRadius="full"
          bg="rgba(47,43,119,0.05)"
          pointerEvents="none"
        />

        <Container position="relative">
          <Stack gap={{ base: '5', md: '6' }} maxW="760px">
            {/* Breadcrumb */}
            <Link href="/good-businesses" aria-label="Back to GOOD Businesses Directory">
              <HStack
                gap="2"
                display="inline-flex"
                color="#6B7280"
                _hover={{ color: '#2F2B77' }}
                transition="color 0.15s"
              >
                <LuArrowLeft size={14} />
                <Text fontSize="14px" fontWeight="600" className="font-body">
                  GOOD Businesses Directory
                </Text>
              </HStack>
            </Link>

            {/* Eyebrow */}
            <Box
              px="14px"
              py="6px"
              borderRadius="100px"
              bg="white"
              border="1px solid #DDD8FF"
              display="inline-flex"
              alignItems="center"
              gap="6px"
              w="fit-content"
              boxShadow="0px 2px 8px rgba(47,43,119,0.08)"
            >
              <Box
                w="6px"
                h="6px"
                borderRadius="full"
                bg="#2F2B77"
                flexShrink="0"
              />
              <Text
                fontSize={{ base: '10px', md: '12px' }}
                fontWeight="700"
                color="#2F2B77"
                className="font-body"
                letterSpacing="0.8px"
                textTransform="uppercase"
              >
                GOOD Businesses™ · Powered by MasterGiver
              </Text>
            </Box>

            {/* H1 — city name */}
            <HStack gap="3" align="center">
              <Box
                color="#2F2B77"
                display="flex"
                flexShrink="0"
              >
                <LuMapPin size={{ base: 20, lg: 28 } as unknown as number} />
              </Box>
              <Heading
                as="h1"
                className="font-display"
                fontWeight="700"
                fontSize={{ base: '26px', md: '36px', lg: '48px' }}
                lineHeight="110%"
                color="#1E1B4B"
                letterSpacing="-0.3px"
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
              {businesses.length}{' '}
              {businesses.length === 1 ? 'business' : 'businesses'} creating
              visible community impact in {label}.
            </Text>
          </Stack>
        </Container>
      </Stack>

      {/* Business grid */}
      <Stack
        as="section"
        aria-label={`Businesses in ${label}`}
        bg="#F8F9FF"
        py={{ base: '44px', md: '56px', lg: '72px' }}
      >
        <Container>
          <Grid
            templateColumns={{
              base: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
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

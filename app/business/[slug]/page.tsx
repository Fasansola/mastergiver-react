/**
 * Public Business Profile page — /business/[slug]
 *
 * Server Component. Looks up the business by slug from the URL.
 *
 * Guard conditions:
 *   - Business not found  → "profile not available" message
 *   - published: false    → "profile not available" message
 *
 * When the profile is public, renders each section in order:
 *   1. ProfileHeader      — cover photo, logo, company name, tagline
 *   2. ProfileAboutUs     — about us text + website link  (hidden if empty)
 *   3. ImpactStats        — years / contributions / partners  (hidden if all null)
 *   4. AreasOfImpact      — cause chips  (hidden if none selected)
 *   5. PartnerCards       — community partners grid  (hidden if none saved)
 *   6. CommunityGallery   — in the community photos  (hidden if none saved)
 *   7. EndorsementList    — endorsement quote blocks  (hidden if none saved)
 *   8. OfferCards         — community offers grid  (hidden if none saved)
 *
 * No sidebar, no auth required — this is a public-facing page.
 * Uses the minimal app/business/layout.tsx (Libre Bodoni font only).
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProfileHeader from '@/components/business/profile/ProfileHeader';
import ImpactStats from '@/components/business/profile/ImpactStats';
import AreasOfImpact from '@/components/business/profile/AreasOfImpact';
import PartnerCards from '@/components/business/profile/PartnerCards';
import CommunityGallery from '@/components/business/profile/CommunityGallery';
import EndorsementList from '@/components/business/profile/EndorsementList';
import OfferCards from '@/components/business/profile/OfferCards';
import ImpactRecordPublic from '@/components/business/profile/ImpactRecordPublic';
import { Box, HStack, Stack, Container, Heading, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { toCitySlug } from '@/lib/directory';
import BusinessHeader from '@/components/business/layout/BusinessHeader';
import Image from 'next/image';

import Certified from '@/public/business-assets/Certified.svg';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const business = await prisma.business.findUnique({
    where: { slug },
    select: {
      companyName: true,
      logo: true,
      status: true,
      published: true,
    },
  });

  if (
    !business ||
    !business.companyName ||
    !business.published ||
    business.status !== 'ACTIVE'
  ) {
    return { title: 'Business Profile Not Found' };
  }

  const name = business.companyName;

  // Task 1 — full title format signals the page type to search engines and AI
  const fullTitle = `${name} | Verified Community Impact Profile | MasterGiver`;

  // Task 2 — structured description replaces tagline; consistent across all profiles
  const description = `View ${name}'s verified community impact profile, including nonprofit partnerships, sponsorships, causes supported, community involvement, and reputation signals on MasterGiver.`;

  const canonicalUrl = `https://www.mastergiver.com/business/${slug}`;

  return {
    // `absolute` bypasses the root layout template ('%s | MasterGiver') so the
    // full string is used as-is rather than being wrapped a second time.
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      images: business.logo ? [{ url: business.logo }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: business.logo ? [business.logo] : [],
    },
  };
}

const BusinessProfilePage = async ({ params }: PageProps) => {
  const { slug } = await params;

  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      causes: { include: { cause: true } },
      partners: { orderBy: { createdAt: 'asc' } },
      communityEvents: { orderBy: { createdAt: 'asc' } },
      endorsements: { orderBy: { createdAt: 'asc' } },
      offers: { orderBy: { createdAt: 'asc' } },
      impactRecords: {
        include: { cause: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  // Not found, unpublished, or subscription not active — return proper 404.
  // Suspended businesses are hidden even via direct URL until subscription is renewed.
  if (!business || !business.published || business.status !== 'ACTIVE') {
    notFound();
  }

  // Serialise Prisma types that cannot cross the Server→RSC boundary as-is
  const totalContributions = business.totalContributions?.toString() ?? null;

  // Serialise offer expiry dates to plain strings
  const offers = business.offers.map((o) => ({
    id: o.id,
    title: o.title,
    description: o.description,
    link: o.link,
    offerCode: o.offerCode,
    expiresAt: o.expiresAt ? o.expiresAt.toISOString().split('T')[0] : null,
  }));

  // Flatten causes to the shape AreasOfImpact expects
  const causes = business.causes.map((bc) => ({
    id: bc.cause.id,
    name: bc.cause.name,
    icon: bc.cause.icon,
    color: bc.cause.color,
  }));

  // Serialise impact records
  const impactRecords = business.impactRecords.map((r) => ({
    id: r.id,
    title: r.title,
    causeName: r.cause?.name ?? null,
    organization: r.organization,
    impactType: r.impactType as 'ONE_TIME' | 'ONGOING',
    startYear: r.startYear,
    endYear: r.endYear,
    isPresent: r.isPresent,
    contributionType: r.contributionType as string | null,
    amount: r.amount?.toString() ?? null,
    details: r.details,
  }));
  const hasImpactRecord = impactRecords.length > 0;

  // Determine which sections have data — sections with no content are not rendered
  const hasImpact =
    business.yearsOfInvolvement !== null ||
    business.totalContributions !== null ||
    business.activePartners !== null;
  const hasCauses = causes.length > 0;
  const hasPartners = business.partners.length > 0;
  const hasEvents = business.communityEvents.length > 0;
  const hasEndorsements = business.endorsements.length > 0;
  const hasOffers = offers.length > 0;

  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.mastergiver.com';
  const profileUrl = `${BASE_URL}/business/${slug}`;

  // Strip angle brackets from user-supplied strings before embedding in JSON-LD
  const sanitize = (str: string | null | undefined) =>
    str?.replace(/[<>]/g, '') ?? undefined;

  // Only allow http/https website URLs in JSON-LD — never javascript: or data:
  const safeWebsite = (() => {
    if (!business.website) return profileUrl;
    try {
      const { protocol } = new URL(business.website);
      return protocol === 'http:' || protocol === 'https:'
        ? business.website
        : profileUrl;
    } catch {
      return profileUrl;
    }
  })();

  // Task 5 — SameAs: always include the MasterGiver profile URL.
  // If the business has a separate website, `url` points there and the profile
  // page becomes the sameAs entry, tying both to the same entity.
  const sameAsUrls: string[] = [profileUrl];

  // Build a shared PostalAddress object (used by both schema types below)
  const hasAddress = !!(business.address || business.city || business.state);
  const postalAddress = hasAddress
    ? {
        '@type': 'PostalAddress',
        ...(business.address && { streetAddress: sanitize(business.address) }),
        ...(business.city && { addressLocality: sanitize(business.city) }),
        ...(business.state && { addressRegion: sanitize(business.state) }),
        ...(business.zipCode && { postalCode: sanitize(business.zipCode) }),
        addressCountry: 'US',
      }
    : undefined;

  // Task 4 — Organization schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: sanitize(business.companyName),
    url: safeWebsite,
    ...(business.logo && { logo: business.logo }),
    ...(business.coverPhoto && { image: business.coverPhoto }),
    ...(business.tagline && { slogan: sanitize(business.tagline) }),
    ...(business.aboutUs && { description: sanitize(business.aboutUs) }),
    ...(postalAddress && { address: postalAddress }),
    sameAs: sameAsUrls,
    ...(causes.length > 0 && {
      knowsAbout: causes.map((c) => c.name),
    }),
  };

  // Task 6 — LocalBusiness schema (only when location data exists)
  const hasLocation = !!(business.city || business.state);
  const localBusinessLd = hasLocation
    ? {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: sanitize(business.companyName),
        url: safeWebsite,
        ...(business.logo && { logo: business.logo }),
        address: postalAddress,
      }
    : null;

  // Footer directory link — only shown when ≥10 other published businesses
  // share the same city/state (so the directory page feels useful, not empty)
  const sameCityCount =
    business.city && business.state
      ? await prisma.business.count({
          where: {
            city: business.city,
            state: business.state,
            published: true,
            status: 'ACTIVE',
            id: { not: business.id },
          },
        })
      : 0;

  return (
    <Stack as="main" bgColor="#FFFCF7" gap="0">
      {/* Task 4 — Organization schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Task 6 — LocalBusiness schema (rendered only when location data exists) */}
      {localBusinessLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
        />
      )}
      <BusinessHeader hideAuthButtons />
      {/* White profile card centred on the page */}
      <Stack gap="0">
        {business.coverPhoto && (
          <Box
            bgImage={`url(${business.coverPhoto})`}
            bgSize="cover"
            bgPos={{ base: 'center center', md: '50% -80px' }}
            bgRepeat="no-repeat"
            minH={{ base: '340px', md: '400px' }}
          />
        )}
        <Container>
          <Stack
            direction={{ base: 'column', lg: 'row' }}
            align="start"
            gap={{ base: '6', lg: '12' }}
            px={{ base: '0', md: '4', lg: '12' }}
            pt={{ base: business.coverPhoto ? '0' : '8', lg: '0' }}
            pb={{ base: '10', lg: '20' }}
          >
            {/* Header — logo + name + about + tagline */}
            <ProfileHeader
              companyName={business.companyName ?? ''}
              companyAddress={business.address}
              city={business.city}
              state={business.state}
              zipCode={business.zipCode}
              aboutUs={business.aboutUs ?? ''}
              website={business.website ?? ''}
              tagline={business.tagline}
              logo={business.logo}
              hasCoverPhoto={!!business.coverPhoto}
            />

            {/* Content sections */}
            <Stack
              // mt={{ base: '0', lg: '10' }}
              gap={{ base: '6', lg: '12' }}
              w="100%"
            >
              <Stack
                mt={{ base: '0', lg: '10' }}
                gap={{ base: '6', lg: '12' }}
                justify="center"
                align="center"
                w="100%"
              >
                {/* Verified Community Impact — hidden on mobile (doesn't adapt well) */}
                <HStack
                  bgColor="background.white"
                  p={{ base: '4', md: '6' }}
                  w="100%"
                  maxW="580px"
                  align="start"
                  border="solid 0.5px #DCDFE3"
                  gap="4"
                  borderRadius="20px"
                  boxShadow="0px 1px 2px 0px #4646490F, 0px 1px 3px 0px #4646490A"
                  display={{ base: 'none', md: 'flex' }}
                >
                  <Image
                    src={Certified}
                    alt="Certified"
                    width="56"
                    height="56"
                  />
                  <Stack gap="2" align="start">
                    <Heading
                      fontSize="subheading"
                      className="font-body"
                      fontWeight="700"
                      color="text.businessH"
                      textTransform="uppercase"
                    >
                      Verified Community Impact
                    </Heading>
                    <Text
                      color="text.primary"
                      borderRadius="4px"
                      fontSize="14px"
                      fontWeight="500"
                    >
                      A transparent view into how our business shows up for the
                      community it serves through real partnerships and action.
                    </Text>
                  </Stack>
                </HStack>

                {hasImpact && (
                  <Stack
                    w="100%"
                    bgColor="background.white"
                    p={{ base: '5', md: '7', lg: '10' }}
                    align="center"
                    border="solid 0.5px #DCDFE3"
                    gap={{ base: '8', lg: '14' }}
                    borderRadius="20px"
                    boxShadow="0px 1px 2px 0px #4646490F, 0px 1px 3px 0px #4646490A"
                  >
                    <Stack gap="2" align="center">
                      <Heading
                        className="font-display"
                        fontWeight="700"
                        fontSize={{ base: '24px', md: '32px', lg: '40px' }}
                        color="text.businessH"
                        textAlign="center"
                        lineHeight="120%"
                      >
                        Impact Summary
                      </Heading>
                      <Text
                        className="font-body"
                        fontSize="small"
                        color="text.secondary"
                        textAlign="center"
                      >
                        Updated regularly to reflect{' '}
                        <Box
                          as="span"
                          display={{ base: 'block', md: 'inline' }}
                        >
                          ongoing community impact.
                        </Box>
                      </Text>
                    </Stack>
                    <ImpactStats
                      yearsOfInvolvement={business.yearsOfInvolvement}
                      totalContributions={totalContributions}
                      activePartners={business.activePartners}
                    />
                  </Stack>
                )}

                {hasImpactRecord && (
                  <Stack
                    w="100%"
                    bgColor="background.white"
                    p={{ base: '5', md: '7', lg: '10' }}
                    align="center"
                    border="solid 0.5px #DCDFE3"
                    gap={{ base: '8', lg: '14' }}
                    borderRadius="20px"
                    boxShadow="0px 1px 2px 0px #4646490F, 0px 1px 3px 0px #4646490A"
                  >
                    <Stack gap="4">
                      <Heading
                        className="font-display"
                        fontWeight="700"
                        fontSize={{ base: '24px', md: '32px', lg: '40px' }}
                        color="text.businessH"
                        textAlign="center"
                        lineHeight="120%"
                      >
                        Impact Record
                      </Heading>
                      <Text
                        className="font-body"
                        fontSize="body"
                        color="text.secondary"
                        textAlign="center"
                      >
                        A continuously updated record of our community impact.
                      </Text>
                    </Stack>
                    <ImpactRecordPublic records={impactRecords} />
                  </Stack>
                )}
              </Stack>

              {hasPartners && (
                <Stack
                  w="100%"
                  bgColor="background.white"
                  p={{ base: '5', md: '7', lg: '10' }}
                  align="center"
                  border="solid 0.5px #DCDFE3"
                  gap={{ base: '8', lg: '14' }}
                  borderRadius="20px"
                  boxShadow="0px 1px 2px 0px #4646490F, 0px 1px 3px 0px #4646490A"
                >
                  <Heading
                    className="font-display"
                    fontWeight="700"
                    fontSize={{ base: '24px', md: '32px', lg: '40px' }}
                    color="text.businessH"
                    textAlign="center"
                    lineHeight="120%"
                    wordSpacing="0.05em"
                  >
                    Community Partners and Programs
                  </Heading>
                  <PartnerCards partners={business.partners} />
                </Stack>
              )}

              {hasCauses && (
                <Stack
                  w="100%"
                  bgColor="background.white"
                  p={{ base: '5', md: '7', lg: '10' }}
                  align="center"
                  border="solid 0.5px #DCDFE3"
                  gap={{ base: '8', lg: '14' }}
                  borderRadius="20px"
                  boxShadow="0px 1px 2px 0px #4646490F, 0px 1px 3px 0px #4646490A"
                >
                  <Heading
                    className="font-display"
                    fontWeight="700"
                    fontSize={{ base: '24px', md: '32px', lg: '40px' }}
                    color="text.businessH"
                    textAlign="center"
                    lineHeight="120%"
                  >
                    Areas of Impact
                  </Heading>{' '}
                  <AreasOfImpact causes={causes} />
                </Stack>
              )}

              {hasEvents && (
                <Stack
                  w="100%"
                  bgColor="background.white"
                  p={{ base: '5', md: '7', lg: '10' }}
                  align="center"
                  border="solid 0.5px #DCDFE3"
                  gap={{ base: '8', lg: '14' }}
                  borderRadius="20px"
                  boxShadow="0px 1px 2px 0px #4646490F, 0px 1px 3px 0px #4646490A"
                >
                  <Heading
                    className="font-display"
                    fontWeight="700"
                    fontSize={{ base: '24px', md: '32px', lg: '40px' }}
                    color="text.businessH"
                    textAlign="center"
                    lineHeight="120%"
                  >
                    In the Community
                  </Heading>
                  <CommunityGallery events={business.communityEvents} />
                </Stack>
              )}

              {hasEndorsements && (
                <Stack
                  w="100%"
                  bgColor="background.white"
                  p={{ base: '5', md: '7', lg: '10' }}
                  align="center"
                  border="solid 0.5px #DCDFE3"
                  gap={{ base: '8', lg: '14' }}
                  borderRadius="20px"
                  boxShadow="0px 1px 2px 0px #4646490F, 0px 1px 3px 0px #4646490A"
                >
                  <Heading
                    className="font-display"
                    fontWeight="700"
                    fontSize={{ base: '24px', md: '32px', lg: '40px' }}
                    color="text.businessH"
                    textAlign="center"
                    lineHeight="120%"
                  >
                    Community Endorsements
                  </Heading>
                  <EndorsementList endorsements={business.endorsements} />
                </Stack>
              )}

              {hasOffers && (
                <Stack
                  w="100%"
                  bgColor="background.white"
                  p={{ base: '5', md: '7', lg: '10' }}
                  align="center"
                  border="solid 0.5px #DCDFE3"
                  gap={{ base: '8', lg: '14' }}
                  borderRadius="20px"
                  boxShadow="0px 1px 2px 0px #4646490F, 0px 1px 3px 0px #4646490A"
                >
                  <Heading
                    className="font-display"
                    fontWeight="700"
                    fontSize={{ base: '24px', md: '32px', lg: '40px' }}
                    color="text.businessH"
                    textAlign="center"
                    lineHeight="120%"
                  >
                    Community Offers
                  </Heading>
                  <OfferCards offers={offers} />
                </Stack>
              )}

              {/* City backlink — only shown when ≥10 other published businesses
                  exist in the same city so the destination page feels useful */}
              {sameCityCount >= 10 && business.city && business.state && (
                <Box w="100%" pt="4" pb="2">
                  <Link
                    href={`/good-businesses/${toCitySlug(business.city, business.state)}`}
                  >
                    <Text
                      as="span"
                      fontSize="14px"
                      color="#2F2B77"
                      fontWeight="600"
                      className="font-body"
                      _hover={{ textDecoration: 'underline' }}
                    >
                      ← Explore more businesses making a positive impact in{' '}
                      {business.city}, {business.state}
                    </Text>
                  </Link>
                </Box>
              )}
            </Stack>
          </Stack>
        </Container>
      </Stack>
    </Stack>
  );
};

export default BusinessProfilePage;

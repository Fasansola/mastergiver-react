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

import { prisma } from '@/lib/prisma';
import ProfileHeader from '@/components/business/profile/ProfileHeader';
import ImpactStats from '@/components/business/profile/ImpactStats';
import AreasOfImpact from '@/components/business/profile/AreasOfImpact';
import PartnerCards from '@/components/business/profile/PartnerCards';
import CommunityGallery from '@/components/business/profile/CommunityGallery';
import EndorsementList from '@/components/business/profile/EndorsementList';
import OfferCards from '@/components/business/profile/OfferCards';
import { Box, HStack, Stack, Container, Heading, Text } from '@chakra-ui/react';
import BusinessHeader from '@/components/business/layout/BusinessHeader';
import Image from 'next/image';

import Certified from '@/public/business-assets/Certified.svg';

interface PageProps {
  params: Promise<{ slug: string }>;
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
    },
  });

  // Not found or unpublished — render a clean "not available" message
  if (!business || !business.published) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#F9FAFB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{ textAlign: 'center', maxWidth: '400px', padding: '40px' }}
        >
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</p>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#27262D',
              marginBottom: '12px',
            }}
          >
            Profile not available
          </h1>
          <p style={{ fontSize: '15px', color: '#575C62', lineHeight: '150%' }}>
            This business profile is either not published yet or does not exist.
          </p>
        </div>
      </div>
    );
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

  return (
    <Stack as="main" bgColor="#FFFCF7" gap="0">
      <BusinessHeader />
      {/* White profile card centred on the page */}
      <Stack gap="0">
        <Box
          bgImage={
            business.coverPhoto ? `url(${business.coverPhoto})` : undefined
          }
          bgSize="cover"
          bgPos={{ base: 'center center', md: '50% -80px' }}
          bgRepeat="no-repeat"
          minH={{ base: '340px', md: '400px' }}
        />
        <Container>
          <Stack
            direction={{ base: 'column', lg: 'row' }}
            align="start"
            gap={{ base: '6', lg: '12' }}
            px={{ base: '0', md: '4', lg: '12' }}
            pb={{ base: '10', lg: '20' }}
          >
            {/* Header — logo + name + about + tagline */}
            <ProfileHeader
              companyName={business.companyName ?? ''}
              companyAddress={business.address ?? ''}
              aboutUs={business.aboutUs ?? ''}
              website={business.website ?? ''}
              tagline={business.tagline}
              logo={business.logo}
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
                {/* Verified Community Impact */}
                <HStack
                  bgColor="white"
                  p={{ base: '4', md: '6' }}
                  w="100%"
                  maxW="580px"
                  align="start"
                  border="solid 0.5px #DCDFE3"
                  gap="4"
                  borderRadius="20px"
                  boxShadow="0px 1px 2px 0px #4646490F, 0px 1px 3px 0px #4646490A"
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
                    bgColor="white"
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
                      Impact Summary
                    </Heading>
                    <ImpactStats
                      yearsOfInvolvement={business.yearsOfInvolvement}
                      totalContributions={totalContributions}
                      activePartners={business.activePartners}
                    />
                  </Stack>
                )}
              </Stack>

              {hasPartners && (
                <Stack
                  w="100%"
                  bgColor="white"
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
                    Community Partners and Programs
                  </Heading>
                  <PartnerCards partners={business.partners} />
                </Stack>
              )}

              {hasCauses && (
                <Stack
                  w="100%"
                  bgColor="white"
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
                  bgColor="white"
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
                  bgColor="white"
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
                  bgColor="white"
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
            </Stack>
          </Stack>
        </Container>
      </Stack>
    </Stack>
  );
};

export default BusinessProfilePage;

'use client';

/**
 * Edit Profile page — interactive coordinator.
 *
 * Holds the accordion open/close state (only one section open at a time)
 * and renders all 7 sections plus the Preview and Publish buttons.
 *
 * All data is received as props from the Server Component page — this
 * component contains no database calls.
 */

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import SectionAccordion from './SectionAccordion';
import AboutUsSection from './AboutUsSection';
import ImpactSummarySection from './ImpactSummarySection';
import PartnersSection from './PartnersSection';
import AreasOfImpactSection from './AreasOfImpactSection';
import CommunityEventsSection from './CommunityEventsSection';
import EndorsementsSection from './EndorsementsSection';
import OffersSection from './OffersSection';
import ImpactRecordSection from './ImpactRecordSection';
import { publishBusinessAction } from '@/lib/actions/business-profile.actions';
import { primaryButtonStyle } from '@/components/business/shared/styles';
import type {
  AboutUsInput,
  ImpactSummaryInput,
} from '@/lib/validations/business-profile.schema';
import { Container, Heading, Stack, Text } from '@chakra-ui/react';
import BusinessProgressBar from '@/components/business/layout/BusinessProgressBar';

// ---------------------------------------------------------------------------
// Prop types (plain serialisable data from the Server Component)
// ---------------------------------------------------------------------------

interface Cause {
  id: string;
  name: string;
  color: string;
}

interface BusinessData {
  id: string;
  slug: string;
  published: boolean;
  // Section 1
  logo: string | null;
  coverPhoto: string | null;
  companyName: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  aboutUs: string | null;
  tagline: string | null;
  website: string | null;
  // Section 2
  yearsOfInvolvement: number | null;
  totalContributions: string | null; // Decimal serialised as string
  activePartners: number | null;
  // Relations
  selectedCauseIds: string[];
  partners: {
    id: string;
    image: string | null;
    name: string;
    description: string;
  }[];
  communityEvents: {
    id: string;
    photo: string | null;
    description: string;
    externalUrl: string | null;
  }[];
  endorsements: {
    id: string;
    endorsingOrg: string;
    endorserName: string | null;
    endorsementStatement: string;
  }[];
  offers: {
    id: string;
    title: string;
    description: string;
    link: string | null;
    offerCode: string | null;
    expiresAt: string | null;
  }[];
  impactRecords: {
    id: string;
    title: string;
    causeId: string | null;
    causeName: string | null;
    organization: string | null;
    impactType: 'ONE_TIME' | 'ONGOING';
    startYear: number;
    endYear: number | null;
    isPresent: boolean;
    contributionType: string | null;
    amount: string | null;
    details: string | null;
  }[];
}

interface EditProfileClientProps {
  business: BusinessData;
  allCauses: Cause[];
  sectionCompletion: boolean[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const EditProfileClient = ({
  business,
  allCauses,
  sectionCompletion,
}: EditProfileClientProps) => {
  const router = useRouter();
  // Which section accordion is currently open (1-based index, null = all closed)
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const open = (n: number) => setOpenSection(n);
  const close = () => setOpenSection(null);

  const publishMutation = useMutation({
    mutationFn: publishBusinessAction,
    onSuccess: (result) => {
      if (!result.success) {
        setPublishError(result.error);
        return;
      }
      setPublishedSuccess(true);
      router.refresh();
    },
  });

  // Default values for Section 1
  const aboutUsDefaults: AboutUsInput = {
    logo: business.logo,
    coverPhoto: business.coverPhoto,
    companyName: business.companyName ?? '',
    address: business.address,
    city: business.city,
    state: business.state,
    zipCode: business.zipCode,
    aboutUs: business.aboutUs,
    tagline: business.tagline,
    website: business.website,
  };

  // Default values for Section 2
  const impactDefaults: ImpactSummaryInput = {
    yearsOfInvolvement: business.yearsOfInvolvement,
    totalContributions: business.totalContributions
      ? Number(business.totalContributions)
      : null,
    activePartners: business.activePartners,
  };

  const sections = [
    { title: 'About Us' },
    { title: 'Impact Summary' },
    { title: 'Our Community Partners & Programs' },
    { title: 'Areas of Impact' },
    { title: 'In the Community' },
    { title: 'Community Endorsements' },
    { title: 'Community Offers' },
    { title: 'Impact Record' },
  ];

  return (
    <Container p="0">
      <Stack gap={{ base: '6', lg: '10' }}>
        {/* Page heading */}
        <Stack gap="5">
          <Heading
            className="font-display"
            fontWeight="700"
            fontSize="bigheading"
            lineHeight="120%"
            color="text.primary"
          >
            Reputation Profile Builder
          </Heading>
          <Text color="text.secondary">
            Click the + icon to add content to each section of your MasterGiver
            Profile.
          </Text>
        </Stack>

        <BusinessProgressBar
          percent={Math.round(
            (sectionCompletion.filter(Boolean).length / 8) * 100
          )}
        />

        {/* Accordion list */}
        <Stack gap={{ base: '4' }}>
          <SectionAccordion
            number={1}
            title={sections[0].title}
            isComplete={sectionCompletion[0]}
            isOpen={openSection === 1}
            onOpen={() => open(1)}
            onClose={close}
          >
            <AboutUsSection onSave={close} defaultValues={aboutUsDefaults} />
          </SectionAccordion>

          <SectionAccordion
            number={2}
            title={sections[1].title}
            isComplete={sectionCompletion[1]}
            isOpen={openSection === 2}
            onOpen={() => open(2)}
            onClose={close}
          >
            <ImpactSummarySection
              onSave={close}
              defaultValues={impactDefaults}
            />
          </SectionAccordion>

          <SectionAccordion
            number={3}
            title={sections[2].title}
            isComplete={sectionCompletion[2]}
            isOpen={openSection === 3}
            onOpen={() => open(3)}
            onClose={close}
          >
            <PartnersSection
              onSave={close}
              initialPartners={business.partners}
            />
          </SectionAccordion>

          <SectionAccordion
            number={4}
            title={sections[3].title}
            isComplete={sectionCompletion[3]}
            isOpen={openSection === 4}
            onOpen={() => open(4)}
            onClose={close}
          >
            <AreasOfImpactSection
              onSave={close}
              allCauses={allCauses}
              selectedCauseIds={business.selectedCauseIds}
            />
          </SectionAccordion>

          <SectionAccordion
            number={5}
            title={sections[4].title}
            isComplete={sectionCompletion[4]}
            isOpen={openSection === 5}
            onOpen={() => open(5)}
            onClose={close}
          >
            <CommunityEventsSection
              onSave={close}
              initialEvents={business.communityEvents}
            />
          </SectionAccordion>

          <SectionAccordion
            number={6}
            title={sections[5].title}
            isComplete={sectionCompletion[5]}
            isOpen={openSection === 6}
            onOpen={() => open(6)}
            onClose={close}
          >
            <EndorsementsSection
              onSave={close}
              initialEndorsements={business.endorsements}
            />
          </SectionAccordion>

          <SectionAccordion
            number={7}
            title={sections[6].title}
            isComplete={sectionCompletion[6]}
            isOpen={openSection === 7}
            onOpen={() => open(7)}
            onClose={close}
          >
            <OffersSection onSave={close} initialOffers={business.offers} />
          </SectionAccordion>

          <SectionAccordion
            number={8}
            title={sections[7].title}
            isComplete={sectionCompletion[7]}
            isOpen={openSection === 8}
            onOpen={() => open(8)}
            onClose={close}
          >
            <ImpactRecordSection
              allCauses={allCauses}
              initialRecords={business.impactRecords}
            />
          </SectionAccordion>
        </Stack>

        {/* Bottom actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {/* Preview Profile */}
          <a
            href={`/business/${business.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              borderRadius: '8px',
              border: '2px solid #2F2B77',
              color: '#2F2B77',
              fontWeight: 700,
              fontSize: '16px',
              textDecoration: 'none',
              background: '#FFFFFF',
            }}
          >
            Preview Profile ↗
          </a>

          {/* Publish Profile */}
          {!business.published && !publishedSuccess && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {(() => {
                const canPublish = sectionCompletion[0] && sectionCompletion[1];
                const nudge = !sectionCompletion[0]
                  ? 'Complete Section 1 (About Us) to publish your profile.'
                  : !sectionCompletion[1]
                    ? 'Complete Section 2 (Impact Summary) to publish your profile.'
                    : null;
                return (
                  <>
                    <button
                      type="button"
                      onClick={() => publishMutation.mutate()}
                      disabled={publishMutation.isPending || !canPublish}
                      title={nudge ?? undefined}
                      style={{
                        ...primaryButtonStyle(
                          publishMutation.isPending || !canPublish
                        ),
                        width: 'auto',
                        fontSize: '16px',
                        height: '52px',
                      }}
                    >
                      {publishMutation.isPending
                        ? 'Publishing…'
                        : 'Publish Profile'}
                    </button>
                    {nudge && (
                      <span style={{ fontSize: '13px', color: '#C05621' }}>
                        {nudge}
                      </span>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* Success state */}
          {(business.published || publishedSuccess) && (
            <span
              style={{ color: '#38A169', fontWeight: 700, fontSize: '15px' }}
            >
              ✓ Profile published
            </span>
          )}

          {publishError && (
            <span style={{ color: '#C53030', fontSize: '14px' }}>
              {publishError}
            </span>
          )}
        </div>
      </Stack>
    </Container>
  );
};

export default EditProfileClient;

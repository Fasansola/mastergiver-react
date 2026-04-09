/**
 * Home page — root landing page for unauthenticated visitors.
 *
 * This page is outside the (public) route group so it manages its own
 * header (BusinessHeader with gradient bg) and footer. Each visual section
 * lives in its own component under components/landing/home/.
 */
import type { Metadata } from 'next';
import { Stack } from '@chakra-ui/react';
import BusinessHeader from '@/components/business/layout/BusinessHeader';

export const metadata: Metadata = {
  title: 'Get Discovered for the Good Your Business Does',
  description:
    'MasterGiver turns your charitable giving and community involvement into verified reputation signals so AI recommends you, search engines rank you higher, and customers choose you.',
  openGraph: {
    title: 'Get Discovered for the Good Your Business Does | MasterGiver',
    description:
      'Turn your community impact into verified reputation signals that AI and search engines trust.',
    url: 'https://mastergiver.com',
  },
};
import Footer from '@/components/layout/Footer';
import HomeHeroSection from '@/components/landing/home/HomeHeroSection';
import GoodNotVisibleSection from '@/components/landing/home/GoodNotVisibleSection';
import ReputationRulesSection from '@/components/landing/home/ReputationRulesSection';
import CommunityImpactSection from '@/components/landing/home/CommunityImpactSection';
import WhatYouGetSection from '@/components/landing/home/WhatYouGetSection';
import WhoItsForSection from '@/components/landing/home/WhoItsForSection';
import ReturnOnReputationSection from '@/components/landing/home/ReturnOnReputationSection';
import CompetitiveAdvantageSection from '@/components/landing/home/CompetitiveAdvantageSection';
import HomeFAQSection from '@/components/landing/home/HomeFAQSection';
import HomeCtaSection from '@/components/landing/home/HomeCtaSection';

export default function Home() {
  return (
    <Stack gap="0" bgColor="white" overflowX="hidden" className="font-body">
      <BusinessHeader bgColor="linear-gradient(107.69deg, #F3F6FF 0%, #F1F5FF 100%)" />
      <HomeHeroSection />
      <GoodNotVisibleSection />
      <ReputationRulesSection />
      <CommunityImpactSection />
      <WhatYouGetSection />
      <WhoItsForSection />
      <ReturnOnReputationSection />
      <CompetitiveAdvantageSection />
      <HomeFAQSection />
      <HomeCtaSection />
      <Footer />
    </Stack>
  );
}

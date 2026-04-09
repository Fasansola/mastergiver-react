/**
 * Reputation page — /reputation
 *
 * Educates visitors on why community impact matters for modern business
 * reputation, how it fits into their marketing stack, and what a structured
 * MasterGiver profile looks like. Shared header/footer provided by
 * app/(public)/layout.tsx.
 */
import type { Metadata } from 'next';
import ReputationHeroSection from '@/components/landing/reputation/ReputationHeroSection';

export const metadata: Metadata = {
  title: 'Community Impact & Business Reputation | MasterGiver',
  description: 'Learn how verified community impact builds lasting business reputation — trusted by AI, search engines, and customers.',
  openGraph: {
    title: 'Community Impact & Business Reputation | MasterGiver',
    description: 'Learn how verified community impact builds lasting business reputation — trusted by AI, search engines, and customers.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Community Impact & Business Reputation | MasterGiver',
    description: 'Learn how verified community impact builds lasting business reputation — trusted by AI, search engines, and customers.',
  },
};
import CommunityFitsSection from '@/components/landing/reputation/CommunityFitsSection';
import WhyRarelySection from '@/components/landing/reputation/WhyRarelySection';
import WhyImportantSection from '@/components/landing/reputation/WhyImportantSection';
import CommunityRepSection from '@/components/landing/reputation/CommunityRepSection';
import MasterGiverProfileSection from '@/components/landing/reputation/MasterGiverProfileSection';
import RightFitSection from '@/components/landing/reputation/RightFitSection';
import FAQSection from '../shared/FAQSection';
import ReputationCtaSection from '@/components/landing/reputation/ReputationCtaSection';

const ReputationPage = () => {
  return (
    <>
      <ReputationHeroSection />
      <CommunityFitsSection />
      <WhyRarelySection />
      <WhyImportantSection />
      <CommunityRepSection />
      <MasterGiverProfileSection />
      <RightFitSection />
      <FAQSection />
      <ReputationCtaSection />
    </>
  );
};

export default ReputationPage;

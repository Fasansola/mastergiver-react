/**
 * Partner page — /partner
 *
 * Recruits nonprofit organizations, chambers, and associations to become
 * MasterGiver Community Partners. Explains the program, org fit, and three-step
 * onboarding process. Includes a signup form CTA. Shared header/footer
 * provided by app/(public)/layout.tsx.
 */
import type { Metadata } from 'next';
import PartnerHeroSection from '@/components/landing/partner/PartnerHeroSection';

export const metadata: Metadata = {
  title: 'Become a Community Partner | MasterGiver',
  description: 'Partner with MasterGiver to connect nonprofits, chambers, and associations with businesses committed to verified community impact.',
  openGraph: {
    title: 'Become a Community Partner | MasterGiver',
    description: 'Partner with MasterGiver to connect nonprofits, chambers, and associations with businesses committed to verified community impact.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Become a Community Partner | MasterGiver',
    description: 'Partner with MasterGiver to connect nonprofits, chambers, and associations with businesses committed to verified community impact.',
  },
};
import TurnGivingSection from '@/components/landing/partner/TurnGivingSection';
import BenefitWorthSection from '@/components/landing/partner/BenefitWorthSection';
import OrgsSection from '@/components/landing/partner/OrgsSection';
import ThreeStepsSection from '@/components/landing/partner/ThreeStepsSection';
import FAQSection from '../shared/FAQSection';
import PartnerCtaSection from '@/components/landing/partner/PartnerCtaSection';

const PartnerPage = () => {
  return (
    <>
      <PartnerHeroSection />
      <TurnGivingSection />
      <BenefitWorthSection />
      <OrgsSection />
      <ThreeStepsSection />
      <FAQSection />
      <PartnerCtaSection />
    </>
  );
};

export default PartnerPage;

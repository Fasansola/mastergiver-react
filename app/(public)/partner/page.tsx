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
  description:
    'Partner with MasterGiver to connect nonprofits, chambers, and associations with businesses committed to verified community impact.',
  alternates: { canonical: 'https://www.mastergiver.com/partner' },
  openGraph: {
    title: 'Become a Community Partner | MasterGiver',
    description:
      'Partner with MasterGiver to connect nonprofits, chambers, and associations with businesses committed to verified community impact.',
    url: 'https://www.mastergiver.com/partner',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Become a Community Partner | MasterGiver',
    description:
      'Partner with MasterGiver to connect nonprofits, chambers, and associations with businesses committed to verified community impact.',
  },
};
import TurnGivingSection from '@/components/landing/partner/TurnGivingSection';
// import BenefitWorthSection from '@/components/landing/partner/BenefitWorthSection';
// import OrgsSection from '@/components/landing/partner/OrgsSection';
import ThreeStepsSection from '@/components/landing/partner/ThreeStepsSection';
import FAQSection from '../shared/FAQSection';
import PartnerCtaSection from '@/components/landing/partner/PartnerCtaSection';

const PARTNER_FAQS = [
  {
    title: 'Is our organization endorsing MasterGiver?',
    description:
      "No. You're simply making your sponsors aware of a free resource that helps them document and showcase the community impact they've already created. Whether they choose to create a profile is entirely up to them.",
  },
  {
    title: 'What do we need to do as a partner?',
    description:
      "Very little. We'll provide ready-to-share emails, newsletter copy, social media graphics, and other resources that you can use to introduce MasterGiver to your sponsors whenever it makes sense for your organization.",
  },
  {
    title: 'How does our organization benefit?',
    description:
      'Helping your sponsors receive lasting recognition strengthens the value they receive from supporting your organization. It also gives prospective sponsors another reason to invest, knowing their community involvement can become part of their long-term online reputation.',
  },
  {
    title: 'Does this cost our organization anything?',
    description:
      'No. There is no cost to your organization to share MasterGiver with your sponsors or receive sponsor communication resources.',
  },
  {
    title: 'Do we need to integrate anything or manage accounts?',
    description:
      "No. There's nothing to install, integrate, or manage. Simply share the resources with your sponsors whenever you choose.",
  },
  {
    title: 'What do sponsors receive?',
    description:
      'Sponsors can create a Verified Community Impact Profile where they document sponsorships, nonprofit partnerships, volunteer initiatives, donations, and other community involvement. Each published profile also includes a Verified Community Impact Badge that can be displayed on their website and marketing materials.',
  },
];

const PartnerPage = () => {
  return (
    <>
      <PartnerHeroSection />
      <TurnGivingSection />
      {/* <BenefitWorthSection /> */}
      {/* <OrgsSection /> */}
      <ThreeStepsSection />
      <FAQSection faqs={PARTNER_FAQS} />
      <PartnerCtaSection />
    </>
  );
};

export default PartnerPage;

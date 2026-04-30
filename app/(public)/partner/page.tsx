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
  alternates: { canonical: 'https://mastergiver.com/partner' },
  openGraph: {
    title: 'Become a Community Partner | MasterGiver',
    description:
      'Partner with MasterGiver to connect nonprofits, chambers, and associations with businesses committed to verified community impact.',
    url: 'https://mastergiver.com/partner',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Become a Community Partner | MasterGiver',
    description:
      'Partner with MasterGiver to connect nonprofits, chambers, and associations with businesses committed to verified community impact.',
  },
};
import TurnGivingSection from '@/components/landing/partner/TurnGivingSection';
import BenefitWorthSection from '@/components/landing/partner/BenefitWorthSection';
import OrgsSection from '@/components/landing/partner/OrgsSection';
import ThreeStepsSection from '@/components/landing/partner/ThreeStepsSection';
import FAQSection from '../shared/FAQSection';
import PartnerCtaSection from '@/components/landing/partner/PartnerCtaSection';

const PARTNER_FAQS = [
  {
    title: 'Is our organization endorsing MasterGiver?',
    description:
      "No. Your organization is simply providing access to a tool that helps businesses better communicate and showcase their community impact. MasterGiver is designed to support businesses that already give back — not change what they do, but help ensure it's seen, understood, and recognized.",
  },
  {
    title: 'What do we need to do as a partner?',
    description:
      "Very little. Once you sign up, you'll receive a custom $20 discount code and ready-to-send email copy. You can share it with your members, sponsors, or network via email and optionally resend or include in future communications. No ongoing management required.",
  },
  {
    title: 'How does our organization benefit?',
    description:
      "You're helping the businesses in your network get more visibility for the good they already do, strengthen their reputation with customers, and stand out in search and AI-driven recommendations. It's a simple way to provide added value without creating new programs or initiatives.",
  },
  {
    title: 'Does this cost our organization anything?',
    description: 'No. The partner program is completely free.',
  },
  {
    title: 'Do we need to integrate anything or manage accounts?',
    description:
      "No integration required. There's no software setup, no platform to manage, and no ongoing oversight. You simply share your code and let businesses decide if they want to participate.",
  },
  {
    title: 'What do businesses receive?',
    description:
      'Businesses who sign up receive a MasterGiver Reputation Profile, a structured way to document their community impact, a Verified Impact Badge, and increased visibility across search and AI tools.',
  },
];

const PartnerPage = () => {
  return (
    <>
      <PartnerHeroSection />
      <TurnGivingSection />
      <BenefitWorthSection />
      <OrgsSection />
      <ThreeStepsSection />
      <FAQSection faqs={PARTNER_FAQS} />
      <PartnerCtaSection />
    </>
  );
};

export default PartnerPage;

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
  description:
    'Learn how verified community impact builds lasting business reputation — trusted by AI, search engines, and customers.',
  openGraph: {
    title: 'Community Impact & Business Reputation | MasterGiver',
    description:
      'Learn how verified community impact builds lasting business reputation — trusted by AI, search engines, and customers.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Community Impact & Business Reputation | MasterGiver',
    description:
      'Learn how verified community impact builds lasting business reputation — trusted by AI, search engines, and customers.',
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

const FAQS = [
  {
    title: 'Do we need to already be giving back to join?',
    description:
      "No. Many businesses begin their profile as they're starting to formalize their community involvement. Your profile can reflect where you are now and grow as your involvement does. But just having a profile on MasterGiver will begin to build up your credibility within AI recommendation engines.",
  },
  {
    title: 'How is this different from customer reviews?',
    description:
      "Reviews show how customers experience yourbusiness. A MasterGiver Reputation Profile shows how your business shows up for the community: sponsorships, partnerships, volunteering, and local initiatives that reviews don't capture. Together they create a more complete reputation picture.",
  },
  {
    title:
      'Why does "structured" reputation matter? Can\'t people just Google us?',
    description:
      'They can, but what they find is fragments. Structured reputation means your community involvement lives in one organized, public place that is readable by customers, search engines, and AI tools in a way that scattered posts and mentions are not.',
  },
  {
    title:
      "How much community involvement do we need before it's worth documenting?",
    description:
      'Less than most businesses assume. A single recurring sponsorship, one nonprofit partnership, or a service you regularly offer to a community organization is enough to begin building a meaningful record. The structure matters more than the scale.',
  },
  {
    title: 'What do businesses receive when they create a profile?',
    description:
      'A public Reputation Profile™ , a Verified Impact Badge for use on your website and marketing materials, and a structured record of community involvement that can be shared with customers and partners and grows with your business over time.',
  },
];

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
      <FAQSection faqs={FAQS} />
      <ReputationCtaSection />
    </>
  );
};

export default ReputationPage;

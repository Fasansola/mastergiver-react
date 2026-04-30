/**
 * /individual — landing page for individual users.
 *
 * Converts the Django index.html template into React/Chakra.
 * Sections: Hero → Why Become a MasterGiver (features) → CTA.
 */
import type { Metadata } from 'next';
import { Stack } from '@chakra-ui/react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import IndividualHeroSection from '@/components/landing/individual/IndividualHeroSection';
import IndividualFeaturedSection from '@/components/landing/individual/IndividualFeaturedSection';
import IndividualCtaSection from '@/components/landing/individual/IndividualCtaSection';

export const metadata: Metadata = {
  title: 'Show Off Your Good Side | MasterGiver',
  description:
    'Build your MasterGiver profile to track your charitable efforts, share your impact, and let the world see your commitment to doing good.',
  alternates: { canonical: 'https://mastergiver.com/individual' },
  openGraph: {
    title: 'Show Off Your Good Side | MasterGiver',
    description:
      'Build your MasterGiver profile to track your charitable efforts, share your impact, and let the world see your commitment to doing good.',
    url: 'https://mastergiver.com/individual',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Show Off Your Good Side | MasterGiver',
    description:
      'Build your MasterGiver profile to track your charitable efforts, share your impact, and let the world see your commitment to doing good.',
  },
};

export default function IndividualPage() {
  return (
    <Stack gap="0" bgColor="white" overflowX="hidden" className="font-poppins">
      <Header />
      <IndividualHeroSection />
      <IndividualFeaturedSection />
      <IndividualCtaSection />
      <Footer />
    </Stack>
  );
}

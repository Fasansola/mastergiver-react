/**
 * HomeFAQSection — FAQ section specific to the home/landing page.
 *
 * Contains home-specific questions about profile setup, cost, and use cases.
 * For partner and reputation pages, use app/(public)/shared/FAQSection instead.
 */
import { Container, Grid, Stack } from '@chakra-ui/react';
import FaqBox from '@/components/landing/FaqBox';
import LandingH from '@/components/landing/LandingH';

const FAQS = [
  {
    title: 'How long does it take to set up my profile?',
    description:
      'Most businesses complete their MasterGiver Reputation Profile in about 15 minutes. You can update or expand it anytime.',
  },
  {
    title: 'Do I need to be a large business or nonprofit?',
    description:
      'No. MasterGiver is built for businesses of all sizes that give back in meaningful ways.',
  },
  {
    title: 'Does this replace my website or marketing?',
    description:
      "No. It complements them by adding a verified, third-party reputation layer they can't provide on their own.",
  },
  {
    title: 'How does MasterGiver help with AI and search visibility?',
    description:
      'By structuring and verifying your community impact in ways AI systems and search engines can recognize and factor into decisions.',
  },
  {
    title: 'Can I update my profile later?',
    description:
      'Absolutely. Your reputation evolves and your profile evolves with it.',
  },
  {
    title: 'Am I locked into a contract?',
    description:
      " No long-term contracts. Your profile is billed annually, and you're always in control.",
  },
  {
    title: "What if I don't have any community impact to showcase?",
    description:
      "That's ok.  Create your Reputation Profile anyway and begin building out your profile as much as you can.  Just getting started with a minimal profile is better than nothing at all.",
  },
];

const HomeFAQSection = () => {
  return (
    <Stack bgColor="#F7F8FA" borderY="1px solid #E9EAED">
      <Container
        py={{ base: '60px', lg: '100px' }}
        alignItems="center"
        display="flex"
        flexDir="column"
        gap="12"
      >
        <Stack textAlign="center" align="center" gap="6">
          <Stack w="100%" maxW="872px">
            <LandingH>Frequently Asked Questions</LandingH>
          </Stack>
        </Stack>

        <Grid templateColumns="repeat(1, 1fr)" gap="6" w="100%" maxW="1112px">
          {FAQS.map((item, i) => (
            <FaqBox
              key={i}
              title={item.title}
              description={item.description}
            />
          ))}
        </Grid>
      </Container>
    </Stack>
  );
};

export default HomeFAQSection;

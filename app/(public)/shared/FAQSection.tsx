import FaqBox from '@/components/landing/FaqBox';
import LandingH from '@/components/landing/LandingH';
import { Container, Grid, Stack } from '@chakra-ui/react';

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

const FAQSection = () => {
  return (
    <Stack bgColor="white" borderY="1px solid #E9EAED">
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
              theme={true}
            />
          ))}
        </Grid>
      </Container>
    </Stack>
  );
};

export default FAQSection;

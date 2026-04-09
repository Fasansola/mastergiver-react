/**
 * CommunityRepSection — "What You Get as a MasterGiver" on the reputation page.
 *
 * 2×2 grid of CommunityRepBox cards covering the four elements of a structured
 * reputation record: Impact Summary, Documented Initiatives, Partnerships, Signals.
 */
import { Container, Grid, Stack, Text } from '@chakra-ui/react';
import ImpactSummaryIcon from '@/public/reputation/impact Summary.png';
import DocumentIntiavtiveIcon from '@/public/reputation/Documented Initiatives.png';
import CommunityCivilizationIcon from '@/public/reputation/Community Partnerships.png';
import ShareableRepIcon from '@/public/reputation/Shareable Reputation Signals.png';
import CommunityRepBox from '@/components/landing/CommunityRepBox';
import LandingH from '@/components/landing/LandingH';

const communityRep = [
  {
    image: ImpactSummaryIcon,
    title: 'Impact Summary',
    description:
      "A clear, scannable overview of your involvement: causes you support and what you've contributed.",
  },
  {
    image: DocumentIntiavtiveIcon,
    title: 'Documented Initiatives',
    description:
      'Specific, dated records of sponsorships, donations, and civic activities that build concrete credibility.',
  },
  {
    image: CommunityCivilizationIcon,
    title: 'Community Partnerships',
    description:
      'Identifies specific organizations you support, creating verifiable connections rather than vague claims.',
  },
  {
    image: ShareableRepIcon,
    title: 'Shareable Reputation Signals',
    description:
      'A Verified Impact Badge that carries your community reputation into your website and social presence.',
  },
];

const CommunityRepSection = () => {
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
            <LandingH>What You Get as a MasterGiver</LandingH>
          </Stack>
          <Text color="text.primary" maxW="1032px">
            Everything you need to turn community impact into competitive
            advantage
          </Text>
        </Stack>

        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
          gap="4"
        >
          {communityRep.map(({ image, title, description }, i) => (
            <CommunityRepBox
              key={i}
              image={image}
              title={title}
              description={description}
            />
          ))}
        </Grid>
      </Container>
    </Stack>
  );
};

export default CommunityRepSection;

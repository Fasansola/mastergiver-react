/**
 * WhatYouGetSection — "What You Get as a MasterGiver"
 *
 * Six-card grid of WhatYouGetBox components covering every deliverable
 * included in the subscription (profile, AI signals, badge, directory, etc.).
 */
import { Container, Grid, Stack, Text } from '@chakra-ui/react';
import RepProfileIcon from '@/public/landing/VerifiedReputationProfile.svg';
import AISearchIcon from '@/public/landing/AI Search.svg';
import CredibitilyIcon from '@/public/landing/Credibility.svg';
import BadgeIcon from '@/public/landing/Badge.svg';
import DirectoryIcon from '@/public/landing/Directory.svg';
import GrowthIcon from '@/public/landing/Growth.svg';
import WhatYouGetBox from '@/components/landing/WhatYouGetBox';
import LandingH from '@/components/landing/LandingH';

const whatYouGet = [
  {
    image: RepProfileIcon.src,
    title: 'Verified Reputation Profile',
    description:
      'A public, professionally structured profile documenting your charitable giving, sponsorships, and community involvement — built to be credible, searchable, and easy to understand.',
  },
  {
    image: AISearchIcon.src,
    title: 'AI and Search-Friendly Reputation Signals',
    description:
      'Your impact is structured so AI systems and search engines can recognize, evaluate, and factor it into recommendations and rankings.',
  },
  {
    image: CredibitilyIcon.src,
    title: 'Independent Third-Party Credibility',
    description:
      'Your reputation lives on a neutral platform not just your own website increasing trust with both algorithms and people.',
  },
  {
    image: BadgeIcon.src,
    title: 'MasterGiver Trust Badge',
    description:
      'A digital badge you can place on your website, emails, and marketing materials to signal verified community impact wherever customers encounter your brand.',
  },
  {
    image: DirectoryIcon.src,
    title: 'MasterGiver Directory Inclusion',
    description:
      'Your business is included in a growing directory of verified, "good" businesses — designed to be discoverable by customers and AI alike.',
  },
  {
    image: GrowthIcon.src,
    title: 'Ongoing Updates as You Grow',
    description:
      "Your reputation isn't static. As your giving and involvement evolve, your profile grows with it, keeping your signals current and relevant",
  },
];

const WhatYouGetSection = () => {
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
          templateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          }}
          gap="4"
        >
          {whatYouGet.map((item, i) => (
            <WhatYouGetBox
              key={i}
              image={item.image}
              title={item.title}
              description={item.description}
            />
          ))}
        </Grid>
      </Container>
    </Stack>
  );
};

export default WhatYouGetSection;

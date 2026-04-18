/**
 * CommunityImpactSection — "MasterGiver Makes Your Community Impact Visible"
 *
 * Three-step process cards (Document → Verify & Structure → Boost Visibility)
 * with a CTA linking to the reputation explainer page.
 */
import { Box, Button, Container, Grid, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import DocumentIcon from '@/public/landing/Document.svg';
import VerifiedIcon from '@/public/landing/Verified.svg';
import BoosterIcon from '@/public/landing/Booster.svg';
import CommunityImpactBox from '@/components/landing/CommunityImpactBox';
import LandingH from '@/components/landing/LandingH';

const communityImpact = [
  {
    image: DocumentIcon.src,
    title: 'Document',
    description:
      'Share your giving and impact details in minutes. We capture everything from sponsorships to donations.',
  },
  {
    image: VerifiedIcon.src,
    title: 'Verify & Structure',
    description:
      'We turn actions into AI-readable, trusted signals with structured data and verification.',
  },
  {
    image: BoosterIcon.src,
    title: 'Boost Visibility',
    description:
      'Search engines and AI now recognize your true value and recommend you to customers.',
  },
];

const CommunityImpactSection = () => {
  return (
    <Stack>
      <Container
        py={{ base: '60px', lg: '100px' }}
        alignItems="center"
        display="flex"
        flexDir="column"
        gap="12"
      >
        <Stack textAlign="center" align="center" gap="6">
          <Stack w="100%" maxW="872px">
            <LandingH>MasterGiver Makes Your Community Impact Visible</LandingH>
          </Stack>
          <Text color="text.primary" maxW="880px" fontSize="body">
            MasterGiver exists to make sure the good your business does is
            recognized, understood, and rewarded. We translate your real-world
            actions — charitable giving, sponsorships, and community involvement
            — into verified reputation signals AI and search engines can read
            and trust. So your business doesn&apos;t just do good, but turns
            trust and visibility into growth.
          </Text>
        </Stack>

        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          }}
          gap="4"
          width="100%"
        >
          {communityImpact.map((item, i) => (
            <CommunityImpactBox
              key={i}
              image={item.image}
              title={item.title}
              description={item.description}
            />
          ))}
        </Grid>

        <Box w={{ base: '100%', lg: 'fit-content' }}>
          <Link href="/reputation">
            <Button
              bg="#2F2B77"
              color="white"
              fontWeight="700"
              fontSize={{ base: '16px', lg: '20px' }}
              lineHeight="160%"
              borderRadius="8px"
              px={{ base: '6', lg: '8' }}
              py="4"
              h="auto"
              w="100%"
              whiteSpace="normal"
              boxShadow="0px 8px 10px -6px #E2E1FF, 0px 20px 25px -5px #D4D1FF"
            >
              See how the MasterGiver Reputation Profile™ works
            </Button>
          </Link>
        </Box>
      </Container>
    </Stack>
  );
};

export default CommunityImpactSection;

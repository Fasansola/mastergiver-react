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
    title: 'Build Your Foundation',
    description:
      'Document the community involvement you already have—or start with your very first initiative. Every business begins somewhere.',
  },
  {
    image: VerifiedIcon.src,
    title: 'Grow Your Impact',
    description:
      'As your business supports more nonprofits, sponsorships, volunteer efforts, and community initiatives, your profile grows with you.',
  },
  {
    image: BoosterIcon.src,
    title: 'Strengthen Your Reputation',
    description:
      'Turn years of community involvement into a lasting reputation asset that helps customers better understand who you are and what your business stands for.',
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
            <LandingH>Every Community Reputation Starts Somewhere.</LandingH>
          </Stack>
          <Text color="text.primary" maxW="880px" fontSize="body">
            Whether you&apos;ve supported your community for years or
            you&apos;re just getting started, MasterGiver helps you build a
            reputation asset that grows with your business.
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
              bg="brand.primary"
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
              See how the MasterGiver <br className="sm-mobile-only" />
              Community Impact Profile™ works
            </Button>
          </Link>
        </Box>
      </Container>
    </Stack>
  );
};

export default CommunityImpactSection;

/**
 * WhoItsForSection — "Who MasterGiver Is Built For"
 *
 * Split-screen section with background photo on the right and text with
 * a BrandCheck checklist describing the ideal customer profile.
 */
import { Box, Button, Container, Span, Stack, Text } from '@chakra-ui/react';
import LandingH from '@/components/landing/LandingH';
import BrandCheck from '@/components/landing/BrandCheck';
import Link from 'next/link';

const WhoItsForSection = () => {
  return (
    <Stack
      bg="background.white"
      h={{ base: 'auto', lg: '840px' }}
      maxH={{ base: 'none', lg: '840px' }}
      justify="center"
      position="relative"
    >
      <Stack
        h={{ base: '420px', lg: '100%' }}
        w={{ base: '100%', lg: '50%' }}
        maxW="780px"
        position={{ base: 'static', lg: 'absolute' }}
        right="calc(50% - 1440px / 2)"
        order={{ base: 2, lg: 0 }}
        flexShrink="0"
        style={{
          backgroundImage: `url('/landing/Who-is-mastergiver-for.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Container display="flex" justifyContent="start">
        <Stack
          py={{ base: '60px', lg: '100px' }}
          maxW={{ base: '100%', lg: '748px' }}
        >
          <Stack
            gap="6"
            maxW={{ base: '100%', lg: '568px' }}
            pr={{ base: '0', lg: '64px' }}
          >
            <Span textAlign={{ base: 'center', md: 'left ' }}>
              <LandingH>
                Who MasterGiver <br className="sm-mobile-only" />
                Is Built For
              </LandingH>
            </Span>
            <Stack gap="8">
              <Text textAlign={{ base: 'center', md: 'left ' }}>
                MasterGiver is designed for businesses that understand
                reputation is more than marketing, it&apos;s an asset.
              </Text>

              <Stack gap="7">
                <Text
                  className="font-body"
                  // fontSize={{ base: '22px', md: '24px', lg: '28px' }}
                  lineHeight="130%"
                  // fontWeight="700"
                >
                  It&apos;s a strong fit if your business:
                </Text>

                <Stack gap="4">
                  {[
                    'Actively supports causes, nonprofits, or community initiatives',
                    'Cares about being recognized for how it operates, not just what it sells',
                    'Wants an edge in visibility and credibility as AI and search evolve',
                    'Is already investing in growth, marketing, or brand reputation',
                    'Believes doing good should create real business advantage',
                  ].map((item, i) => (
                    <BrandCheck item={item} key={i} />
                  ))}
                </Stack>
              </Stack>

              <Text>
                If you&apos;re already giving back or plan to in the near
                future, MasterGiver helps make sure it actually counts.
              </Text>

              <Box w={{ base: '100%', lg: 'fit-content' }}>
                <Link href="/business/tess-the-tooth-fairy">
                  <Button
                    bg="brand.primary"
                    color="white"
                    fontWeight="700"
                    fontSize={{ base: '16px', lg: '20px' }}
                    lineHeight="160%"
                    borderRadius="8px"
                    px={{ base: '12', lg: '8' }}
                    py="4"
                    h="auto"
                    w="100%"
                    whiteSpace="normal"
                    boxShadow="0px 8px 10px -6px #E2E1FF, 0px 20px 25px -5px #D4D1FF"
                  >
                    View Example Reputation Profile
                  </Button>
                </Link>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default WhoItsForSection;

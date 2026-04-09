/**
 * ReputationRulesSection — "The Rules of Reputation Have Changed"
 *
 * Split-screen section with background photo on the left and explanatory
 * text on the right. Covers the algorithmic shift in how reputation is evaluated.
 */
import { Box, Button, Container, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import LandingH from '@/components/landing/LandingH';

const ReputationRulesSection = () => {
  return (
    <Stack
      bg="#F8F8F8"
      h={{ base: 'auto', lg: '840px' }}
      maxH={{ base: 'none', lg: '840px' }}
      justify="center"
      position="relative"
    >
      <Stack
        h={{ base: '420px', lg: '100%' }}
        w={{ base: '100%', lg: '50%' }}
        position={{ base: 'static', lg: 'absolute' }}
        order={{ base: 2, lg: 0 }}
        flexShrink="0"
        bgImage={{
          base: `url('/landing/RulesandReputation.png')`,
          lg: `linear-gradient(to right, transparent 75%, #F8F8F8 100%), url('/landing/RulesandReputation.png')`,
        }}
        style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <Container display="flex" justifyContent={{ base: 'start', lg: 'end' }}>
        <Stack
          py={{ base: '60px', lg: '100px' }}
          maxW={{ base: '100%', lg: '748px' }}
          pl={{ base: '0', lg: '10' }}
        >
          <Stack gap="6" maxW={{ base: '100%', lg: '568px' }}>
            <LandingH>The Rules of Reputation Have Changed</LandingH>
            <Stack gap="8">
              <Stack gap="2">
                <Text>
                  Reputation used to be built through people. Now it&apos;s
                  evaluated by algorithms.
                </Text>
                <Text>
                  Search engines and AI decide who shows up, who gets
                  recommended, and who gets ignored before a customer ever
                  reaches out
                </Text>
              </Stack>

              <Stack
                p={{ base: '5', lg: '8' }}
                borderLeft="4px solid"
                borderColor="#BDBDFA"
                bg="#FFFFFF"
              >
                <Text
                  className="font-display"
                  fontSize={{ base: '20px', md: '24px', lg: '28px' }}
                  lineHeight="130%"
                  fontWeight="700"
                >
                  If algorithms can&apos;t recognize your reputation, it
                  doesn&apos;t factor into the decision.
                </Text>
              </Stack>

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
                    Learn the New Rules of Reputation
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

export default ReputationRulesSection;

/**
 * HomeHeroSection — main landing page hero.
 *
 * Gradient background blends with the site header above it.
 * Displays the primary headline, CTA button, hero image, and trust signals.
 */
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Image,
  Separator,
  Span,
  Stack,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import Hero from '@/public/landing/BusinessHero.png';
import GreenCheck from '@/components/landing/GreenCheck';

const HomeHeroSection = () => {
  return (
    <Stack bg="linear-gradient(107.69deg, #F3F6FF 0%, #F1F5FF 100%)">
      <Container
        pt={{ base: '40px', lg: '64px' }}
        pb={{ base: '60px', lg: '100px' }}
      >
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          gap={{ base: '10', lg: '6' }}
          align="center"
        >
          <Stack w={{ base: '100%', lg: '50%' }} gap="10">
            <Stack
              gap="6"
              maxW={{ base: '100%', lg: '640px' }}
              textAlign={{ base: 'center', md: 'left' }}
            >
              <Heading
                className="font-display"
                fontWeight="700"
                fontSize={{ base: '36px', md: '52px', lg: '74px' }}
                lineHeight="120%"
              >
                Get Discovered for the{' '}
                <Span className="font-display" color="brand.primary">
                  Good Your Business Does
                </Span>
              </Heading>
              <Text
                className="font-body"
                fontSize={{ base: '18px', lg: '21px' }}
                lineHeight="170%"
                color="text.primary"
              >
                MasterGiver turns your business&apos;s charitable giving and
                community involvement into verified reputation signals so AI
                recommends you, search engines rank you higher, and customers
                choose you.
              </Text>
            </Stack>
            <Stack gap="8">
              <Box w={{ base: '100%', lg: 'fit-content' }}>
                <Link href="/business/signup">
                  <Button
                    bg="#2F2B77"
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
                    Get Your MasterGiver <br className="sm-mobile-only" />
                    Reputation Profile™
                  </Button>
                </Link>
              </Box>
              <HStack gap="3" flexWrap="wrap">
                <GreenCheck item="Setup in minutes" />
                <Separator
                  orientation="vertical"
                  height="4"
                  display={{ base: 'none', md: 'block' }}
                />
                <GreenCheck item="No technical work required" />
              </HStack>
            </Stack>
          </Stack>
          <Stack w={{ base: '100%', lg: '50%' }} justify="center">
            <Image
              src={Hero.src}
              align="center"
              justifyContent="center"
              alt="Hero image"
              w={{ base: '100%', '2xl': '120%' }}
              maxW={{ base: '100%', '2xl': '120%' }}
            />
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default HomeHeroSection;

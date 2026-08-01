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
  Separator,
  Span,
  Stack,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import NextImage from 'next/image';
import Hero from '@/public/landing/HeroEditorial.png';
import GreenCheck from '@/components/landing/GreenCheck';
import { HERO_GRADIENT } from '@/lib/theme/gradients';

const HomeHeroSection = () => {
  return (
    <Stack bg={HERO_GRADIENT}>
      <Container
        pt={{ base: '40px', lg: '64px' }}
        pb={{ base: '60px', lg: '100px' }}
      >
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          gap={{ base: '10', lg: '6' }}
          align="center"
        >
          <Stack w={{ base: '100%', lg: '45%' }} gap="10">
            <Stack
              gap="6"
              maxW={{ base: '100%', lg: '560px' }}
              textAlign={{ base: 'center', md: 'left' }}
            >
              <Heading
                className="font-display"
                fontWeight="700"
                fontSize={{ base: '36px', md: '46px', lg: '56px' }}
                lineHeight="140%"
              >
                Your Community Impact is an Asset.
                <br />
                <Span
                  className="font-display"
                  color="brand.primary"
                  wordSpacing="12px"
                >
                  It&apos;s Just Invisible.
                </Span>
              </Heading>
              <Text
                className="font-body"
                fontSize={{ base: '18px', lg: '21px' }}
                lineHeight="170%"
                color="text.primary"
              >
                MasterGiver organizes and verifies your community involvement
                into a permanent profile that strengthens your business
                reputation.
              </Text>
            </Stack>
            <Stack gap="8">
              <Stack
                direction={{ base: 'column', md: 'row' }}
                align={{ md: 'stretch' }}
                gap="3"
                w={{ base: '100%', md: 'auto' }}
              >
                <Link href="/business/signup" style={{ display: 'flex' }}>
                  <Button
                    bg="brand.primary"
                    color="white"
                    fontWeight="700"
                    fontSize={{ base: '14px', lg: '18px' }}
                    lineHeight="160%"
                    borderRadius="8px"
                    px={{ base: '6', lg: '8' }}
                    py="4"
                    h="100%"
                    w={{ base: '100%', md: 'auto' }}
                    whiteSpace="normal"
                    boxShadow="0px 8px 10px -6px #E2E1FF, 0px 20px 25px -5px #D4D1FF"
                  >
                    Get Your Community Impact Profile
                  </Button>
                </Link>
                <Link
                  href="/business/clearview-family-eyecare"
                  style={{ display: 'flex' }}
                >
                  <Button
                    bg="transparent"
                    color="brand.primary"
                    fontWeight="600"
                    fontSize={{ base: '14px', lg: '18px' }}
                    lineHeight="160%"
                    borderRadius="8px"
                    border="1px solid"
                    borderColor="brand.primary"
                    px={{ base: '6', lg: '8' }}
                    py="4"
                    h="100%"
                    w={{ base: '100%', md: 'auto' }}
                    whiteSpace="normal"
                    _hover={{ bg: '#F5F4FF' }}
                  >
                    View Example Profile
                  </Button>
                </Link>
              </Stack>
              <HStack gap="3" flexWrap="wrap">
                <GreenCheck item="Setup in minutes" />
                <Separator
                  orientation="vertical"
                  height="4"
                  display={{ base: 'none', md: 'block' }}
                />
                <GreenCheck item="Free to Create" />
                <Separator
                  orientation="vertical"
                  height="4"
                  display={{ base: 'none', md: 'block' }}
                />
                <GreenCheck item="No technical work required" />
              </HStack>
            </Stack>
          </Stack>

          <Stack w={{ base: '100%', lg: '55%' }} justify="center" gap="4">
            <NextImage
              src={Hero}
              alt="Sponsorship plaques, volunteer shirts, community photos, certificates, and thank-you letters — the story of a business's community impact"
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.10)',
                filter: 'brightness(0.95) contrast(1.05)',
              }}
              quality={90}
            />
            <Text
              className="font-body"
              fontSize="15px"
              fontWeight="450"
              lineHeight="1.5"
              color="#555555"
              textAlign="center"
            >
              MasterGiver organizes years of community involvement into one
              permanent reputation asset for your business.
            </Text>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default HomeHeroSection;

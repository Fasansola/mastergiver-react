/**
 * MasterGiverProfileSection — "The MasterGiver Reputation Profile™"
 *
 * Text and BrandCheck feature list on the left with a signup CTA button.
 * Hero product image on the right.
 */
import { Box, Button, Container, Stack } from '@chakra-ui/react';
import Link from 'next/link';
import NextImage from 'next/image';
import Hero from '@/public/landing/BusinessHero.png';
import BrandCheck from '@/components/landing/BrandCheck';
import LandingH from '@/components/landing/LandingH';

const MasterGiverProfileSection = () => {
  return (
    <Stack bg="white">
      <Container py={{ base: '60px', lg: '100px' }}>
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          gap={{ base: '10', lg: '6' }}
          align="center"
        >
          <Stack w={{ base: '100%', lg: '50%' }} gap="60px">
            <Stack gap="6" maxW={{ base: '100%', lg: '640px' }}>
              <LandingH>The MasterGiver Reputation Profile™</LandingH>
              <Stack
                className="font-body"
                lineHeight="170%"
                color="text.primary"
                gap="6"
              >
                <p>
                  MasterGiver is the platform built specifically to help local
                  businesses structure and publish their community impact.
                </p>
              </Stack>
            </Stack>
            <Stack gap="14">
              <Stack fontWeight="500" gap="4">
                {[
                  'Organizes community involvement into a public record customers trust and AI references.',
                  'Provides a Verified Impact Badge for your website and marketing materials.',
                  'Start with a single initiative and build your profile over time.',
                ].map((item, i) => (
                  <BrandCheck item={item} key={i} />
                ))}
              </Stack>
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
                    Get Your Reputation Profile
                  </Button>
                </Link>
              </Box>
            </Stack>
          </Stack>
          <Stack w={{ base: '100%', lg: '50%' }} justify="center">
            <NextImage
              src={Hero}
              alt="Hero image"
              style={{ width: '100%', height: 'auto' }}
            />
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default MasterGiverProfileSection;

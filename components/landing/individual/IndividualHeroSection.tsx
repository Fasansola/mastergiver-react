/**
 * IndividualHeroSection — hero for the /individual landing page.
 *
 * Typography matches the original Django template:
 *   - main-heading: 82px / weight 800 / line-height 100px (desktop)
 *   - big-text: 1.25rem / line-height 160%
 */
import { Box, Button, Container, Heading, Span, Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import heroImage from '@/public/individual/hero-image.png';

const IndividualHeroSection = () => {
  return (
    <Stack bgColor="white">
      <Container py={{ base: '48px', lg: '80px' }}>
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          align="center"
          gap={{ base: '10', lg: '12' }}
        >
          {/* Left — text + CTA */}
          <Stack
            w={{ base: '100%', lg: '50%' }}
            gap={{ base: '6', lg: '8' }}
            align={{ base: 'center', lg: 'flex-start' }}
            textAlign={{ base: 'center', lg: 'left' }}
          >
            <Heading
              fontWeight="800"
              fontSize={{ base: '12vw', md: '64px', lg: '82px' }}
              lineHeight={{ base: '15vw', md: '80px', lg: '100px' }}
              color="text.heading"
            >
              Show Off Your <br />
              <Span color="brand.primary">Good Side</Span>.
            </Heading>

            <Text
              fontSize="1.25rem"
              lineHeight="160%"
              color="text.primary"
              maxW="480px"
            >
              Build your MasterGiver profile to track your charitable efforts,
              share your impact, and let the world see your commitment to doing
              good.
            </Text>

            <Box w={{ base: '100%', lg: 'fit-content' }}>
              <Link href="/signup">
                <Button
                  bg="brand.primary"
                  color="white"
                  fontWeight="700"
                  fontSize="1.25rem"
                  lineHeight="160%"
                  borderRadius="8px"
                  px="10"
                  h="64px"
                  w={{ base: '100%', lg: 'auto' }}
                  boxShadow="0px 8px 10px -6px #E2E1FF, 0px 20px 25px -5px #D4D1FF"
                  _hover={{ bg: 'brand.primaryHover' }}
                >
                  Get Started
                </Button>
              </Link>
            </Box>
          </Stack>

          {/* Right — hero image */}
          <Stack w={{ base: '100%', lg: '50%' }} align="center">
            <Image
              src={heroImage}
              alt="MasterGiver profile on desktop and mobile"
              style={{ width: '100%', height: 'auto' }}
              priority
            />
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default IndividualHeroSection;

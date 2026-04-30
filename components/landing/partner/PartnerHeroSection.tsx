/**
 * PartnerHeroSection — hero for the /partner page.
 *
 * Gradient background with headline about adding value to members,
 * a CTA anchor link to the form, and the partner hero image.
 */
import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react';
import NextImage from 'next/image';
import Hero from '@/public/partner/Hero.png';

const PartnerHeroSection = () => {
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
              gap="10"
              maxW={{ base: '100%', lg: '640px' }}
              textAlign={{ base: 'center', md: 'left' }}
            >
              <Heading
                className="font-display"
                fontWeight="700"
                fontSize={{ base: '38px', md: '52px', lg: '74px' }}
                lineHeight="120%"
                color="brand.primary"
              >
                Add Instant Value for Members and Sponsors
              </Heading>
              <Text
                className="font-body"
                fontSize={{ base: '18px', lg: '21px' }}
                lineHeight="170%"
                color="text.primary"
              >
                Give your entire network a powerful way to track and showcase
                their community impact — at no cost to you.
              </Text>
            </Stack>

            <Stack gap="8">
              <Box w={{ base: '100%', lg: 'fit-content' }}>
                <a href="partner/#cta">
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
                    BECOME A PARTNER
                  </Button>
                </a>
              </Box>
            </Stack>
          </Stack>

          <Stack w={{ base: '100%', lg: '50%' }} align="end">
            <NextImage
              src={Hero}
              alt="Partner hero"
              style={{ width: '100%', height: 'auto', maxWidth: '600px' }}
            />
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default PartnerHeroSection;

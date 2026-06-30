/**
 * PartnerHeroSection — hero for the /partner page.
 *
 * Gradient background with headline about adding value to members,
 * a CTA anchor link to the form, and the partner hero image.
 */
import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import NextImage from 'next/image';
import Hero from '@/public/partner/Hero.png';
import { HERO_GRADIENT } from '@/lib/theme/gradients';

const PartnerHeroSection = () => {
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
          <Stack w={{ base: '100%', lg: '50%' }} gap="10">
            <Stack
              gap="10"
              maxW={{ base: '100%', lg: '640px' }}
              textAlign={{ base: 'center', md: 'left' }}
            >
              <Heading
                className="font-display"
                fontWeight="700"
                fontSize={{ base: '36px', md: '46px', lg: '56px' }}
                lineHeight="140%"
                color="brand.primary"
              >
                Help Sponsors Get More Recognition for Their{' '}
                <Box as="span" whiteSpace="nowrap">Community Impact</Box>
              </Heading>
              <Text
                className="font-body"
                fontSize={{ base: '18px', lg: '21px' }}
                lineHeight="170%"
                color="text.primary"
              >
                Give your corporate sponsors a powerful way to document, verify,
                and showcase the community support they already provide—at no
                cost to your organization.
              </Text>
            </Stack>

            <Stack gap="8">
              <Stack
                direction={{ base: 'column', md: 'row' }}
                align={{ md: 'stretch' }}
                gap="3"
                w={{ base: '100%', md: 'auto' }}
              >
                <a href="partner/#cta" style={{ display: 'flex' }}>
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
                    BECOME A PARTNER
                  </Button>
                </a>
                <Link href="/business/clearview-family-eyecare" style={{ display: 'flex' }}>
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
            </Stack>
          </Stack>

          <Stack w={{ base: '100%', lg: '50%' }} align="end" display={{ base: 'none', lg: 'flex' }}>
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

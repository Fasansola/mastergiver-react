/**
 * ReputationHeroSection — hero for the /reputation page.
 *
 * Gradient background with headline about the missing marketing layer,
 * an explanatory pull-quote, CTA button, and a verified impact image.
 */
import {
  Button,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import NextImage from 'next/image';
import VerifiedImpact from '@/public/reputation/VerifiedImpact.png';
import { HERO_GRADIENT } from '@/lib/theme/gradients';

const ReputationHeroSection = () => {
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
            <Stack gap="10" maxW={{ base: '100%', lg: '640px' }}>
              <Heading
                className="font-display"
                fontWeight="700"
                fontSize={{ base: '38px', md: '52px', lg: '74px' }}
                lineHeight="120%"
                color="brand.primary"
              >
                One of Your Most Valuable Reputation Assets Is Being Overlooked
              </Heading>
              <Stack gap="6">
                <Text
                  className="font-body"
                  fontSize={{ base: '18px', lg: '21px' }}
                  lineHeight="170%"
                  color="text.primary"
                >
                  Most local businesses spend thousands of dollars building
                  visibility through Google Ads, Facebook Ads, customer reviews,
                  SEO, and their website.
                </Text>
                <Text
                  className="font-body"
                  fontSize={{ base: '18px', lg: '21px' }}
                  lineHeight="170%"
                  color="text.primary"
                >
                  Yet one of the strongest trust signals available to customers
                  often remains invisible online: documented community
                  involvement.
                </Text>
                <Text
                  className="font-body"
                  fontSize={{ base: '18px', lg: '21px' }}
                  lineHeight="170%"
                  color="text.primary"
                >
                  MasterGiver helps transform sponsorships, nonprofit
                  partnerships, donations, and volunteer efforts into a
                  structured reputation asset that strengthens trust, supports
                  differentiation, and helps your business stand out.
                </Text>
              </Stack>
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
                    Get Your Reputation Profile
                  </Button>
                </Link>
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
              src={VerifiedImpact}
              alt="Verified Impact"
              style={{ width: '100%', height: 'auto', maxWidth: '540px' }}
            />
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default ReputationHeroSection;

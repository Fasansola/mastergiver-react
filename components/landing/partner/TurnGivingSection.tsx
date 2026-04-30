/**
 * TurnGivingSection — "We turn giving into a visible business asset."
 *
 * Product screenshot on the left, feature description and BrandCheck
 * checklist on the right.
 */
import { Container, Stack, Text } from '@chakra-ui/react';
import NextImage from 'next/image';
import DeviceDesktop from '@/public/landing/BusinessHero.png';
import BrandCheck from '@/components/landing/BrandCheck';
import LandingH from '@/components/landing/LandingH';

const TurnGivingSection = () => {
  return (
    <Stack bg="white">
      <Container py={{ base: '60px', lg: '100px' }}>
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          gap={{ base: '10', lg: '20' }}
          align="center"
        >
          <Stack w={{ base: '100%', lg: '55%' }} justify="center">
            <NextImage
              src={DeviceDesktop}
              alt="MasterGiver dashboard"
              style={{ width: '100%', height: 'auto' }}
            />
          </Stack>

          <Stack
            w={{ base: '100%', lg: '45%' }}
            gap={{ base: '10', lg: '60px' }}
          >
            <Stack gap="6" maxW={{ base: '100%', lg: '640px' }}>
              <LandingH>We turn giving into a visible business asset.</LandingH>
              <Stack
                className="font-body"
                lineHeight="170%"
                color="text.primary"
                gap="6"
                fontSize={{ base: '18px', lg: '21px' }}
              >
                <Text>
                  Most businesses give back to their communities but that
                  generosity never shows up where customers can see it.
                  MasterGiver gives businesses a Reputation Profile™ as a
                  dedicated place to showcase the good they do and strengthen
                  how they appear online.
                </Text>
              </Stack>
            </Stack>
            <Stack gap="14">
              <Stack gap="4">
                {[
                  'Highlight community involvement and sponsorships',
                  'Build credibility and trust with local customers',
                  'Improve online reputation',
                  'Demonstrate a genuine commitment to community impact',
                ].map((item, i) => (
                  <BrandCheck item={item} key={i} />
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default TurnGivingSection;

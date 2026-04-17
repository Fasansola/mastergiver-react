/**
 * WhoItsForSection — "Who MasterGiver Is Built For"
 *
 * Split-screen section with background photo on the right and text with
 * a BrandCheck checklist describing the ideal customer profile.
 */
import { Container, Stack, Text } from '@chakra-ui/react';
import LandingH from '@/components/landing/LandingH';
import BrandCheck from '@/components/landing/BrandCheck';

const WhoItsForSection = () => {
  return (
    <Stack
      bg="#FFF"
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
            <LandingH>Who MasterGiver Is Built For</LandingH>
            <Stack gap="8">
              <Text>
                MasterGiver is designed for businesses that understand
                reputation is more than marketing, it&apos;s an asset.
              </Text>

              <Stack gap="7">
                <Text
                  className="font-display"
                  fontSize={{ base: '22px', md: '24px', lg: '28px' }}
                  lineHeight="130%"
                  fontWeight="700"
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
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default WhoItsForSection;

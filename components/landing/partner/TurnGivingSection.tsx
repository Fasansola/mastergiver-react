/**
 * TurnGivingSection — "We turn giving into a visible business asset."
 *
 * Product screenshot on the left, feature description and BrandCheck
 * checklist on the right.
 */
import { Box, Container, Stack, Text } from '@chakra-ui/react';
import BrandCheck from '@/components/landing/BrandCheck';
import LandingH from '@/components/landing/LandingH';

const TurnGivingSection = () => {
  return (
    <Stack bg="background.white">
      <Container py={{ base: '60px', lg: '100px' }}>
        <Stack gap={{ base: '10', lg: '16' }} alignItems="center">
          {/* Heading — full width above both columns */}

          <Box textAlign="center" w="100%" maxW="740px">
            <LandingH>
              Most Businesses Give Back. Few Get Credit For It.
            </LandingH>
          </Box>

          {/* Two-column row: description left, checklist right */}
          <Stack
            direction={{ base: 'column', lg: 'row' }}
            gap={{ base: '10', lg: '20' }}
            align={{ lg: 'start' }}
          >
            <Stack
              w={{ base: '100%', lg: '55%' }}
              className="font-body"
              lineHeight="170%"
              color="text.primary"
              gap="6"
              fontSize={{ base: '18px' }}
            >
              <Text>
                Businesses support nonprofits, sponsor community programs,
                donate resources, and invest countless hours giving back. Yet
                much of that impact remains scattered across websites, social
                media posts, event pages, and thank-you mentions that are
                difficult for customers, prospects, and search engines to
                discover.
              </Text>
              <Text>
                MasterGiver helps businesses bring those efforts together into a
                dedicated Community Impact Profile™ that showcases their
                community involvement and highlights what makes them different.
              </Text>
            </Stack>

            <Stack w={{ base: '100%', lg: '45%' }} gap="4">
              {[
                'Highlight sponsorships and community involvement',
                'Create a lasting reputation asset',
                'Build trust with customers',
                'Differentiate from competitors',
                'Strengthen online visibility',
              ].map((item, i) => (
                <BrandCheck item={item} key={i} />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default TurnGivingSection;

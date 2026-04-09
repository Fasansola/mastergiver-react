/**
 * PartnerCtaSection — bottom CTA section for the /partner page.
 *
 * Two-column layout: left column has headline + LightCheck benefits list;
 * right column has the PartnerForm card.
 */
import { Container, Stack, Text } from '@chakra-ui/react';
import BGPatterns from '@/public/landing/BGPatterns.png';
import { Heading } from '@chakra-ui/react';
import LandingH from '@/components/landing/LandingH';
import LightCheck from '@/components/landing/LightCheck';
import PartnerForm from '@/components/landing/PartnerForm';

const PartnerCtaSection = () => {
  return (
    <Stack bgColor="brand.primary" color="white" id="cta">
      <Container
        py={{ base: '60px', lg: '100px' }}
        bgImage={`url(${BGPatterns.src})`}
        bgSize="cover"
        bgRepeat="no-repeat"
        minH={{ base: 'auto', lg: '550px' }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          gap={{ base: '10', lg: '20' }}
          align="center"
          justify="space-between"
        >
          <Stack w={{ base: '100%', lg: '45%' }} gap="10" color="white!">
            <Text className="font-body" lineHeight="180%">
              BECOME A COMMUNITY PARTNER
            </Text>
            <LandingH color="white">Get Your Partner Toolkit</LandingH>
            <Stack
              className="font-body"
              lineHeight="170%"
              gap="6"
              fontSize={{ base: '18px', lg: '21px' }}
            >
              <Text>
                Complete the short form to receive your partner toolkit and
                start sharing with your network.
              </Text>
            </Stack>
            <Stack gap="14">
              <Stack fontWeight="500!" gap="4">
                {[
                  'Your custom $20 partner discount code',
                  'A copy-and-paste email template ready to send to your members, sponsors, or supporters',
                  'No calls. No follow-up required. No commitments.',
                ].map((item, i) => (
                  <LightCheck item={item} key={i} />
                ))}
              </Stack>
            </Stack>
          </Stack>

          <Stack
            w={{ base: '100%', lg: '45%' }}
            textAlign="center"
            gap={{ base: '8', lg: '60px' }}
            p={{ base: '8', lg: '12' }}
            borderRadius="16px"
            color="text.heading"
            bgColor="white"
          >
            <Stack gap="10">
              <Heading
                className="font-display"
                fontWeight="700"
                fontSize={{ base: '26px', lg: '32px' }}
                lineHeight="120%"
              >
                Create Partner Account
              </Heading>

              <PartnerForm />

              <Stack gap="2">
                <Text>
                  No cost. No obligation. Just a simple way to offer value to
                  your network.
                </Text>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default PartnerCtaSection;

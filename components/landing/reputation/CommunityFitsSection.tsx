/**
 * CommunityFitsSection — "Where Community Impact Fits in Modern Marketing"
 *
 * Image on the left, text and icon-grid on the right. Explains the five
 * reputation layers and positions Community Impact as the missing top layer.
 */
import { Container, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import NextImage from 'next/image';
import CommunityImpact from '@/public/reputation/Community impact.png';
import DiscoveryIcon from '@/public/reputation/Discovery.svg';
import CommunityIcon from '@/public/reputation/Community Impact icon.svg';
import ProofIcon from '@/public/reputation/Proof & Authority.svg';
import LandingH from '@/components/landing/LandingH';

const layers = [
  {
    image: DiscoveryIcon,
    title: 'Discovery',
    description: 'The foundation that helps people find you.',
  },
  {
    image: ProofIcon,
    title: 'Proof & Authority',
    description: 'Signals that build initial trust and credibility.',
  },
  {
    image: CommunityIcon,
    title: 'Community Impact',
    description: 'Demonstrates genuine investment in the area you serve.',
  },
];

const CommunityFitsSection = () => {
  return (
    <Stack bg="white">
      <Container py={{ base: '60px', lg: '100px' }}>
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          gap={{ base: '10', lg: '20' }}
          align="center"
          flexWrap="nowrap"
          justify="space-between"
        >
          <Stack w={{ base: '100%', lg: '42%' }} align="start">
            <NextImage
              src={CommunityImpact}
              alt="Community Impact"
              style={{ width: '100%', height: 'auto', maxWidth: '540px' }}
            />
          </Stack>

          <Stack w={{ base: '100%', lg: '50%' }} gap="10">
            <Stack gap="10">
              <LandingH>
                Where Community Impact Fits in Modern Marketing
              </LandingH>
              <Stack gap="6">
                <Text
                  className="font-body"
                  lineHeight="170%"
                  color="text.primary"
                >
                  There are five layers that make up a complete local business
                  reputation. Most businesses have invested in the bottom
                  layers. Very few have addressed the top.
                </Text>
                <Text
                  className="font-body"
                  lineHeight="170%"
                  color="text.primary"
                >
                  Most businesses have Discovery and Proof in place. Many have
                  some Authority signals. Almost none have Community Impact
                  organized into anything structured or visible.
                </Text>
              </Stack>
              <Grid gap="10">
                {layers.map(({ image, title, description }, i) => (
                  <Stack
                    gap="6"
                    borderRadius="12px"
                    align={{ base: 'center', md: 'start' }}
                    textAlign={{ base: 'center', md: 'start' }}
                    direction={{ base: 'column', md: 'row' }}
                    key={i}
                  >
                    <NextImage alt={title} src={image} width={48} height={48} />
                    <Stack gap="1">
                      <Heading
                        className="font-body"
                        fontSize="subheading"
                        color="brand.primary"
                      >
                        {title}
                      </Heading>
                      <Text
                        color="text.primary"
                        className="font-body"
                        lineHeight="180%"
                        fontSize="body"
                      >
                        {description}
                      </Text>
                    </Stack>
                  </Stack>
                ))}
              </Grid>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default CommunityFitsSection;

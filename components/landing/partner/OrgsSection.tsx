/**
 * OrgsSection — "Built for Organizations Like Yours"
 *
 * Text with BrandCheck list of org types (nonprofits, chambers, etc.) and
 * a pull-quote on the left, partner giving image on the right.
 */
import { Container, Stack, Text } from '@chakra-ui/react';
import NextImage from 'next/image';
import GivingImage from '@/public/partner/Giving Image.png';
import BrandCheck from '@/components/landing/BrandCheck';
import LandingH from '@/components/landing/LandingH';

const OrgsSection = () => {
  return (
    <Stack bg="white">
      <Container py={{ base: '60px', lg: '100px' }}>
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          gap={{ base: '10', lg: '6' }}
          align="center"
        >
          <Stack w={{ base: '100%', lg: '45%' }} gap="10">
            <Stack gap="10" maxW={{ base: '100%', lg: '640px' }}>
              <LandingH>Built for Organizations Like Yours</LandingH>
              <Text
                className="font-body"
                fontSize={{ base: '18px', lg: '21px' }}
                lineHeight="170%"
                color="text.primary"
              >
                If your organization supports businesses that care about their
                communities, this program was made for you.
              </Text>
            </Stack>

            <Stack gap="14">
              <Stack gap="4">
                {[
                  'Nonprofit Org',
                  'Local Initiatives & Programs',
                  'Chambers of Commerce',
                  'Associations',
                  'Community Foundations',
                ].map((item, i) => (
                  <BrandCheck item={item} key={i} />
                ))}
              </Stack>
            </Stack>

            <Stack
              padding="6"
              borderRadius="0 16px 16px 0"
              border="1px solid"
              borderLeft="4px solid"
              borderColor="#5851BF"
              bg="#FFFFFF"
            >
              <Text
                className="font-body"
                fontSize={{ base: '18px', lg: '21px' }}
                lineHeight="170%"
                textAlign="start"
              >
                If your network includes businesses that sponsor events, donate
                to causes, or engage locally, this is a simple, valuable
                resource you can pass along.
              </Text>
            </Stack>
          </Stack>

          <Stack w={{ base: '100%', lg: '55%' }} align="end">
            <NextImage
              src={GivingImage}
              alt="Partner organizations"
              style={{ width: '100%', height: 'auto', maxWidth: '600px' }}
            />
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default OrgsSection;

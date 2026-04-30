/**
 * HomeCtaSection — bottom CTA section on the home/landing page.
 *
 * Full-width brand.primary background with BGPatterns overlay.
 * Drives signups with a single "Get Started" button.
 */
import { Button, Container, Heading, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import BGPatterns from '@/public/landing/BGPatterns.png';

const HomeCtaSection = () => {
  return (
    <Stack bgColor="brand.primary" color="white">
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
        <Stack maxW={{ base: '100%', lg: '750px' }} textAlign="center" gap="8">
          <Stack gap="6" maxW="100%">
            <Heading
              className="font-display"
              fontWeight="700"
              fontSize={{ base: '34px', md: '46px', lg: '60px' }}
              lineHeight="120%"
            >
              Make Sure Your Reputation Works <br className="sm-mobile-only" />
              for You
            </Heading>
            <Stack gap="2">
              <Text>You&apos;re already doing good in your community.</Text>
              <Text>
                Now make sure it actually counts where decisions are made.
              </Text>
            </Stack>
          </Stack>

          <Stack align="center" gap="4">
            <Link href="/business/signup">
              <Button
                bgColor="white"
                w="fit-content"
                color="brand.primary"
                fontSize="20px"
                borderRadius="8px"
                lineHeight="160%"
                fontWeight="700"
                px="12"
                py="4"
                minH="64px"
              >
                Get Started
              </Button>
            </Link>
            <Text>Setup takes just a few minutes.</Text>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default HomeCtaSection;

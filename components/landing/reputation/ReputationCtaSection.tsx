/**
 * ReputationCtaSection — bottom CTA section for the /reputation page.
 *
 * Full-width brand.primary background with BGPatterns overlay.
 * Drives profile signups with a single button.
 */
import { Button, Container, Heading, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import BGPatterns from '@/public/landing/BGPatterns.png';

const ReputationCtaSection = () => {
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
        <Stack
          maxW={{ base: '380px', lg: '800px' }}
          textAlign="center"
          gap="60px"
        >
          <Stack gap="6">
            <Heading
              className="font-display"
              fontWeight="700"
              fontSize={{ base: '40px', md: '48px', lg: '60px' }}
              lineHeight="120%"
            >
              Ready to structure your community reputation?
            </Heading>
            <Text>
              Create your MasterGiver Reputation Profile™ and give your
              community involvement the visibility it deserves.
            </Text>
          </Stack>

          <Stack align="center" gap="4" w="100%">
            <Link href="/business/signup">
              <Button
                bgColor="white"
                w="100%"
                color="brand.primary"
                fontSize={{ base: '16px', lg: '20px' }}
                borderRadius="8px"
                lineHeight="160%"
                fontWeight="700"
                px="12"
                py="4"
                h="auto"
                whiteSpace="normal"
                minH="64px"
              >
                Create Your MasterGiver Reputation Profile™
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default ReputationCtaSection;

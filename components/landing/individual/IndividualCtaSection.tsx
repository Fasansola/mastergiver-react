/**
 * IndividualCtaSection — bottom CTA for the /individual landing page.
 *
 * Typography matches the original Django template:
 *   - bold label: weight 600, uppercase
 *   - big-heading: 3rem / weight 700 / line-height 160%
 *   - big-text: 1.25rem / line-height 160%
 */
import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';

const IndividualCtaSection = () => {
  return (
    <Stack bgColor="white">
      <Container py={{ base: '60px', lg: '100px' }}>
        <Stack align="center" gap={{ base: '5', lg: '6' }} textAlign="center">
          <Text
            fontWeight="600"
            fontSize="1rem"
            lineHeight="160%"
            letterSpacing="0.05em"
            textTransform="uppercase"
            color="brand.primary"
          >
            Join Our Community
          </Text>

          <Heading
            fontWeight="700"
            fontSize={{ base: '9vw', md: '2.6rem', lg: '3rem' }}
            lineHeight="160%"
            color="text.heading"
          >
            Become a MasterGiver.
          </Heading>

          <Text
            fontSize="1.25rem"
            lineHeight="160%"
            color="text.primary"
            maxW="480px"
            pb={{ base: '2', lg: '4' }}
          >
            Create your free profile and show the world just how important
            giving back is to you.
          </Text>

          <Box w={{ base: '100%', lg: 'fit-content' }}>
            <Link href="/signup">
              <Button
                bg="brand.primary"
                color="white"
                fontWeight="700"
                fontSize="1.25rem"
                lineHeight="160%"
                borderRadius="8px"
                px="10"
                h="64px"
                w={{ base: '100%', lg: 'auto' }}
                boxShadow="0px 8px 10px -6px #E2E1FF, 0px 20px 25px -5px #D4D1FF"
                _hover={{ bg: 'brand.primaryHover' }}
              >
                Get Started
              </Button>
            </Link>
          </Box>
        </Stack>
      </Container>
    </Stack>
  );
};

export default IndividualCtaSection;

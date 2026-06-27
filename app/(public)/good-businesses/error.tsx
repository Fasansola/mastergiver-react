'use client';

/**
 * Error boundary for the /good-businesses directory routes.
 *
 * Catches runtime errors (e.g. DB connection failures) and renders
 * a friendly recovery page instead of a raw 500.
 * Logs the error client-side for debugging.
 */

import { useEffect } from 'react';
import { Box, Container, Heading, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { DIRECTORY_HERO_GRADIENT } from '@/lib/theme/gradients';

export default function DirectoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log to console so the error is visible in Vercel's runtime logs
  useEffect(() => {
    console.error('[good-businesses] boundary caught error:', error);
  }, [error]);

  return (
    <Stack
      bg={DIRECTORY_HERO_GRADIENT}
      minH="60vh"
      align="center"
      justify="center"
      py={{ base: '60px', lg: '100px' }}
    >
      <Container>
        <Stack align="center" textAlign="center" gap="6" maxW="480px" mx="auto">
          <Box
            px="14px"
            py="6px"
            borderRadius="100px"
            bg="background.white"
            border="1px solid #DDD8FF"
            display="inline-flex"
            alignItems="center"
            gap="6px"
          >
            <Box w="6px" h="6px" borderRadius="full" bg="brand.primary" />
            <Text
              fontSize="11px"
              fontWeight="700"
              color="#2F2B77"
              className="font-body"
              letterSpacing="0.5px"
              textTransform="uppercase"
            >
              GOOD Businesses™
            </Text>
          </Box>

          <Heading
            as="h1"
            className="font-display"
            fontWeight="700"
            fontSize={{ base: '26px', lg: '34px' }}
            color="#1E1B4B"
            lineHeight="140%"
          >
            Something went wrong
          </Heading>

          <Text
            className="font-body"
            fontSize="16px"
            color="#4B5563"
            lineHeight="170%"
          >
            We couldn&apos;t load the directory right now. Please try again in
            a moment.
          </Text>

          <Stack direction={{ base: 'column', md: 'row' }} gap="3">
            <Box
              as="button"
              onClick={reset}
              bg="brand.primary"
              color="white"
              fontWeight="700"
              fontSize="15px"
              borderRadius="10px"
              h="46px"
              px="8"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontFamily="inherit"
              cursor="pointer"
              boxShadow="0px 4px 14px rgba(47, 43, 119, 0.25)"
              _hover={{ bg: '#3d3899' }}
              transition="background 0.15s"
              aria-label="Try loading the directory again"
            >
              Try again
            </Box>

            <Link href="/">
              <Box
                as="button"
                bg="background.white"
                color="#2F2B77"
                fontWeight="600"
                fontSize="15px"
                borderRadius="10px"
                h="46px"
                px="8"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontFamily="inherit"
                cursor="pointer"
                border="1px solid #DDD8FF"
                _hover={{ bg: '#F5F3FF' }}
                transition="background 0.15s"
              >
                Go home
              </Box>
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
}

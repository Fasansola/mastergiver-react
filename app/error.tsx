/**
 * Global error boundary — catches unhandled runtime errors in the app.
 * Must be a Client Component (Next.js requirement for error boundaries).
 */

'use client';

import { Button, Container, Heading, Stack, Text } from '@chakra-ui/react';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to an error reporting service in production
    console.error(error);
  }, [error]);

  return (
    <Container>
      <Stack
        minH="100vh"
        align="center"
        justify="center"
        textAlign="center"
        gap="6"
      >
        <Heading
          className="font-display"
          fontSize={{ base: '22px', lg: '28px' }}
          fontWeight="700"
          color="text.heading"
        >
          Something went wrong
        </Heading>
        <Text color="text.secondary" maxW="400px">
          An unexpected error occurred. Try refreshing the page or come back
          later.
        </Text>
        <Button
          bg="#2F2B77"
          color="white"
          borderRadius="8px"
          px="8"
          py="4"
          fontWeight="700"
          className="font-body"
          _hover={{ bg: 'brand.primaryHover' }}
          onClick={reset}
        >
          Try again
        </Button>
      </Stack>
    </Container>
  );
}

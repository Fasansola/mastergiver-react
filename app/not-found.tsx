/**
 * Global 404 page — rendered by Next.js whenever notFound() is called
 * or a route does not match any page file.
 */

import { Button, Container, Heading, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import BusinessHeader from '@/components/business/layout/BusinessHeader';

export default function NotFound() {
  return (
    <>
      <BusinessHeader />
      <Container>
        <Stack
          minH="calc(100vh - 100px)"
          align="center"
          justify="center"
          textAlign="center"
          gap="6"
        >
          <Heading
            className="font-display"
            fontSize={{ base: '64px', lg: '96px' }}
            fontWeight="700"
            color="brand.primary"
            lineHeight="1"
          >
            404
          </Heading>
          <Stack gap="2">
            <Heading
              className="font-display"
              fontSize={{ base: '22px', lg: '28px' }}
              fontWeight="700"
              color="text.heading"
            >
              Page not found
            </Heading>
            <Text color="text.secondary" maxW="400px">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </Text>
          </Stack>
          <Button
            asChild
            bg="#2F2B77"
            color="white"
            borderRadius="8px"
            px="8"
            py="4"
            fontWeight="700"
            className="font-body"
            _hover={{ bg: 'brand.primaryHover' }}
          >
            <Link href="/">Go home</Link>
          </Button>
        </Stack>
      </Container>
    </>
  );
}

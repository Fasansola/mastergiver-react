/**
 * Admin route group layout.
 *
 * Protects all /admin/* routes — redirects non-admins to /login.
 * Auth check happens server-side so no flash of content.
 */

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { Box, Container, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import siteLogo from '@/public/brand-assets/Mastergiver_logo.svg';
import type { PropsWithChildren } from 'react';

export default async function AdminLayout({ children }: PropsWithChildren) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <Stack gap="0" minH="100vh" bg="background.subtle">
      {/* Top nav */}
      <Box bg="background.white" borderBottom="1px solid #E8EBFF" py="4">
        <Container maxW="1200px">
          <Flex align="center" justify="space-between">
            <HStack gap="6">
              <Link href="/">
                <Image src={siteLogo} alt="MasterGiver" width={120} height={50} />
              </Link>
              <Box
                px="10px"
                py="3px"
                bg="#F0EEFF"
                borderRadius="6px"
                border="1px solid #DDD8FF"
              >
                <Text fontSize="11px" fontWeight="700" color="#2F2B77" letterSpacing="0.5px" textTransform="uppercase">
                  Admin
                </Text>
              </Box>
            </HStack>

            <HStack gap="6">
              <Link href="/admin/directory">
                <Text fontSize="14px" fontWeight="600" color="#2F2B77" className="font-body">
                  Directory
                </Text>
              </Link>
              <Text fontSize="14px" color="#9CA3AF" className="font-body">
                {session.user.email}
              </Text>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Page content */}
      <Box flex="1" py={{ base: '32px', lg: '48px' }}>
        {children}
      </Box>
    </Stack>
  );
}

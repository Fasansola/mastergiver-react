/**
 * Business dashboard layout — shared by all /business/dashboard/* routes.
 *
 * This Server Component runs after middleware has confirmed a session exists.
 * It then:
 *   1. Fetches the user + their business record from the database
 *   2. Enforces status-based access control:
 *        PENDING   → redirect to /business/confirm   (payment required)
 *        SUSPENDED → redirect to /business/suspended (account suspended)
 *   3. Calculates the profile completion percentage for the sidebar
 *   4. Renders the two-column layout: sidebar (fixed width) + page content (flex-grow)
 */

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { calculateProgress } from '@/lib/business/progress';
import BusinessSidebar from '@/components/business/layout/BusinessSidebar';
import BusinessQueryProvider from '@/components/business/layout/BusinessQueryProvider';
import type { PropsWithChildren } from 'react';
import BusinessHeader from '@/components/business/layout/BusinessHeader';
import { Box, HStack, Stack } from '@chakra-ui/react';

const BusinessDashboardLayout = async ({ children }: PropsWithChildren) => {
  // Read the session — middleware guarantees one exists, but we check defensively
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/business/signin');
  }

  // Fetch the user's business with all data needed for progress + sidebar
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      business: {
        include: {
          // We only need to know whether records exist — select minimal fields
          causes: { select: { id: true } },
          partners: { select: { id: true } },
          communityEvents: { select: { id: true } },
          endorsements: { select: { id: true } },
          offers: { select: { id: true } },
        },
      },
    },
  });

  if (!user?.business) {
    // Authenticated but no linked business — should not happen in normal flow
    redirect('/business/signup');
  }

  const { business } = user;

  // Status-based access control
  if (business.status === 'PENDING') {
    redirect('/business/confirm');
  }

  if (business.status === 'SUSPENDED') {
    redirect('/business/suspended');
  }

  return (
    <Stack gap="0">
      {/* Header receives business data so it can render the mobile sidebar drawer */}
      <BusinessHeader isDashboard={true} />
      <HStack
        minH="calc(100vh - 100px)"
        align="start"
        gap="0"
        justify="stretch"
      >
        {/* Sidebar — hidden on mobile (the header drawer handles it there) */}
        <Box
          display={{ base: 'none', lg: 'flex' }}
          position="sticky"
          top="100px"
          bottom="0"
        >
          <BusinessSidebar />
        </Box>

        {/* Main content area — grows to fill remaining space */}
        <BusinessQueryProvider>
          <Stack
            as="main"
            py={{ base: '6', lg: '10' }}
            pl={{ base: '4', md: '6', lg: '10' }}
            pr={{ base: '4', md: '6', lg: '10' }}
            flexGrow="1"
            minW="0"
          >
            {children}
          </Stack>
        </BusinessQueryProvider>
      </HStack>
    </Stack>
  );
};

export default BusinessDashboardLayout;

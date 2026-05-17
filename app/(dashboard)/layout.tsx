import { HStack, Stack } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Header } from '@/components/layout';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

const DashboardLayout = async ({ children }: PropsWithChildren) => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      profile: { select: { id: true } },
      business: { select: { id: true, status: true } },
    },
  });

  // Business-only user — redirect them to their panel
  if (!user?.profile && user?.business) {
    const status = user.business.status;
    if (status === 'ACTIVE') redirect('/business/dashboard/edit-profile');
    if (status === 'SUSPENDED') redirect('/business/suspended');
    redirect('/business/confirm');
  }

  return (
    <>
      {/* Header only - hidden on lg+ */}
      <Header />
      <HStack minHeight="100vh" gap="0" bg="background.page" alignItems="start">
        {/* Desktop sidebar — hidden on base/md */}
        <Sidebar />

        {/* Main content */}
        <Stack width="100%" flexGrow="1" minH="100vh">
          {children}
        </Stack>
      </HStack>
    </>
  );
};

export default DashboardLayout;

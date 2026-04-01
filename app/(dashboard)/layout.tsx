import { HStack, Stack } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import SidebarContent from '@/components/dashboard/SidebarContent';
import SidebarDrawer from '@/components/dashboard/SidebarDrawer';
import { Header } from '@/components/layout';

const DashboardLayout = ({ children }: PropsWithChildren) => {
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

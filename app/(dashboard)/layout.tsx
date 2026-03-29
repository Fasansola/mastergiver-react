import { HStack, Stack } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import Sidebar from '@/components/layout/dashboard/Sidebar';
import SidebarContent from '@/components/layout/dashboard/SidebarContent';
import SidebarDrawer from '@/components/layout/dashboard/SidebarDrawer';

const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <HStack minHeight="100vh" gap="0" bg="background.page" alignItems="start">
      {/* Desktop sidebar — hidden on base/md */}
      <Sidebar />

      {/* Main content */}
      <Stack width="100%" flexGrow="1" minH="100vh">
        {/* Mobile top bar + sidebar drawer — hidden on lg+ */}
        <SidebarDrawer>
          <SidebarContent />
        </SidebarDrawer>

        {children}
      </Stack>
    </HStack>
  );
};

export default DashboardLayout;

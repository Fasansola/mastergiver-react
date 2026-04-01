import { Stack } from '@chakra-ui/react';
import SidebarContent from './SidebarContent';

const Sidebar = () => {
  return (
    <Stack
      w="25%"
      maxW="264px"
      minHeight="100vh"
      maxH="100vh"
      position="sticky"
      top="0"
      bottom="0"
      bgColor="brand.primary"
      display={{ base: 'none', lg: 'flex' }}
    >
      <SidebarContent />
    </Stack>
  );
};

export default Sidebar;

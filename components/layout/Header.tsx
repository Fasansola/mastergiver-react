import { Box, Button, Container, Flex, HStack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import HeaderButtons from './HeaderButtons';
import HeaderMobileMenu from './HeaderMobileMenu';
import logo from '@/public/brand-assets/Mastergiver_logo.svg';
import { SidebarContent } from '../dashboard';
import { getCurrentUser } from '@/lib/auth/session';

const Header = async () => {
  const user = await getCurrentUser();
  return (
    <Flex
      height={100}
      align="center"
      justify="center"
      bg="background.white"
      borderColor="border.accentBorder"
      borderWidth="1px"
    >
      <Container className="flex align-middle justify-between">
        <Link href="/">
          <HStack align="start">
            <Image src={logo} alt="MasterGiver Logo" width={140} height={60} />
            <Text fontSize="12px">BETA</Text>
          </HStack>
        </Link>

        {/* Desktop nav buttons — hidden on mobile */}
        <Box display={{ base: 'none', lg: 'flex' }} alignItems="center">
          <HeaderButtons />
        </Box>

        {/* Mobile hamburger + drawer — hidden on desktop */}
        <Box display={{ base: 'flex', lg: 'none' }} alignItems="center">
          {user && user.onboarding?.isCompleted ? (
            <HeaderMobileMenu>
              <SidebarContent />
            </HeaderMobileMenu>
          ) : user?.onboarding?.isCompleted === false ? null : (
            <Button
              variant="ghost"
              colorPalette="brand"
              asChild
              p="0"
              pr="2"
              fontSize="sm"
            >
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </Box>
      </Container>
    </Flex>
  );
};

export default Header;

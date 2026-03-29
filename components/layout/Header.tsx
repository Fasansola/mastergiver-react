import { Box, Container, Flex } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import HeaderButtons from './HeaderButtons';
import HeaderMobileMenu from './HeaderMobileMenu';
import logo from '@/public/brand-assets/Mastergiver_logo.svg';

const Header = () => {
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
          <Image src={logo} alt="MasterGiver Logo" width={140} height={60} />
        </Link>

        {/* Desktop nav buttons — hidden on mobile */}
        <Box display={{ base: 'none', lg: 'flex' }} alignItems="center">
          <HeaderButtons />
        </Box>

        {/* Mobile hamburger + drawer — hidden on desktop */}
        <Box display={{ base: 'flex', lg: 'none' }} alignItems="center">
          <HeaderMobileMenu />
        </Box>
      </Container>
    </Flex>
  );
};

export default Header;

import { Flex, Container } from '@chakra-ui/react';
import Image from 'next/image';
import HeaderButtons from './HeaderButtons';

import logo from '@/public/brand-assets/Mastergiver_logo.svg';
import Link from 'next/link';

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
        <HeaderButtons />
      </Container>
    </Flex>
  );
};

export default Header;

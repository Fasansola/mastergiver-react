'use client';

import { Flex, Button } from '@chakra-ui/react';
import Link from 'next/link';

const HeaderButtons = () => {
  return (
    <Flex gap="2">
      <Button variant="ghost" as={Link} href="/login" colorPalette="brand">
        Login
      </Button>
      <Button variant="solid" as={Link} href="/signup" colorPalette="brand">
        Sign Up
      </Button>
    </Flex>
  );
};

export default HeaderButtons;

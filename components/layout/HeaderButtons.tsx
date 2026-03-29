'use client';

import { Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';

interface HeaderButtonsProps {
  direction?: 'row' | 'column';
}

const HeaderButtons = ({ direction = 'row' }: HeaderButtonsProps) => {
  return (
    <Flex gap="2" direction={direction}>
      <Button variant="ghost" colorPalette="brand" asChild>
        <Link href="/login">Login</Link>
      </Button>
      <Button variant="solid" colorPalette="brand" color="text.white" asChild>
        <Link href="/signup">Sign Up</Link>
      </Button>
    </Flex>
  );
};

export default HeaderButtons;

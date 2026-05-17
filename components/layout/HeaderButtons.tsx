'use client';

import { Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';

interface HeaderButtonsProps {
  direction?: 'row' | 'column';
  isLoggedIn?: boolean;
  dashboardHref?: string;
}

const HeaderButtons = ({ direction = 'row', isLoggedIn, dashboardHref = '/dashboard' }: HeaderButtonsProps) => {
  if (isLoggedIn) {
    return (
      <Flex gap="2" direction={direction}>
        <Button variant="solid" colorPalette="brand" color="text.white" asChild>
          <Link href={dashboardHref}>Dashboard</Link>
        </Button>
      </Flex>
    );
  }

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

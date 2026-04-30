/**
 * Auth buttons for the business panel header — rendered when no business
 * session is active on public pages (home, /business/[slug]).
 *
 * Points to /business/signin and /business/signup, not the individual
 * user auth routes.
 */

'use client';

import { Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';

interface BusinessHeaderButtonsProps {
  direction?: 'row' | 'column';
}

const BusinessHeaderButtons = ({
  direction = 'row',
}: BusinessHeaderButtonsProps) => {
  return (
    <Flex gap="3" direction={direction} align="center">
      {/* Mobile: "Sign in" — hidden at lg+ */}
      <Button
        asChild
        display={{ base: 'flex', lg: 'none' }}
        variant="ghost"
        bg="transparent"
        color="text.primary"
        fontWeight="700"
        className="font-body"
        px="3"
        _hover={{ bg: 'transparent', opacity: 0.7 }}
      >
        <Link href="/business/signin">Log In</Link>
      </Button>

      {/* Desktop: "Login" — hidden below lg */}
      <Button
        asChild
        display={{ base: 'none', lg: 'flex' }}
        variant="ghost"
        bg="transparent"
        color="text.primary"
        fontWeight="700"
        className="font-body"
        _hover={{ bg: 'transparent', opacity: 0.7 }}
      >
        <Link href="/business/signin">Login</Link>
      </Button>

      {/* Sign Up — primary filled, visible on all breakpoints */}
      <Button
        asChild
        display="flex"
        bg="#2F2B77"
        color="white"
        h="56px"
        borderRadius="8px"
        px="8"
        py="4"
        gap="2"
        fontWeight="700"
        className="font-body"
        _hover={{ bg: 'brand.primaryHover' }}
      >
        <Link href="/business/signup">Sign Up</Link>
      </Button>
    </Flex>
  );
};

export default BusinessHeaderButtons;

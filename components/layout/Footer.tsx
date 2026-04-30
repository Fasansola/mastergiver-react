import {
  Box,
  Container,
  Heading,
  HStack,
  Separator,
  Stack,
  Text,
} from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';

import logo from '@/public/brand-assets/Mastergiver_logo.svg';
import MapIcon from '@/public/components-assets/map.svg';
import MailIcon from '@/public/components-assets/mail.svg';

import FacebookIcon from '@/public/socials/Facebook.svg';
import InstagramIcon from '@/public/socials/Instagram.svg';
import TwitterIcon from '@/public/socials/Twitter.svg';
import LinkedInIcon from '@/public/socials/LinkedIn.svg';

import FooterNavItem from './FooterNavItem';

const Footer = () => {
  return (
    <Stack id="site-footer" bgColor="white" gap="0">
      <Container py={{ base: '60px', lg: '100px' }}>
        {/* Logo + nav columns */}
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          align="start"
          gap={{ base: '12', lg: '0' }}
        >
          <Box w={{ base: '100%', lg: '20%' }}>
            <Link href="/">
              <Image src={logo} alt="MasterGiver Logo" />
            </Link>
          </Box>

          {/* Nav columns */}
          <Stack
            direction={{ base: 'column', md: 'row' }}
            align="start"
            justify={{ md: 'space-between' }}
            w={{ base: '100%', lg: '80%' }}
            gap={{ base: '10', md: '0' }}
          >
            <Stack gap="6">
              <Heading
                className="font-body"
                fontWeight="700"
                color="text.primary"
              >
                Products
              </Heading>
              <Stack gap="4">
                <FooterNavItem href="/">Home</FooterNavItem>
                {/* <FooterNavItem href="/individual">Individuals</FooterNavItem> */}
                <FooterNavItem href="/reputation">
                  Community Impact and Reputation
                </FooterNavItem>
              </Stack>
            </Stack>

            <Separator
              orientation="vertical"
              h="158px"
              borderColor="border.default"
              display={{ base: 'none', md: 'block' }}
            />

            <Stack gap="6">
              <Heading
                className="font-body"
                fontWeight="700"
                color="text.primary"
              >
                Company
              </Heading>
              <Stack gap="4">
                <FooterNavItem href="/">About MasterGiver</FooterNavItem>
                <FooterNavItem href="/partner">Partner</FooterNavItem>
              </Stack>
            </Stack>

            <Separator
              orientation="vertical"
              h="158px"
              borderColor="border.default"
              display={{ base: 'none', md: 'block' }}
            />

            <Stack gap="6">
              <Heading
                className="font-body"
                fontWeight="700"
                color="text.primary"
              >
                Legal
              </Heading>
              <Stack gap="4">
                <FooterNavItem href="/terms">Terms of use</FooterNavItem>
                <FooterNavItem href="/privacy">Privacy</FooterNavItem>
              </Stack>
            </Stack>

            <Separator
              orientation="vertical"
              h="158px"
              borderColor="border.default"
              display={{ base: 'none', md: 'block' }}
            />

            <Stack gap="6">
              <Heading
                className="font-body"
                fontWeight="700"
                color="text.primary"
              >
                Contact Info
              </Heading>
              <Stack gap="4">
                <FooterNavItem
                  href="mailto:support@mastergiver.com"
                  image={MailIcon}
                >
                  support@mastergiver.com
                </FooterNavItem>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Container>

      <Separator borderColor="border.default" />

      {/* Copyright + social icons */}
      <Container py="8">
        <HStack justify="space-between" flexWrap="wrap" gap="4">
          <Text className="font-body" fontWeight="500" lineHeight="180%">
            &copy; 2026 MasterGiver. All rights reserved.
          </Text>
          <HStack gap="6">
            <Link target="_blank" href="/">
              <Image src={LinkedInIcon} alt="MasterGiver Linkedin" />
            </Link>
            <Link target="_blank" href="/">
              <Image src={InstagramIcon} alt="MasterGiver Instagram" />
            </Link>
            <Link target="_blank" href="/">
              <Image src={TwitterIcon} alt="MasterGiver Twitter or X" />
            </Link>
            <Link target="_blank" href="/">
              <Image src={FacebookIcon} alt="MasterGiver Facebook" />
            </Link>
          </HStack>
        </HStack>
      </Container>
    </Stack>
  );
};

export default Footer;

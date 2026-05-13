/**
 * DirectoryCta
 *
 * Bottom CTA section for the GOOD Businesses directory pages.
 * Prompts businesses to create their reputation profile.
 */

import { Box, Container, HStack, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { LuShieldCheck, LuTrendingUp, LuUsers } from 'react-icons/lu';

const BENEFITS = [
  { icon: <LuShieldCheck size={16} />, label: 'Verified community impact' },
  { icon: <LuTrendingUp size={16} />, label: 'Search & AI visibility' },
  { icon: <LuUsers size={16} />, label: 'Trust signals that convert' },
];

const DirectoryCta = () => {
  return (
    <Stack
      bg="linear-gradient(135deg, #2F2B77 0%, #1E1B4B 100%)"
      py={{ base: '56px', md: '72px', lg: '88px' }}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative ring */}
      <Box
        position="absolute"
        top="-160px"
        right="-160px"
        w="500px"
        h="500px"
        borderRadius="full"
        border="1px solid rgba(255,255,255,0.06)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-100px"
        left="-100px"
        w="360px"
        h="360px"
        borderRadius="full"
        border="1px solid rgba(255,255,255,0.04)"
        pointerEvents="none"
      />

      <Container position="relative">
        <Stack align="center" textAlign="center" gap="8" maxW="620px" mx="auto">
          <Text
            className="font-body"
            fontSize="12px"
            fontWeight="700"
            color="#A5B4FC"
            letterSpacing="0.8px"
            textTransform="uppercase"
          >
            Is Your Business Listed?
          </Text>

          <Text
            className="font-display"
            fontWeight="700"
            fontSize={{ base: '28px', lg: '40px' }}
            lineHeight="115%"
            color="white"
            letterSpacing="-0.3px"
          >
            Turn Your Community Impact Into a Reputation Asset
          </Text>

          <Text
            className="font-body"
            fontSize={{ base: '15px', lg: '17px' }}
            lineHeight="175%"
            color="#C7C4FF"
            maxW="480px"
          >
            Get your GOOD Business Reputation Profile and start appearing in the
            directory.
          </Text>

          {/* Benefit pills */}
          <HStack gap="3" flexWrap="wrap" justify="center">
            {BENEFITS.map((b) => (
              <HStack
                key={b.label}
                gap="2"
                bg="rgba(255,255,255,0.08)"
                border="1px solid rgba(255,255,255,0.12)"
                borderRadius="100px"
                px="14px"
                py="7px"
              >
                <Box color="#A5B4FC" display="flex">
                  {b.icon}
                </Box>
                <Text
                  fontSize="13px"
                  fontWeight="600"
                  color="white"
                  className="font-body"
                >
                  {b.label}
                </Text>
              </HStack>
            ))}
          </HStack>

          <Link href="/business/signup">
            <Box
              as="button"
              bg="white"
              color="#2F2B77"
              fontWeight="700"
              fontSize="16px"
              borderRadius="12px"
              h="58px"
              px="10"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontFamily="inherit"
              cursor="pointer"
              letterSpacing="0.1px"
              boxShadow="0px 8px 24px rgba(0,0,0,0.20)"
              _hover={{ bg: '#F0EEFF' }}
              transition="background 0.15s"
            >
              Get Your Reputation Profile →
            </Box>
          </Link>

          <Text className="font-body" fontSize="13px" color="#7C7AB8">
            $59/year · No calls · No commitments
          </Text>
        </Stack>
      </Container>
    </Stack>
  );
};

export default DirectoryCta;

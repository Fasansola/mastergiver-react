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
  { icon: <LuShieldCheck size={18} />, label: 'Verified community impact' },
  { icon: <LuTrendingUp size={18} />, label: 'Search & AI visibility' },
  { icon: <LuUsers size={18} />, label: 'Build customer trust' },
];

const DirectoryCta = () => {
  return (
    <Stack
      bg="linear-gradient(135deg, #2F2B77 0%, #1E1B4B 100%)"
      py={{ base: '64px', md: '80px', lg: '100px' }}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative rings */}
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
        <Stack align="center" textAlign="center" gap={{ base: '6', lg: '8' }} maxW="700px" mx="auto">

          {/* Label */}
          <Text
            className="font-body"
            fontSize={{ base: '12px', lg: '13px' }}
            fontWeight="700"
            color="#A5B4FC"
            letterSpacing="0.8px"
            textTransform="uppercase"
          >
            Own Your Community Reputation
          </Text>

          {/* Headline */}
          <Text
            className="font-display"
            fontWeight="700"
            fontSize={{ base: '30px', md: '40px', lg: '48px' }}
            lineHeight="130%"
            color="white"
            letterSpacing="-0.5px"
          >
            Turn Your Community Impact Into a Reputation Asset
          </Text>

          {/* Supporting copy */}
          <Text
            className="font-body"
            fontSize={{ base: '16px', lg: '18px' }}
            lineHeight="175%"
            color="#C7C4FF"
            maxW="520px"
          >
            Showcase verified community involvement, strengthen your reputation,
            and help customers discover your business.
          </Text>

          {/* Ecosystem reinforcement */}
          <Text
            className="font-body"
            fontSize={{ base: '13px', lg: '15px' }}
            lineHeight="170%"
            color="#8B87C4"
            maxW="480px"
          >
            Join businesses across growing communities already building their
            reputation with MasterGiver.
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
                px="16px"
                py="8px"
              >
                <Box color="#A5B4FC" display="flex">
                  {b.icon}
                </Box>
                <Text
                  fontSize={{ base: '13px', lg: '14px' }}
                  fontWeight="600"
                  color="white"
                  className="font-body"
                >
                  {b.label}
                </Text>
              </HStack>
            ))}
          </HStack>

          {/* CTA button */}
          <Link href="/business/signup">
            <Box
              as="button"
              bg="white"
              color="#2F2B77"
              fontWeight="700"
              fontSize={{ base: '16px', lg: '18px' }}
              borderRadius="12px"
              h={{ base: '58px', lg: '64px' }}
              px={{ base: '10', lg: '12' }}
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


        </Stack>
      </Container>
    </Stack>
  );
};

export default DirectoryCta;

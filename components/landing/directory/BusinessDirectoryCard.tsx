/**
 * BusinessDirectoryCard
 *
 * Card shown in the GOOD Businesses directory hub and city pages.
 * Clean, premium layout: large logo/avatar, company name, location
 * with map pin, tagline, cause chips, and a ghost-style CTA that
 * links to the existing /business/[slug] profile.
 */

import { Box, HStack, Separator, Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { LuMapPin, LuArrowRight } from 'react-icons/lu';
import type { DirectoryBusiness } from '@/lib/directory';

interface Props {
  business: DirectoryBusiness;
}

const MAX_CAUSES = 4;

const BusinessDirectoryCard = ({ business }: Props) => {
  const { slug, companyName, logo, city, state, tagline, causes } = business;

  const name = companyName ?? 'Business';
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();

  const location = [city, state].filter(Boolean).join(', ');
  const visibleCauses = causes.slice(0, MAX_CAUSES);
  const extraCount = causes.length - MAX_CAUSES;

  return (
    <Stack
      bg="white"
      borderRadius="20px"
      overflow="hidden"
      border="1px solid #EBEBF5"
      h="100%"
      justify="space-between"
      transition="transform 0.18s, box-shadow 0.18s"
      boxShadow="0px 1px 4px rgba(47, 43, 119, 0.06)"
      _hover={{
        transform: 'translateY(-3px)',
        boxShadow: '0px 12px 36px rgba(47, 43, 119, 0.12)',
        borderColor: '#D4D0F5',
      }}
    >
      {/* Card body */}
      <Stack gap="0" flex="1">
        {/* Header area — logo + name + location */}
        <HStack gap="4" p={{ base: '4', md: '6' }} pb={{ base: '3', md: '5' }} align="start">
          {/* Logo / initials */}
          {logo ? (
            <Box
              w="64px"
              h="64px"
              borderRadius="14px"
              overflow="hidden"
              position="relative"
              flexShrink="0"
              border="1px solid #F0EEF8"
            >
              <Image
                src={logo}
                alt={`${name} logo`}
                fill
                sizes="64px"
                style={{ objectFit: 'cover' }}
              />
            </Box>
          ) : (
            <Box
              w="64px"
              h="64px"
              borderRadius="14px"
              bg="linear-gradient(145deg, #3730A3 0%, #2F2B77 60%, #4C46A8 100%)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink="0"
            >
              <Text
                color="white"
                fontWeight="700"
                fontSize="20px"
                lineHeight="1"
                className="font-body"
                letterSpacing="-0.5px"
              >
                {initials}
              </Text>
            </Box>
          )}

          <Stack gap="1" minW="0" pt="1">
            <Text
              fontWeight="700"
              fontSize="15px"
              lineHeight="130%"
              color="#1A1730"
              className="font-body"
              style={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
              }}
            >
              {companyName}
            </Text>
            {location && (
              <HStack gap="1" align="center">
                <Box color="#9CA3AF" display="flex">
                  <LuMapPin size={11} />
                </Box>
                <Text fontSize="12px" color="#9CA3AF" className="font-body">
                  {location}
                </Text>
              </HStack>
            )}
          </Stack>
        </HStack>

        {/* Tagline + causes */}
        <Stack gap="4" px={{ base: '4', md: '6' }} pb={{ base: '4', md: '6' }}>
          {tagline && (
            <Text
              fontSize="13px"
              lineHeight="170%"
              color="#4B5563"
              className="font-body"
              style={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3,
              }}
            >
              {tagline}
            </Text>
          )}

          {visibleCauses.length > 0 && (
            <HStack gap="2" flexWrap="wrap">
              {visibleCauses.map((bc) => (
                <Box
                  key={bc.cause.name}
                  px="9px"
                  py="3px"
                  borderRadius="100px"
                  bg="#F4F2FF"
                  border="1px solid #E2DFFF"
                >
                  <Text
                    fontSize="11px"
                    fontWeight="600"
                    color="#5B52C0"
                    className="font-body"
                    letterSpacing="0.1px"
                  >
                    {bc.cause.name}
                  </Text>
                </Box>
              ))}
              {extraCount > 0 && (
                <Text
                  fontSize="11px"
                  color="#9CA3AF"
                  className="font-body"
                  fontWeight="500"
                >
                  +{extraCount} more
                </Text>
              )}
            </HStack>
          )}
        </Stack>
      </Stack>

      {/* Divider + CTA */}
      <Box>
        <Separator borderColor="#F0EEF8" />
        <Link href={`/business/${slug}`} style={{ display: 'block' }}>
          <HStack
            px="6"
            py="4"
            justify="space-between"
            align="center"
            _hover={{ bg: '#FAFAFE' }}
            transition="background 0.15s"
            cursor="pointer"
          >
            <Text
              fontSize="13px"
              fontWeight="700"
              color="#2F2B77"
              className="font-body"
              letterSpacing="0.1px"
            >
              View Reputation Profile
            </Text>
            <Box color="#2F2B77" display="flex">
              <LuArrowRight size={15} />
            </Box>
          </HStack>
        </Link>
      </Box>
    </Stack>
  );
};

export default BusinessDirectoryCard;

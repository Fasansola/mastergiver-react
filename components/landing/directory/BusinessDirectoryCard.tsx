/**
 * BusinessDirectoryCard
 *
 * Card shown in the GOOD Businesses directory hub and city pages.
 * Layout (per design): logo + name/location + bookmark icon in header,
 * tagline, cause chips, then a bottom bar with the verified badge on
 * the left and a "View Reputation Profile →" CTA on the right.
 */

import { Box, HStack, Separator, Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { LuMapPin, LuArrowRight, LuBookmark } from 'react-icons/lu';
import type { DirectoryBusiness } from '@/lib/directory';
import VerifiedIcon from '@/public/brand-assets/VerifiedBusinessImpact.svg';

interface Props {
  business: DirectoryBusiness;
}

const MAX_CAUSES = 3;

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
    <Link href={`/business/${slug}`} style={{ display: 'block', height: '100%', cursor: 'pointer' }}>
      <Stack
        bg="white"
        borderRadius="20px"
        border="1px solid #EBEBF5"
        h="100%"
        justify="space-between"
        cursor="pointer"
        transition="transform 0.18s, box-shadow 0.18s"
        boxShadow="0px 1px 4px rgba(47, 43, 119, 0.06)"
        _hover={{
          transform: 'translateY(-3px)',
          boxShadow: '0px 12px 36px rgba(47, 43, 119, 0.12)',
          borderColor: '#D4D0F5',
        }}
      >
        {/* Card body */}
        <Stack gap="4" p={{ base: '4', md: '5' }} flex="1">

          {/* Header: logo + name/location + bookmark */}
          <HStack gap="3" align="start" justify="space-between">
            <HStack gap="3" align="start" flex="1" minW="0">
              {/* Logo / initials avatar */}
              {logo ? (
                <Box
                  w="72px"
                  h="72px"
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
                    sizes="72px"
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
              ) : (
                <Box
                  w="72px"
                  h="72px"
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
                    fontSize="22px"
                    lineHeight="1"
                    className="font-body"
                    letterSpacing="-0.5px"
                  >
                    {initials}
                  </Text>
                </Box>
              )}

              {/* Company name + location */}
              <Stack gap="1" minW="0" pt="1">
                <Text
                  fontWeight="700"
                  fontSize={{ base: '16px', md: '18px' }}
                  lineHeight="130%"
                  color="#1A1730"
                  className="font-display"
                  lineClamp={2}
                >
                  {name}
                </Text>
                {location && (
                  <HStack gap="1" align="center">
                    <Box color="#9CA3AF" display="flex">
                      <LuMapPin size={12} />
                    </Box>
                    <Text fontSize="12px" color="#9CA3AF" className="font-body">
                      {location}
                    </Text>
                  </HStack>
                )}
              </Stack>
            </HStack>

            {/* Bookmark icon */}
            <Box color="#C4C0F0" flexShrink="0" display="flex" pt="1">
              <LuBookmark size={18} />
            </Box>
          </HStack>

          {/* Tagline */}
          {tagline && (
            <Text
              fontSize="13px"
              lineHeight="160%"
              color="#6B7280"
              className="font-body"
              lineClamp={2}
            >
              {tagline}
            </Text>
          )}

          {/* Cause chips */}
          {visibleCauses.length > 0 && (
            <HStack gap="2" flexWrap="wrap">
              {visibleCauses.map((bc) => (
                <Box
                  key={bc.cause.name}
                  px="10px"
                  py="4px"
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

        {/* Bottom bar: verified badge + CTA */}
        <Box>
          <Separator borderColor="#F0EEF8" />
          <HStack px="5" py="4" justify="space-between" align="center" gap="3">
            {/* Verified badge */}
            <HStack gap="3" align="center" flex="1" minW="0">
              <Image
                src={VerifiedIcon}
                alt="Verified Community Impact"
                width={36}
                height={36}
              />
              <Stack gap="0" minW="0">
                <Text
                  fontSize="12px"
                  fontWeight="700"
                  color="#1A1730"
                  className="font-body"
                  lineClamp={1}
                >
                  Verified Community Impact
                </Text>
                <Text fontSize="11px" color="#9CA3AF" className="font-body">
                  Proud to support our community.
                </Text>
              </Stack>
            </HStack>

            {/* View profile CTA */}
            <HStack gap="1" flexShrink="0">
              <Text
                fontSize="13px"
                fontWeight="700"
                color="#2F2B77"
                className="font-body"
                whiteSpace="nowrap"
              >
                View Reputation Profile
              </Text>
              <Box color="#2F2B77" display="flex">
                <LuArrowRight size={14} />
              </Box>
            </HStack>
          </HStack>
        </Box>
      </Stack>
    </Link>
  );
};

export default BusinessDirectoryCard;

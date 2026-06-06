/**
 * BusinessDirectoryCard
 *
 * Card shown in the GOOD Businesses directory hub and city pages.
 * Layout (per design): logo + name/location in header, tagline, cause chips,
 * then a bottom bar with the verified badge on the left and a
 * "View Reputation Profile →" CTA on the right.
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
    <Link
      href={`/business/${slug}`}
      style={{ display: 'block', height: '100%', cursor: 'pointer' }}
    >
      <Stack
        bg="background.white"
        borderRadius={{ base: '16px', md: '20px' }}
        border="1px solid"
        borderColor="directory.cardBorder"
        h="100%"
        justify="space-between"
        cursor="pointer"
        transition="transform 0.18s, box-shadow 0.18s"
        boxShadow="0px 1px 4px rgba(47, 43, 119, 0.06)"
        p={{ base: '4', md: '6', lg: '8' }}
        gap={{ base: '4', md: '6' }}
        _hover={{
          transform: 'translateY(-3px)',
          boxShadow: '0px 12px 36px rgba(47, 43, 119, 0.12)',
          borderColor: 'directory.cardBorderHover',
        }}
      >
        {/* Card body */}
        <Stack gap={{ base: '3', md: '4' }} flex="1">
          {/* Header: logo + name/location */}
          <HStack gap="3" align="center">
            {/* Logo / initials avatar */}
            {logo ? (
              <Box
                w={{ base: '56px', md: '72px' }}
                h={{ base: '56px', md: '72px' }}
                borderRadius={{ base: '12px', md: '14px' }}
                overflow="hidden"
                position="relative"
                flexShrink="0"
                border="1px solid"
                borderColor="directory.logoBorder"
              >
                <Image
                  src={logo}
                  alt={`${name} logo`}
                  fill
                  sizes="72px"
                  style={{ objectFit: 'contain' }}
                />
              </Box>
            ) : (
              <Box
                w={{ base: '56px', md: '72px' }}
                h={{ base: '56px', md: '72px' }}
                borderRadius={{ base: '12px', md: '14px' }}
                bg="linear-gradient(145deg, #3730A3 0%, #2F2B77 60%, #4C46A8 100%)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink="0"
              >
                <Text
                  color="white"
                  fontWeight="700"
                  fontSize={{ base: '18px', md: '22px' }}
                  lineHeight="1"
                  className="font-body"
                  letterSpacing="-0.5px"
                >
                  {initials}
                </Text>
              </Box>
            )}

            {/* Company name + location */}
            <Stack gap="1" minW="0">
              <Text
                fontWeight="700"
                fontSize={{ base: '15px', md: '18px' }}
                lineHeight="130%"
                color="directory.heading"
                className="font-display"
                lineClamp={2}
              >
                {name}
              </Text>
              {location && (
                <HStack gap="1" align="center">
                  <Box color="directory.muted" display="flex" flexShrink="0">
                    <LuMapPin size={12} />
                  </Box>
                  <Text fontSize="12px" color="directory.muted" className="font-body">
                    {location}
                  </Text>
                </HStack>
              )}
            </Stack>
          </HStack>

          {/* Tagline */}
          {tagline && (
            <Text
              fontSize={{ base: '12px', md: '13px' }}
              lineHeight="160%"
              color="directory.body"
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
                  bg="directory.chipBg"
                  border="1px solid"
                  borderColor="directory.chipBorder"
                >
                  <Text
                    fontSize="11px"
                    fontWeight="600"
                    color="directory.chipText"
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
                  color="directory.muted"
                  className="font-body"
                  fontWeight="500"
                >
                  +{extraCount} more
                </Text>
              )}
            </HStack>
          )}
        </Stack>

        <Separator borderColor="directory.separator" />

        {/* Bottom bar: verified badge + CTA */}
        <Stack
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'start', md: 'center' }}
          gap={{ base: '3', md: '3' }}
        >
          {/* Verified badge */}
          <HStack gap="3" align="center" flex="1" minW="0">
            {/* Inlined SVG — avoids public path resolution issues across environments */}
            <svg
              width="44"
              height="44"
              viewBox="0 0 160 166"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ flexShrink: 0 }}
              aria-hidden="true"
            >
              <circle cx="80" cy="83" r="74" fill="#F0ECFF" />
              <path
                d="M80 43 C69.5 50.5 57.8 54.5 46 55.5 V78.5 C46 101.5 59.5 119.5 80 128 C100.5 119.5 114 101.5 114 78.5 V55.5 C102.2 54.5 90.5 50.5 80 43Z"
                stroke="#5542D6"
                strokeWidth="5"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M63 82.5L75.5 95L98 70"
                stroke="#5542D6"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>

            <Stack gap="0.5" minW="0">
              <Text
                fontSize="12px"
                fontWeight="700"
                color="directory.heading"
                className="font-body"
                lineHeight="140%"
                lineClamp={1}
              >
                Verified Community Impact
              </Text>
              <Text
                fontSize="10px"
                color="directory.muted"
                className="font-body"
                lineHeight="130%"
              >
                Proud to support our community.
              </Text>
            </Stack>
          </HStack>

          {/* View profile CTA */}
          <HStack gap="1" flexShrink="0">
            <Text
              fontSize="12px"
              fontWeight="700"
              color="brand.primary"
              className="font-body"
              whiteSpace="nowrap"
            >
              View Reputation Profile
            </Text>
            <Box color="brand.primary" display="flex">
              <LuArrowRight size={14} />
            </Box>
          </HStack>
        </Stack>
      </Stack>
    </Link>
  );
};

export default BusinessDirectoryCard;

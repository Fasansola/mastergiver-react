'use client';

/**
 * DirectorySearchClient
 *
 * City search with typeahead for the GOOD Businesses directory hero.
 * Accepts the full list of city groups (passed from server) and filters
 * client-side as the user types. Clicking a result navigates to
 * /good-businesses/[citySlug].
 */

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, HStack, Stack, Text } from '@chakra-ui/react';
import { LuSearch, LuMapPin } from 'react-icons/lu';
import type { CityGroup } from '@/lib/directory';

interface Props {
  cities: CityGroup[];
}

const DirectorySearchClient = ({ cities }: Props) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered =
    query.trim().length > 0
      ? cities
          .filter((c) =>
            `${c.city}, ${c.state}`
              .toLowerCase()
              .includes(query.toLowerCase())
          )
          .slice(0, 7)
      : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (slug: string) => {
    setOpen(false);
    setQuery('');
    router.push(`/good-businesses/${slug}`);
  };

  return (
    <Box ref={containerRef} position="relative" w="100%" maxW="540px">
      {/* Input row */}
      <HStack
        bg="white"
        borderRadius="14px"
        border="1.5px solid #E0E7FF"
        px="5"
        gap="3"
        boxShadow="0px 4px 24px rgba(47, 43, 119, 0.12)"
        transition="all 0.15s"
        _focusWithin={{
          borderColor: '#2F2B77',
          boxShadow: '0px 4px 28px rgba(47, 43, 119, 0.22)',
        }}
      >
        {/* Search icon */}
        <Box color="#9CA3AF" flexShrink="0" display="flex" alignItems="center">
          <LuSearch size={18} />
        </Box>

        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search by city..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '16px',
            fontFamily: 'inherit',
            color: '#27262D',
            padding: '17px 0',
          }}
        />

      </HStack>

      {/* Dropdown results */}
      {open && filtered.length > 0 && (
        <Stack
          position="absolute"
          top="calc(100% + 10px)"
          left="0"
          right="0"
          bg="white"
          borderRadius="14px"
          border="1px solid #EEF2FF"
          boxShadow="0px 12px 40px rgba(47, 43, 119, 0.14)"
          zIndex="50"
          gap="0"
          overflow="hidden"
        >
          {filtered.map((c) => (
            <HStack
              key={c.slug}
              px="20px"
              py="13px"
              gap="3"
              cursor="pointer"
              _hover={{ bg: '#F5F3FF' }}
              onClick={() => handleSelect(c.slug)}
              borderBottom="1px solid #F3F4F6"
              _last={{ borderBottom: 'none' }}
              align="center"
            >
              <Box color="#2F2B77" flexShrink="0" display="flex">
                <LuMapPin size={14} />
              </Box>
              <Box flex="1">
                <Text
                  fontSize="15px"
                  fontWeight="600"
                  color="#27262D"
                  className="font-body"
                >
                  {c.city}, {c.state}
                </Text>
                <Text fontSize="12px" color="#9CA3AF" className="font-body">
                  {c.count} {c.count === 1 ? 'business' : 'businesses'}
                </Text>
              </Box>
            </HStack>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default DirectorySearchClient;

'use client';

/**
 * DirectorySearchClient
 *
 * City search with typeahead for the GOOD Businesses directory hero.
 * Filters client-side as the user types, matching on the START of the
 * city name so "C" shows Charleston/Charlotte but not Wilmington.
 *
 * Results show business count for active cities, "Coming Soon" for
 * supported cities with no active businesses yet.
 *
 * Keyboard: ArrowDown/Up to move, Enter to select, Escape to close.
 */

import { useState, useRef, useEffect, useId } from 'react';
import { useRouter } from 'next/navigation';
import { Box, HStack, Stack, Text } from '@chakra-ui/react';
import { LuSearch, LuMapPin, LuArrowRight } from 'react-icons/lu';
import type { CityGroup } from '@/lib/directory';

interface Props {
  cities: CityGroup[];
}

const DirectorySearchClient = ({ cities }: Props) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const optionId = (slug: string) => `city-opt-${slug}`;

  const filtered =
    query.trim().length > 0
      ? cities
          .filter((c) =>
            // Match from the START of the city name — "C" shows Charleston
            // but not Wilmington. Case-insensitive.
            c.city.toLowerCase().startsWith(query.trim().toLowerCase())
          )
          .slice(0, 8)
      : [];

  const isOpen = open && filtered.length > 0;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (city: CityGroup) => {
    // Coming Soon cities are not navigable
    if (city.count === 0) return;
    setOpen(false);
    setFocusedIndex(-1);
    setQuery('');
    router.push(`/good-businesses/${city.slug}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setOpen(true);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && filtered[focusedIndex]) {
        handleSelect(filtered[focusedIndex]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setFocusedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const activeDescent =
    isOpen && focusedIndex >= 0 && filtered[focusedIndex]
      ? optionId(filtered[focusedIndex].slug)
      : undefined;

  return (
    <Box ref={containerRef} position="relative" w="100%" maxW="540px">
      {/* Input */}
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
        <Box color="#9CA3AF" flexShrink="0" display="flex" alignItems="center">
          <LuSearch size={18} />
        </Box>

        <input
          ref={inputRef}
          value={query}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search businesses by city…"
          aria-label="Search cities"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listboxId : undefined}
          aria-activedescendant={activeDescent}
          role="combobox"
          maxLength={100}
          autoComplete="off"
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

      {/* Dropdown */}
      {isOpen && (
        <Stack
          id={listboxId}
          role="listbox"
          aria-label="City suggestions"
          position="absolute"
          top="calc(100% + 8px)"
          left="0"
          right="0"
          bg="white"
          borderRadius="16px"
          border="1px solid #E8EAFF"
          boxShadow="0px 16px 48px rgba(47, 43, 119, 0.16)"
          zIndex="1000"
          gap="0"
          overflow="hidden"
        >
          {filtered.map((c, i) => {
            const isFocused = i === focusedIndex;
            const isComingSoon = c.count === 0;

            return (
              <HStack
                key={c.slug}
                id={optionId(c.slug)}
                role="option"
                aria-selected={isFocused}
                aria-disabled={isComingSoon}
                px="16px"
                py="12px"
                gap="3"
                cursor={isComingSoon ? 'default' : 'pointer'}
                bg={isFocused && !isComingSoon ? '#F5F3FF' : 'white'}
                _hover={isComingSoon ? {} : { bg: '#F5F3FF' }}
                onClick={() => handleSelect(c)}
                borderBottom="1px solid #F5F5FB"
                _last={{ borderBottom: 'none' }}
                align="center"
                transition="background 0.1s"
                opacity={isComingSoon ? 0.7 : 1}
              >
                {/* Icon badge */}
                <Box
                  w="34px"
                  h="34px"
                  borderRadius="10px"
                  bg={isFocused && !isComingSoon ? '#EBE8FF' : '#F4F2FF'}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink="0"
                  transition="background 0.1s"
                >
                  <Box color={isComingSoon ? '#A5A0D8' : '#2F2B77'} display="flex">
                    <LuMapPin size={14} />
                  </Box>
                </Box>

                {/* Text */}
                <Stack gap="0" flex="1" textAlign="left">
                  <Text
                    fontSize="14px"
                    fontWeight="600"
                    color={isComingSoon ? '#6B7280' : '#1E1B4B'}
                    className="font-body"
                    lineHeight="140%"
                  >
                    {c.city},{' '}
                    <Box as="span" fontWeight="500">
                      {c.state}
                    </Box>
                  </Text>
                  <Text
                    fontSize="11px"
                    color={isComingSoon ? '#A5B4FC' : '#9CA3AF'}
                    className="font-body"
                    lineHeight="140%"
                    fontWeight={isComingSoon ? '600' : '400'}
                  >
                    {isComingSoon
                      ? 'Coming Soon'
                      : `${c.count} ${c.count === 1 ? 'Featured Business' : 'Featured Businesses'}`}
                  </Text>
                </Stack>

                {/* Arrow — only on active cities */}
                {!isComingSoon && (
                  <Box
                    color={isFocused ? '#2F2B77' : '#C4C0F0'}
                    display="flex"
                    flexShrink="0"
                    transition="color 0.1s"
                  >
                    <LuArrowRight size={14} />
                  </Box>
                )}
              </HStack>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export default DirectorySearchClient;

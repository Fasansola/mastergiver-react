'use client';

/**
 * DirectorySearchClient
 *
 * City search with typeahead for the GOOD Businesses directory hero.
 * Accepts the full list of city groups (passed from server) and filters
 * client-side as the user types. Clicking or pressing Enter on a result
 * navigates to /good-businesses/[citySlug].
 *
 * Keyboard support: ArrowDown/ArrowUp to move focus, Enter to select,
 * Escape to close. Full ARIA combobox pattern (role="combobox" +
 * role="listbox" + role="option" + aria-activedescendant).
 */

import { useState, useRef, useEffect, useId } from 'react';
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
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Stable IDs for ARIA linkage
  const listboxId = useId();
  const optionId = (slug: string) => `city-opt-${slug}`;

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

  const handleSelect = (slug: string) => {
    setOpen(false);
    setFocusedIndex(-1);
    setQuery('');
    router.push(`/good-businesses/${slug}`);
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
        handleSelect(filtered[focusedIndex].slug);
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
          ref={inputRef}
          value={query}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search by city..."
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

      {/* Dropdown results */}
      {isOpen && (
        <Stack
          id={listboxId}
          role="listbox"
          aria-label="City suggestions"
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
          {filtered.map((c, i) => (
            <HStack
              key={c.slug}
              id={optionId(c.slug)}
              role="option"
              aria-selected={i === focusedIndex}
              px="20px"
              py="13px"
              gap="3"
              cursor="pointer"
              bg={i === focusedIndex ? '#F5F3FF' : 'transparent'}
              _hover={{ bg: '#F5F3FF' }}
              onClick={() => handleSelect(c.slug)}
              borderBottom="1px solid #F3F4F6"
              _last={{ borderBottom: 'none' }}
              align="center"
              transition="background 0.1s"
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

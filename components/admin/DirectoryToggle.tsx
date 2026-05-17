'use client';

/**
 * DirectoryToggle
 *
 * Toggle switch for including/excluding a business from the public directory.
 * Calls the server action optimistically and shows a loading state.
 */

import { useState, useTransition } from 'react';
import { Box, HStack, Text } from '@chakra-ui/react';
import { toggleDirectoryFeature } from '@/lib/actions/admin.actions';

interface Props {
  businessId: string;
  initialFeatured: boolean;
  companyName: string | null;
}

const DirectoryToggle = ({ businessId, initialFeatured, companyName }: Props) => {
  const [featured, setFeatured] = useState(initialFeatured);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const next = !featured;
    setFeatured(next); // optimistic
    startTransition(async () => {
      const result = await toggleDirectoryFeature(businessId, next);
      if (!result.success) {
        setFeatured(!next); // revert on failure
        alert(`Failed to update ${companyName ?? 'business'}: ${result.error}`);
      }
    });
  };

  return (
    <HStack gap="3" align="center">
      {/* Toggle pill */}
      <Box
        as="button"
        role="switch"
        aria-checked={featured}
        aria-label={`${featured ? 'Remove' : 'Add'} ${companyName ?? 'business'} from directory`}
        onClick={handleToggle}
        _disabled={{ opacity: 0.7, cursor: 'wait' }}
        aria-disabled={isPending}
        pointerEvents={isPending ? 'none' : 'auto'}
        w="44px"
        h="24px"
        borderRadius="full"
        bg={featured ? '#2F2B77' : '#D1D5DB'}
        position="relative"
        transition="background 0.2s"
        cursor={isPending ? 'wait' : 'pointer'}
        opacity={isPending ? 0.7 : 1}
        flexShrink="0"
        fontFamily="inherit"
      >
        <Box
          position="absolute"
          top="3px"
          left={featured ? '23px' : '3px'}
          w="18px"
          h="18px"
          borderRadius="full"
          bg="white"
          boxShadow="0px 1px 3px rgba(0,0,0,0.2)"
          transition="left 0.2s"
        />
      </Box>

      <Text
        fontSize="13px"
        fontWeight="600"
        color={featured ? '#2F2B77' : '#9CA3AF'}
        className="font-body"
      >
        {featured ? 'In Directory' : 'Hidden'}
      </Text>
    </HStack>
  );
};

export default DirectoryToggle;

/**
 * DuplicatePostButton — calls the duplicate API and redirects to the new draft.
 * Client component so it can handle loading state and router navigation.
 */

'use client';

import { HStack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LuCopy, LuLoader } from 'react-icons/lu';

interface DuplicatePostButtonProps {
  postId: string;
}

const DuplicatePostButton = ({ postId }: DuplicatePostButtonProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDuplicate = async () => {
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/blog/posts/${postId}/duplicate`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? 'Failed to duplicate');

      // Redirect to the new draft's edit page
      router.push(`/admin/blog/${data.id}/edit`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
      setLoading(false);
    }
  };

  return (
    <HStack gap="0" flexDirection="column" align="end">
      <HStack
        gap="1"
        px="3"
        py="1"
        border="1px solid"
        borderColor={error ? 'red.300' : 'border.default'}
        borderRadius="6px"
        cursor={loading ? 'not-allowed' : 'pointer'}
        opacity={loading ? 0.6 : 1}
        color="text.secondary"
        _hover={loading ? {} : { borderColor: 'brand.primary', color: 'brand.primary' }}
        transition="all 0.15s"
        onClick={handleDuplicate}
        title="Duplicate as draft"
      >
        {loading ? (
          <LuLoader size={13} style={{ animation: 'spin 1s linear infinite' }} />
        ) : (
          <LuCopy size={13} />
        )}
        <Text fontSize="13px" fontWeight="500" className="font-body">
          {loading ? 'Copying…' : 'Duplicate'}
        </Text>
      </HStack>
      {error && (
        <Text fontSize="11px" color="red.500" className="font-body" mt="1">
          {error}
        </Text>
      )}
    </HStack>
  );
};

export default DuplicatePostButton;

/**
 * DeletePostButton — two-step inline confirmation before deleting a post.
 *
 * Step 1: "Delete" button (trash icon)
 * Step 2: "Sure?" label + "Yes, delete" (red) + "Cancel"
 *
 * On confirm → DELETE /api/blog/posts/[id] → router.push(redirectTo)
 * On cancel  → resets back to step 1
 */

'use client';

import { HStack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LuLoader, LuTrash2 } from 'react-icons/lu';

interface DeletePostButtonProps {
  postId: string;
  /** Where to navigate after successful deletion. Defaults to /admin/blog */
  redirectTo?: string;
}

const DeletePostButton = ({ postId, redirectTo = '/admin/blog' }: DeletePostButtonProps) => {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/blog/posts/${postId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to delete');

      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
      setLoading(false);
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <HStack
        gap="1"
        px="3"
        py="1"
        border="1px solid"
        borderColor="border.default"
        borderRadius="6px"
        opacity={0.5}
        color="text.secondary"
      >
        <LuLoader size={13} style={{ animation: 'spin 1s linear infinite' }} />
        <Text fontSize="13px" fontWeight="500" className="font-body">Deleting…</Text>
      </HStack>
    );
  }

  if (confirming) {
    return (
      <HStack gap="2">
        <Text fontSize="13px" color="text.secondary" className="font-body" flexShrink={0}>
          Sure?
        </Text>
        {/* Confirm */}
        <HStack
          gap="1"
          px="3"
          py="1"
          bg="red.500"
          borderRadius="6px"
          cursor="pointer"
          _hover={{ bg: 'red.600' }}
          transition="background 0.15s"
          onClick={handleDelete}
        >
          <Text fontSize="13px" fontWeight="600" color="white" className="font-body">
            Yes, delete
          </Text>
        </HStack>
        {/* Cancel */}
        <HStack
          gap="1"
          px="3"
          py="1"
          border="1px solid"
          borderColor="border.default"
          borderRadius="6px"
          cursor="pointer"
          color="text.secondary"
          _hover={{ borderColor: 'brand.primary', color: 'brand.primary' }}
          transition="all 0.15s"
          onClick={() => setConfirming(false)}
        >
          <Text fontSize="13px" fontWeight="500" className="font-body">Cancel</Text>
        </HStack>
        {error && (
          <Text fontSize="11px" color="red.500" className="font-body">{error}</Text>
        )}
      </HStack>
    );
  }

  return (
    <HStack
      gap="1"
      px="3"
      py="1"
      border="1px solid"
      borderColor="border.default"
      borderRadius="6px"
      cursor="pointer"
      color="text.secondary"
      _hover={{ borderColor: 'red.400', color: 'red.500' }}
      transition="all 0.15s"
      onClick={() => setConfirming(true)}
      title="Delete post"
    >
      <LuTrash2 size={13} />
      <Text fontSize="13px" fontWeight="500" className="font-body">Delete</Text>
    </HStack>
  );
};

export default DeletePostButton;

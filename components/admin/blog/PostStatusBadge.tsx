/**
 * PostStatusBadge — small coloured pill showing DRAFT / PUBLISHED / ARCHIVED.
 */

import { Box, Text } from '@chakra-ui/react';

type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

const statusConfig: Record<PostStatus, { bg: string; color: string; label: string }> = {
  DRAFT:     { bg: '#FFF7ED', color: '#C2410C', label: 'Draft' },
  PUBLISHED: { bg: '#F0FDF4', color: '#15803D', label: 'Published' },
  ARCHIVED:  { bg: '#F3F4F6', color: '#6B7280', label: 'Archived' },
};

interface PostStatusBadgeProps {
  status: PostStatus;
}

const PostStatusBadge = ({ status }: PostStatusBadgeProps) => {
  const { bg, color, label } = statusConfig[status];
  return (
    <Box
      display="inline-flex"
      px="10px"
      py="3px"
      borderRadius="999px"
      bg={bg}
    >
      <Text fontSize="12px" fontWeight="600" color={color} className="font-body">
        {label}
      </Text>
    </Box>
  );
};

export default PostStatusBadge;

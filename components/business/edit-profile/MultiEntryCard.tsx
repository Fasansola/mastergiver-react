/**
 * Card displaying a single saved entry in a multi-entry section.
 *
 * Used by Partners, Community Events, Endorsements, and Offers sections.
 * Shows an optional thumbnail, a title, a description snippet, and
 * Edit / Delete action buttons.
 */

import { Heading, HStack, Separator, Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Edit from '@/public/business-assets/Edit.svg';
import Delete from '@/public/business-assets/Delete.svg';

interface MultiEntryCardProps {
  image?: string | null;
  title: string;
  description: string;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

const MultiEntryCard = ({
  image,
  title,
  description,
  onEdit,
  onDelete,
  isDeleting = false,
}: MultiEntryCardProps) => {
  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      gap="6"
      p={{ base: '5', md: '10' }}
      border="0.5px solid"
      borderLeft="4px solid"
      borderColor="brand.primary!"
      align={{ base: 'flex-start', md: 'center' }}
    >
      {/* Thumbnail (optional) */}
      {image && (
        <Image
          src={image}
          alt={title}
          width="140"
          height="140"
          style={{
            width: '140px',
            height: '140px',
            borderRadius: '100%',
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
      )}

      {/* Text content */}
      <Stack gap="6">
        <Heading
          fontWeight="700"
          className="font-body"
          textTransform="uppercase"
          fontSize="20"
          color="text.primary"
        >
          {title}
        </Heading>
        <Text color="text.primary" lineHeight="180%">
          {description}
        </Text>
        {/* Action buttons */}
        <HStack p="2" gap="4">
          <HStack
            onClick={onEdit}
            gap="4"
            // disabled={isDeleting}
            style={{
              color: '#2F2B77',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            <Image src={Edit} alt="Edit icon" />
            Edit
          </HStack>

          <Separator orientation="vertical" height="4" />
          <HStack
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this entry?'))
                onDelete();
            }}
            gap="4"
            // disabled={isDeleting}
            style={{
              color: '#2F2B77',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            <Image src={Delete} alt="Delete icon" />
            {isDeleting ? '…' : 'Delete'}
          </HStack>
        </HStack>
      </Stack>
    </Stack>
  );
};

export default MultiEntryCard;

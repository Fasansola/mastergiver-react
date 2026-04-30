/**
 * CommunityGallery — public business profile.
 *
 * Renders the "In the Community" section: a masonry-style grid of photos
 * with descriptions and optional external reference links.
 *
 * Only rendered when the business has at least one community event saved.
 */

import { Grid, Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';

interface CommunityEvent {
  id: string;
  photo: string | null;
  description: string;
  externalUrl: string | null;
}

interface CommunityGalleryProps {
  events: CommunityEvent[];
}

const CommunityGallery = ({ events }: CommunityGalleryProps) => {
  return (
    <Grid gap="4" templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}>
      {events.map((e) => (
        <Stack
          key={e.id}
          bgColor="white"
          border="1px solid #DCDFE3"
          borderRadius="12px"
          boxShadow="0px 1px 2px 0px #4646490F, 0px 5px 3px 0px #4646490A"
          gap="0"
        >
          {/* Photo */}
          {e.photo && (
            <Image
              src={e.photo}
              alt={`Community event photo ${e.id}`}
              width="400"
              height="300"
              style={{
                width: '100%',
                borderRadius: '12px 12px 0 0',
                height: 'clamp(180px, 40vw, 280px)',
                objectFit: 'cover',
              }}
            />
          )}

          <Stack py="4" px="6" gap="2">
            <Text
              fontSize="14px"
              className="font-body"
              color="text.primary"
              fontWeight="700"
            >
              {e.description}
            </Text>
            {e.externalUrl && (
              <Link
                href={e.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '13px',
                  color: '#2F2B77',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Learn more ↗
              </Link>
            )}
          </Stack>
        </Stack>
      ))}
    </Grid>
  );
};

export default CommunityGallery;

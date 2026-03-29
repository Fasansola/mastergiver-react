'use client';

import { Stack } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import ProfilePictureUploadSkeleton from '../skeletons/ProfilePictureUploadSkeleton';

const ProfilePictureUpload = dynamic(
  () => import('@/components/onboarding/ProfilePictureUpload'),
  { ssr: false, loading: () => <ProfilePictureUploadSkeleton /> }
);

interface ProfilePictureSectionProps {
  profilePicture: string | null;
  onUpload: (url: string) => void;
  onDelete: () => void;
}

export default function ProfilePictureSection({
  profilePicture,
  onUpload,
  onDelete,
}: ProfilePictureSectionProps) {
  return (
    <Stack gap="2" align="center">
      <ProfilePictureUpload
        mode="controlled"
        currentImageURL={profilePicture}
        onUploadComplete={onUpload}
        onDelete={onDelete}
      />
    </Stack>
  );
}

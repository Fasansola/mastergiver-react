import { Flex, Heading, Skeleton, SkeletonCircle } from '@chakra-ui/react';

const ProfilePictureUploadSkeleton = () => {
  return (
    <Flex direction="column" gap="6">
      <Heading color="text.heading" fontSize="subheading">
        Add Profile Picture
      </Heading>
      <Flex gap="6" alignItems="center">
        <SkeletonCircle size="136px" />
        <Flex direction="column" gap="4">
          <Flex gap="3" alignItems="center">
            <Skeleton height="32px" width="140px" borderRadius="md" />
          </Flex>
          <Skeleton height="16px" width="260px" borderRadius="md" />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProfilePictureUploadSkeleton;

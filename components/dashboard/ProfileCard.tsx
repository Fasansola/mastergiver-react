'use client';

import {
  Stack,
  Separator,
  Button,
  Heading,
  Link,
  Image,
  Text,
} from '@chakra-ui/react';
import ReadMore from './ReadMore';
import { ProfileDisplayData } from './ProfileDisplay';

interface ProfileProps {
  profile: ProfileDisplayData;
  isDashboard?: boolean;
}

const ProfileCard = ({ profile, isDashboard }: ProfileProps) => {
  return (
    <Stack
      width="100%"
      maxW={{ base: '100%', md: '360px', lg: '440px' }}
      flexGrow="1"
      align="center"
      bgColor="background.white"
      borderRadius="20px"
      py={{ base: '10', md: '8', lg: '10' }}
      px={{ base: '6', md: '6', lg: '8' }}
      mt={{ base: '-80px', lg: '-100px' }}
      pos={{ base: 'static', lg: 'sticky' }}
      top={{ base: 'auto', lg: '24' }}
      // Shadow
      boxShadow="0px 4px 24px rgba(0, 0, 0, 0.08)"
      // Smooth shadow transition on hover
      transition="box-shadow 0.2s ease"
      _hover={{
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.14)',
      }}
    >
      <Stack gap="10" justifyContent="center" alignItems="center" w="100%">
        <Image
          alt={profile.username + ' profile picture'}
          src={profile.profilePicture ?? ''}
          width={200}
          height={200}
          borderRadius="full"
          objectFit="cover"
          border="1px solid"
          borderColor="border.default"
          p="1"
        />
        <Stack align="center">
          <Heading fontSize="32px" textAlign="center">
            {profile.firstName + ' ' + profile.lastName}
          </Heading>
          {(profile.city || profile.state) && (
            <Text textAlign="center" fontSize="md" fontWeight="500">
              {[profile.city, profile.state].filter(Boolean).join(', ')}
            </Text>
          )}
        </Stack>
        <Stack gap="12" minW="100%">
          <ReadMore label="About Me" value={profile.aboutMe ?? ''} />
          <Separator borderColor="border.default" />
          <ReadMore label="Why I Give" value={profile.whyIGive ?? ''} />
        </Stack>

        {isDashboard && (
          <Link href="/settings/" className="w-full">
            <Button
              bgColor="#22A06B"
              width="100%"
              border="solid 1px #6DEFB840"
              mt="4"
              transition="background-color 0.2s ease"
              _hover={{
                bgColor: '#1a8a56',
              }}
              _active={{
                bgColor: '#157a49',
              }}
            >
              Edit My Profile
            </Button>
          </Link>
        )}
      </Stack>
    </Stack>
  );
};

export default ProfileCard;

import {
  Stack,
  Image,
  Container,
  Heading,
  Text,
  HStack,
  Flex,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import Logo from '@/public/brand-assets/Mastergiver_logo.svg';
import ProfileCard from './ProfileCard';
import { $Enums } from '@prisma/client';

// ── Types ─────────────────────────────────────────────────

export interface ProfileDisplayData {
  username: string;
  profilePicture: string | null;
  firstName: string;
  lastName: string;
  city: string | null;
  state: string | null;
  aboutMe: string | null;
  whyIGive: string | null;
  status: $Enums.ProfileStatus;
  publishedAt: Date | null;
  causes: {
    id: string;
    name: string;
    slug: string;
    color: string;
    icon: string | null;
  }[];
  skills: {
    id: string;
    name: string;
    slug: string;
  }[];
  organizations: {
    id: string;
    pledgeOrgId: string | null;
    name: string;
    logo: string | null;
    location: string | null;
    ein: string | null;
    website: string | null;
    mission: string | null;
  }[];
}

interface ProfileDisplayProps {
  profile: ProfileDisplayData;
  isDashboard?: boolean;
}

const ProfileDisplay = ({ profile, isDashboard }: ProfileDisplayProps) => {
  return (
    <Stack>
      <Stack
        align="center"
        height="300px"
        bgColor="background.lightBlue"
        justify={{ base: 'top', md: 'center' }}
        pt={{ base: '64px', md: '0' }}
      >
        <Stack w={{ base: '240px', md: '300px' }}>
          <NextImage alt="MasterGiver Big Hero logo" src={Logo} width={300} />
        </Stack>
      </Stack>

      <Container px={{ base: '4', md: '6', lg: '8' }}>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          alignItems="start"
          gap={{ base: '6', lg: '16' }}
        >
          {/* Profile Card */}
          <ProfileCard profile={profile} isDashboard={isDashboard ?? false} />

          <Stack
            py={{ base: '6', md: '8', lg: '12' }}
            gap={{ base: '10', md: '12', lg: '16' }}
            flexShrink="shrink"
            w="100%"
          >
            {/* Organizations */}
            <Stack gap={{ base: '6', md: '8', lg: '10' }} w="100%">
              <Heading fontSize="bigheading" pl={{ base: '0', lg: '50' }}>
                💕 My Organizations & Causes
              </Heading>
              {profile.organizations.length === 0 ? (
                <Stack
                  minH="80px"
                  justify="center"
                  p="6"
                  borderRadius="12px"
                  borderWidth="1px"
                  borderStyle="dashed"
                  borderColor="border.default"
                >
                  <Text color="fg.muted" fontSize="md" fontWeight="500">
                    🏛️ No organizations added yet
                  </Text>
                  <Text color="fg.subtle" fontSize="sm">
                    {isDashboard
                      ? 'Head to settings to add causes and organizations you support.'
                      : `${profile.firstName} hasn't added any organizations yet.`}
                  </Text>
                </Stack>
              ) : (
                <Stack
                  gap="0"
                  borderBottom="solid 1px"
                  borderColor="border.default"
                >
                  {profile.organizations.map((organization) => (
                    <HStack
                      key={organization.id}
                      gap={{ base: '4', md: '5', lg: '6' }}
                      borderTop="solid 1px"
                      borderColor="border.default"
                      py={{ base: '4', md: '5', lg: '6' }}
                    >
                      <Stack
                        bgColor="brand.accent"
                        p="2"
                        borderRadius="4px"
                        width={{ base: '72px', md: '96px', lg: '120px' }}
                        height={{ base: '72px', md: '96px', lg: '120px' }}
                        flexShrink="1"
                      >
                        <Stack
                          p="1"
                          bgColor="background.white"
                          borderRadius="4px"
                          w="100%"
                          h="100%"
                        >
                          <Image
                            src={organization.logo ?? ''}
                            alt={organization.name}
                            objectFit="contain"
                            flexShrink="0"
                            width="100%"
                            height="100%"
                          />
                        </Stack>
                      </Stack>
                      <Text
                        fontWeight="600"
                        fontSize={{ base: 'subheading', md: 'heading' }}
                      >
                        {organization.name}
                      </Text>
                    </HStack>
                  ))}
                </Stack>
              )}
            </Stack>

            {/* Causes */}
            <Stack
              gap={{ base: '6', md: '8', lg: '10' }}
              borderBottom="solid 1px"
              borderColor="border.default"
              pb={{ base: '8', md: '10', lg: '14' }}
            >
              <Heading fontSize="bigheading" pl={{ base: '0', lg: '50' }}>
                What I Care About
              </Heading>
              {profile.causes.length === 0 ? (
                <Stack
                  minH="80px"
                  justify="center"
                  px="6"
                  py="6"
                  borderRadius="12px"
                  borderWidth="1px"
                  borderStyle="dashed"
                  borderColor="border.default"
                >
                  <Text color="fg.muted" fontSize="md" fontWeight="500">
                    💛 No causes added yet
                  </Text>
                  <Text color="fg.subtle" fontSize="sm">
                    {isDashboard
                      ? 'Let the world know what you stand for — add your causes in settings.'
                      : `${profile.firstName} hasn't shared their causes yet.`}
                  </Text>
                </Stack>
              ) : (
                <Flex wrap="wrap" gap="4" w="100%">
                  {profile.causes.map((cause) => (
                    <HStack
                      key={cause.id}
                      gap="1"
                      py={{ base: '1.5', lg: '2' }}
                      // px={{ base: '4', lg: '4' }}
                      pl="2"
                      pr={{ base: '4', lg: '5' }}
                      bgColor={cause.color}
                      borderRadius="12px"
                    >
                      {cause.icon && (
                        <Image
                          src={cause.icon}
                          alt={cause.name}
                          width={9}
                          height={9}
                          objectFit="contain"
                        />
                      )}
                      <Text
                        fontWeight="500"
                        fontSize="subheading"
                        color="white"
                      >
                        {cause.name}
                      </Text>
                    </HStack>
                  ))}
                </Flex>
              )}
            </Stack>

            {/* Skills */}
            <Stack
              gap={{ base: '6', md: '8', lg: '10' }}
              w="100%"
              // borderBottom="solid 1px"
              // borderColor="border.default"
              pb={{ base: '8', md: '10', lg: '14' }}
            >
              <Heading fontSize="bigheading" pl={{ base: '0', lg: '50' }}>
                Giving Skills
              </Heading>
              {profile.skills.length === 0 ? (
                <Stack
                  minH="80px"
                  w="100%"
                  justify="center"
                  px="6"
                  py="6"
                  borderRadius="12px"
                  borderWidth="1px"
                  borderStyle="dashed"
                  borderColor="border.default"
                >
                  <Text color="fg.muted" fontSize="md" fontWeight="500">
                    🛠️ No skills added yet
                  </Text>
                  <Text color="fg.subtle" fontSize="sm">
                    {isDashboard
                      ? 'Share the skills you offer — add them in settings.'
                      : `${profile.firstName} hasn't listed their giving skills yet.`}
                  </Text>
                </Stack>
              ) : (
                <Flex gap="4" wrap="wrap" w="100%">
                  {profile.skills.map((skill) => (
                    <HStack
                      key={skill.id}
                      gap="1"
                      py={{ base: '3', lg: '4' }}
                      px={{ base: '4', lg: '6' }}
                      bgColor="background.lightBlue"
                      borderRadius="12px"
                    >
                      <Text
                        fontWeight="500"
                        fontSize={{ base: 'sm', lg: 'subheading' }}
                      >
                        {skill.name}
                      </Text>
                    </HStack>
                  ))}
                </Flex>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default ProfileDisplay;

import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProfileDisplay from '@/components/dashboard/ProfileDisplay';
import { Stack, Container, HStack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import Image from 'next/image';
import LeftArrow from '@/public/components-assets/chevron-left.svg';
import { profileQuerySelect } from '@/lib/utils/profile-query';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;

  const profile = await prisma.profile.findUnique({
    where: { username, status: 'PUBLISHED' },
    select: { name: true, aboutMe: true, profilePicture: true },
  });

  if (!profile) {
    return { title: 'Profile not found | MasterGiver' };
  }

  const title = `${profile.name} | MasterGiver`;
  const description = profile.aboutMe
    ? profile.aboutMe.slice(0, 155)
    : `View ${profile.name}'s philanthropic profile on MasterGiver.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(profile.profilePicture ? { images: [{ url: profile.profilePicture }] } : {}),
    },
    twitter: { card: 'summary', title, description },
  };
}

async function getPublicProfile(username: string) {
  return prisma.profile.findUnique({
    where: {
      username,
      // Only show published profiles to the public
      status: 'PUBLISHED',
    },
    select: profileQuerySelect,
  });
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const profile = await getPublicProfile(username);

  // Show 404 if profile doesn't exist or isn't published
  if (!profile) notFound();

  return (
    <>
      <Stack
        align="center"
        height="40px"
        pt="12"
        bgColor="background.lightBlue"
        justify="center"
      >
        <Container>
          <Link href="/dashboard">
            <HStack>
              <Image src={LeftArrow} alt="Back arrow" />
              <Text fontWeight="500" color="#226094">
                Back to my Dashboard
              </Text>
            </HStack>
          </Link>
        </Container>
      </Stack>
      <ProfileDisplay
        profile={{
          ...profile,
          causes: profile.causes.map((pc) => pc.cause),
          skills: profile.skills.map((ps) => ps.skill),
          organizations: profile.organizations.map((po) => po.organization),
        }}
        isDashboard={false}
      />
    </>
  );
}

import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProfileDisplay from '@/components/layout/dashboard/ProfileDisplay';
import { Stack, Container, HStack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import Image from 'next/image';
import LeftArrow from '@/public/components-assets/chevron-left.svg';

async function getPublicProfile(username: string) {
  return prisma.profile.findUnique({
    where: {
      username,
      // Only show published profiles to the public
      status: 'PUBLISHED',
    },
    select: {
      username: true,
      profilePicture: true,
      firstName: true,
      lastName: true,
      city: true,
      state: true,
      aboutMe: true,
      whyIGive: true,
      status: true,
      publishedAt: true,
      causes: {
        select: {
          cause: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true,
              icon: true,
            },
          },
        },
      },
      skills: {
        select: {
          skill: {
            select: { id: true, name: true, slug: true },
          },
        },
      },
      organizations: {
        select: {
          organization: {
            select: {
              id: true,
              pledgeOrgId: true,
              name: true,
              logo: true,
              location: true,
              ein: true,
              website: true,
              mission: true,
            },
          },
        },
      },
    },
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

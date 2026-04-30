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
    select: { firstName: true, lastName: true, aboutMe: true, profilePicture: true },
  });

  if (!profile) {
    return { title: 'Profile not found | MasterGiver' };
  }

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const title = `${fullName} | MasterGiver`;
  const description = profile.aboutMe
    ? profile.aboutMe.slice(0, 155)
    : `View ${fullName}'s philanthropic profile on MasterGiver.`;
  const canonicalUrl = `https://mastergiver.com/profile/${username}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
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

  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mastergiver.com';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: `${profile.firstName} ${profile.lastName}`,
    url: `${BASE_URL}/profile/${username}`,
    ...(profile.profilePicture && { image: profile.profilePicture }),
    ...(profile.aboutMe && { description: profile.aboutMe }),
    ...(profile.city && profile.state && {
      address: {
        '@type': 'PostalAddress',
        addressLocality: profile.city,
        addressRegion: profile.state,
      },
    }),
    sameAs: [`${BASE_URL}/profile/${username}`],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

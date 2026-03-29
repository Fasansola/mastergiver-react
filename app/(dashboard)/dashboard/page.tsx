import { redirect } from 'next/navigation';
import { requireCompletedOnboarding } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import ProfileDisplay from '@/components/layout/dashboard/ProfileDisplay';

export const dynamic = 'force-dynamic';

async function getDashboardData(userId: string) {
  return prisma.profile.findUnique({
    where: { userId },
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

export default async function DashboardPage() {
  const user = await requireCompletedOnboarding();

  const profile = await getDashboardData(user.id);

  if (!profile) redirect('/onboarding');

  return (
    <ProfileDisplay
      profile={{
        ...profile,
        causes: profile.causes.map((pc) => pc.cause),
        skills: profile.skills.map((ps) => ps.skill),
        organizations: profile.organizations.map((po) => po.organization),
      }}
      isDashboard={true}
    />
  );
}

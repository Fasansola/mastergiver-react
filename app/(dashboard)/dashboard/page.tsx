import { redirect } from 'next/navigation';
import { requireCompletedOnboarding } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import ProfileDisplay from '@/components/dashboard/ProfileDisplay';
import { profileQuerySelect } from '@/lib/utils/profile-query';

export const dynamic = 'force-dynamic';

async function getDashboardData(userId: string) {
  return prisma.profile.findUnique({
    where: { userId },
    select: profileQuerySelect,
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

import WhatICareAboutForm from '@/components/onboarding/what-i-care-about/WhatICareAboutForm';
import { getOnboardingDataAction } from '@/lib/actions/onboarding.actions';
import { requireIncompleteOnboarding } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

const dynamic = import('next/dynamic');

async function getCausesAndSkills() {
  const [causes, skills] = await Promise.all([
    prisma.cause.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        color: true,
        slug: true,
        icon: true,
      },
    }),

    prisma.skill.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
  ]);
  return { causes, skills };
}

const WhatICareAboutPage = async () => {
  await requireIncompleteOnboarding();

  const [onboardingData, { causes, skills }] = await Promise.all([
    getOnboardingDataAction(),
    getCausesAndSkills(),
  ]);

  const profile = onboardingData.data?.profile;

  // Transform data into the shape into store ready shape
  const existingCauses = profile?.causes.map((pc) => pc.cause) ?? [];
  const existingSkills = profile?.skills.map((ps) => ps.skill) ?? [];
  const existingOrgs =
    profile?.organizations
      .map((po) => po.organization)
      .filter((org): org is NonNullable<typeof org> => org.pledgeOrgId !== null)
      .map((org) => ({
        pledgeOrgId: org.pledgeOrgId as string,
        name: org.name,
        ein: org.ein,
        logo: org.logo,
        website: org.website,
        mission: org.mission,
        location: org.location,
      })) ?? [];
  const existingWhyIGive = profile?.whyIGive || '';

  return (
    <WhatICareAboutForm
      causes={causes}
      skills={skills}
      existingCauses={existingCauses}
      existingSkills={existingSkills}
      existingOrgs={existingOrgs}
      existingWhyIGive={existingWhyIGive}
    />
  );
};

export default WhatICareAboutPage;

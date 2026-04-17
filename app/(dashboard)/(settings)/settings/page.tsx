import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import ProfilePreview from '@/components/onboarding/ProfilePreview';
import type {
  CauseItem,
  OrgItem,
  SkillItem,
} from '@/lib/store/onboarding.store';

export const dynamic = 'force-dynamic';

async function getProfilePreviewData(userId: string) {
  const [user, causes, skills] = await Promise.all([
    // Full profile with existing selections
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        profile: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
            profilePicture: true,
            state: true,
            city: true,
            aboutMe: true,
            whyIGive: true,
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
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
            organizations: {
              select: {
                organization: {
                  select: {
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
        },
      },
    }),

    // All predefined causes for the edit dropdown
    prisma.cause.findMany({
      where: { isActive: true, panel: 'INDIVIDUAL' },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
        icon: true,
      },
    }),

    // All predefined skills for the edit dropdown
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

  return { user, causes, skills };
}

const SettingsPage = async () => {
  const session = await auth();

  if (!session?.user.id) {
    redirect('/login');
  }

  const { user, causes, skills } = await getProfilePreviewData(session.user.id);

  if (!user?.profile) {
    redirect('/onboarding/create-profile');
  }

  const profile = user.profile;

  // Transform existing selections into store-ready shapes
  const existingCauses: CauseItem[] = profile.causes.map((pc) => pc.cause);

  const existingSkills: SkillItem[] = profile.skills.map((ps) => ps.skill);

  const existingOrgs: OrgItem[] = profile.organizations
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
    }));

  return (
    <ProfilePreview
      mode="settings"
      initialData={{
        firstName: profile.firstName,
        lastName: profile.lastName,
        username: profile.username,
        profilePicture: profile.profilePicture ?? null,
        state: profile.state ?? null,
        city: profile.city ?? null,
        aboutMe: profile.aboutMe ?? null,
        whyIGive: profile.whyIGive ?? null,
      }}
      existingCauses={existingCauses}
      existingSkills={existingSkills}
      existingOrgs={existingOrgs}
      allCauses={causes}
      allSkills={skills}
    />
  );
};

export default SettingsPage;

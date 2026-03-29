'use server';

import { auth } from '@/lib/auth/auth';
import { prisma } from '../prisma';
import { revalidatePath } from 'next/cache';
import { OrgSearchResult } from '@/app/api/organizations/search/route';

interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  profilePicture?: string | null;
  state?: string | null;
  city?: string | null;
  aboutMe?: string | null;
  whyIGive?: string | null;
  causeIds?: string[];
  skillIds?: string[];
  organizations?: OrgSearchResult[];
}

// HELPERS

// Update onboarding progress
async function updateOnboardingProgress(step: number, completed: number[]) {
  const session = await auth();

  if (!session?.user.id) {
    return { success: false, error: 'Unauthorized' };
  }

  await prisma.onboardingProgress.update({
    where: { userId: session.user.id },
    data: { currentStep: step, completedSteps: completed },
  });
}

function generateOrgSlug(name: string, pledgeOrgId: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-') + pledgeOrgId
  );
}

// Core reusable function that updates profile fields and associations
async function updateProfileData(profileId: string, data: ProfileUpdateData) {
  const {
    firstName,
    lastName,
    profilePicture,
    state,
    city,
    aboutMe,
    whyIGive,
    causeIds,
    skillIds,
    organizations,
  } = data;

  let orgIds: string[] = [];
  if (organizations && organizations.length > 0) {
    orgIds = await Promise.all(
      organizations.map(async (org) => {
        const slug = generateOrgSlug(org.name, org.pledgeOrgId);
        const upserted = await prisma.organization.upsert({
          where: { pledgeOrgId: org.pledgeOrgId },
          update: {
            name: org.name,
            ein: org.ein,
            logo: org.logo,
            website: org.website,
            mission: org.mission,
            location: org.location,
          },
          create: {
            pledgeOrgId: org.pledgeOrgId,
            name: org.name,
            slug,
            ein: org.ein,
            logo: org.logo,
            website: org.website,
            source: 'API',
            mission: org.mission,
            location: org.location,
          },
        });
        return upserted.id;
      })
    );
  }
  // Build profile update object — only include fields that were passed
  const profileUpdate: Record<string, unknown> = {};

  if (firstName !== undefined) profileUpdate.firstName = firstName;
  if (lastName !== undefined) profileUpdate.lastName = lastName;
  if (profilePicture !== undefined)
    profileUpdate.profilePicture = profilePicture;
  if (state !== undefined) profileUpdate.state = state;
  if (city !== undefined) profileUpdate.city = city;
  if (aboutMe !== undefined) profileUpdate.aboutMe = aboutMe;
  if (whyIGive !== undefined) profileUpdate.whyIGive = whyIGive;

  await prisma.$transaction([
    // Update profile fields
    prisma.profile.update({
      where: {
        id: profileId,
      },
      data: profileUpdate,
    }),

    // Handle causes if provided
    ...(causeIds !== undefined
      ? [
          prisma.profileCause.deleteMany({ where: { profileId } }),
          ...(causeIds?.length > 0
            ? [
                prisma.profileCause.createMany({
                  data: causeIds.map((causeId) => ({ profileId, causeId })),
                  skipDuplicates: true,
                }),
              ]
            : []),
        ]
      : []),

    ...(skillIds !== undefined
      ? [
          prisma.profileSkill.deleteMany({ where: { profileId } }),
          ...(skillIds?.length > 0
            ? [
                prisma.profileSkill.createMany({
                  data: skillIds.map((skillId) => ({ profileId, skillId })),
                  skipDuplicates: true,
                }),
              ]
            : []),
        ]
      : []),

    ...(organizations !== undefined
      ? [
          prisma.profileOrganization.deleteMany({ where: { profileId } }),
          ...(orgIds.length > 0
            ? [
                prisma.profileOrganization.createMany({
                  data: orgIds.map((organizationId) => ({
                    profileId,
                    organizationId,
                  })),
                  skipDuplicates: true,
                }),
              ]
            : []),
        ]
      : []),
  ]);
}

// Step 1: Save profile basics (pictures, about me, location)

export async function saveProfileBasics(data: {
  profilePicture?: string;
  aboutMe: string;
  state: string;
  city: string;
}) {
  try {
    const session = await auth();

    const { profilePicture, aboutMe, state, city } = data;

    if (!session?.user.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Update profile
    await prisma.profile.update({
      where: { userId: session.user.id },
      data: {
        profilePicture,
        aboutMe,
        state,
        city,
      },
    });
    //   Update onboardingProgress
    await updateOnboardingProgress(2, [1]);

    revalidatePath('/onboarding');

    return { success: true };
  } catch (error) {
    console.error('Save profile basics error: ', error);
    return { success: false, error: 'Failed to save profile' };
  }
}

// Step 2: Save causes, skills, and organizations

export async function saveCausesSkillsOrgs(data: {
  causeIds: string[];
  skillIds: string[];
  organizations: OrgSearchResult[];
  whyIGive: string;
}) {
  try {
    const session = await auth();

    if (!session?.user.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return { success: false, error: 'Profile not found' };
    }

    await updateProfileData(profile.id, {
      whyIGive: data.whyIGive,
      causeIds: data.causeIds,
      skillIds: data.skillIds,
      organizations: data.organizations,
    });

    // Update onboarding progress
    await updateOnboardingProgress(3, [1, 2]);

    // Refresh page
    revalidatePath('/onboarding');

    return { success: true };
  } catch (error) {
    console.error('Save causes/skills/orgs error: ', error);
    return { success: false, error: 'Failed to save data' };
  }
}

// ── Step 3: Launch profile (preview page) ────────────────

export async function launchProfile(data: ProfileUpdateData) {
  try {
    const session = await auth();

    if (!session?.user.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return { success: false, error: 'Profile not found' };
    }

    // Save all profile edits first
    await updateProfileData(profile.id, data);

    // Then publish + complete onboarding atomically
    await prisma.$transaction([
      prisma.profile.update({
        where: { id: profile.id },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      }),
      prisma.onboardingProgress.update({
        where: { userId: session.user.id },
        data: {
          isCompleted: true,
          completedSteps: [1, 2, 3],
        },
      }),
    ]);

    revalidatePath('/onboarding');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Launch profile error:', error);
    return { success: false, error: 'Failed to launch profile' };
  }
}

// ── Settings: Save profile changes ───────────────────────

export async function saveProfileSettings(data: ProfileUpdateData) {
  try {
    const session = await auth();

    if (!session?.user.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return { success: false, error: 'Profile not found' };
    }

    await updateProfileData(profile.id, data);

    revalidatePath('/settings');
    revalidatePath(`/profile/${profile.username}`);

    return { success: true };
  } catch (error) {
    console.error('Save profile settings error:', error);
    return { success: false, error: 'Failed to save settings' };
  }
}

// Get current onboarding data

export async function getOnboardingData() {
  try {
    const session = await auth();

    if (!session?.user.id) {
      return { success: false, error: 'Unauthorized', data: null };
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        profile: {
          include: {
            causes: {
              include: {
                cause: true,
              },
            },
            skills: {
              include: {
                skill: true,
              },
            },
            organizations: {
              include: {
                organization: true,
              },
            },
          },
        },
        onboarding: true,
      },
    });

    if (!user) {
      return { success: false, error: 'User not found', data: null };
    }

    return {
      success: true,
      data: {
        profile: user.profile,
        onboarding: user.onboarding,
      },
    };
  } catch (error) {
    console.error('Get onboarding data error: ', error);
    return { success: false, error: 'Failed to fetch data', data: null };
  }
}

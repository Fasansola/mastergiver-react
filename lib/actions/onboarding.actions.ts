'use server';

import { auth } from '@/lib/auth/auth';
import { prisma } from '../prisma';
import { revalidatePath } from 'next/cache';

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
  organizationIds: string[];
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

    // Use transaction to update all at once

    await prisma.$transaction([
      // Delete existing association
      prisma.profileCause.deleteMany({
        where: { profileId: profile.id },
      }),
      prisma.profileSkill.deleteMany({
        where: { profileId: profile.id },
      }),
      prisma.profileOrganization.deleteMany({
        where: { profileId: profile.id },
      }),

      //   Create new associations for causes
      ...(data.causeIds.length > 0
        ? [
            prisma.profileCause.createMany({
              data: data.causeIds.map((causeId) => ({
                profileId: profile.id,
                causeId,
              })),
              skipDuplicates: true,
            }),
          ]
        : []),

      // Create new association for skills
      ...(data.skillIds.length > 0
        ? [
            prisma.profileSkill.createMany({
              data: data.skillIds.map((skillId) => ({
                profileId: profile.id,
                skillId,
              })),
              skipDuplicates: true,
            }),
          ]
        : []),

      //   Create new associations for organizations
      ...(data.organizationIds.length > 0
        ? [
            prisma.profileOrganization.createMany({
              data: data.organizationIds.map((organizationId) => ({
                profileId: profile.id,
                organizationId,
              })),
              skipDuplicates: true,
            }),
          ]
        : []),
    ]);

    // Update onboarding progress
    await updateOnboardingProgress(3, [1, 2]);

    revalidatePath('/onboarding');

    return { success: true };
  } catch (error) {
    console.error('Save causes/skills/orgs error: ', error);
    return { success: false, error: 'Failed to save data' };
  }
}

// Launch profile (complete onboarding)

export async function launchProfile() {
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

    // Update profile status and onboarding completion
    await prisma.$transaction([
      prisma.profile.update({
        where: { id: profile.id },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      }),

      prisma.onboardingProgress.update({
        where: {
          userId: session.user.id,
        },
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
    console.error('Launch profile error: ', error);
    return { success: false, error: 'Failed to launch profile' };
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

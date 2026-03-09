import { cache } from 'react';
import { auth } from './auth';
import { prisma } from '../prisma';
import { redirect } from 'next/navigation';

// Get current authenticated user (server side only)
// Cached per request to have multiple DB calls
export const getCurrentUser = cache(async () => {
  const session = await auth();

  if (!session?.user.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session?.user.id },
    include: {
      onboarding: true,
      profile: true,
    },
  });

  return user;
});

// Get current user or throw error

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

// Require user and onboarding completed - USE ON DASHBOARD PAGES

export async function requireCompletedOnboarding() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (!user.onboarding?.isCompleted) {
    redirect('/onboarding');
  }

  return user;
}

// Require user and check if onboarding is completed - USE ON ONBOARDING PAGES

export async function requireIncompleteOnboarding() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (user.onboarding?.isCompleted) {
    redirect('/dashboard');
  }

  return user;
}

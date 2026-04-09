import { cache } from 'react';
import { auth } from './auth';
import { prisma } from '../prisma';
import { redirect } from 'next/navigation';
import type { BusinessStatus } from '@prisma/client';

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

// Redirect away from business auth pages if a business session already exists.
// USE ON /business/signin, /business/signup, /business/reset-password pages.
//
// Destination is based on business status so the user always lands somewhere
// meaningful rather than bouncing through middleware redirects.
const STATUS_DESTINATIONS: Record<BusinessStatus, string> = {
  ACTIVE: '/business/dashboard/edit-profile',
  PENDING: '/business/confirm',
  SUSPENDED: '/business/suspended',
};

export async function redirectIfBusinessSession() {
  const session = await auth();
  if (!session?.user?.id) return;

  const business = await prisma.business.findUnique({
    where: { ownerId: session.user.id },
    select: { status: true },
  });

  if (!business) return;

  redirect(STATUS_DESTINATIONS[business.status]);
}

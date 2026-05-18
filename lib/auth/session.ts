import { cache } from 'react';
import { auth } from './auth';
import { prisma } from '../prisma';
import { redirect } from 'next/navigation';
import type { BusinessStatus } from '@prisma/client';

const STATUS_DESTINATIONS: Record<BusinessStatus, string> = {
  ACTIVE: '/business/dashboard/edit-profile',
  PENDING: '/business/confirm',
  SUSPENDED: '/business/suspended',
};

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
      business: { select: { status: true } },
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

  // Business-only user (no individual profile) — send them to their panel
  if (user.business && !user.profile) {
    redirect(STATUS_DESTINATIONS[user.business.status]);
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

  // Business-only user (no individual profile) — send them to their panel
  if (user.business && !user.profile) {
    redirect(STATUS_DESTINATIONS[user.business.status]);
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
export async function redirectIfBusinessSession() {
  const session = await auth();
  if (!session?.user?.id) return;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      role: true,
      profile: { select: { id: true } },
      business: { select: { status: true } },
    },
  });

  if (!user?.business) return;

  // Admin users with a business account must reach select-panel, not be silently
  // dropped into the business panel and lose access to /admin/directory.
  const isAdmin = user.role === 'ADMIN';
  const hasBusiness = true; // we already checked user.business above
  const hasProfile = !!user.profile;

  if (isAdmin) {
    const panelCount = [isAdmin, hasBusiness, hasProfile].filter(Boolean).length;
    redirect(panelCount > 1 ? '/select-panel' : '/admin/directory');
  }

  // Dual-account user (individual + business) — let them choose which panel
  if (user.profile) {
    redirect('/select-panel');
  }

  redirect(STATUS_DESTINATIONS[user.business.status]);
}

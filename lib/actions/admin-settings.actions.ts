'use server';

/**
 * Admin server actions for site-wide settings.
 *
 * setPaymentRequiredAction — toggles the paymentRequired flag in SiteSettings.
 *
 * When turned OFF:
 *   All PENDING businesses (accounts that signed up but never paid) are
 *   bulk-upgraded to status=ACTIVE, plan=FREE so they can access the dashboard
 *   immediately. This is the one-time migration for existing blocked users.
 *
 * When turned ON:
 *   New signups will be created as PENDING and routed through Stripe checkout.
 *   Existing FREE accounts are unaffected — they keep their access.
 *   Existing PRO (paid) accounts are unaffected.
 */

import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import type { ActionResult } from '@/lib/types/actions';

export async function setPaymentRequiredAction(
  value: boolean,
): Promise<ActionResult<{ migratedCount?: number }>> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  // Verify the caller is an admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== 'ADMIN') {
    return { success: false, error: 'Forbidden' };
  }

  // Upsert the singleton settings row
  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: { paymentRequired: value },
    create: { id: 'singleton', paymentRequired: value },
  });

  // When disabling payment: migrate all PENDING accounts to ACTIVE / FREE
  let migratedCount = 0;
  if (!value) {
    const result = await prisma.business.updateMany({
      where: { status: 'PENDING' },
      data: { status: 'ACTIVE', plan: 'FREE' },
    });
    migratedCount = result.count;
  }

  return { success: true, migratedCount };
}

export async function getPaymentSettingsAction(): Promise<
  ActionResult<{ paymentRequired: boolean; pendingCount: number; freeCount: number; proCount: number }>
> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== 'ADMIN') return { success: false, error: 'Forbidden' };

  const [settings, pendingCount, freeCount, proCount] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'singleton' } }),
    prisma.business.count({ where: { status: 'PENDING' } }),
    prisma.business.count({ where: { plan: 'FREE', status: 'ACTIVE' } }),
    prisma.business.count({ where: { plan: 'PRO' } }),
  ]);

  return {
    success: true,
    paymentRequired: settings?.paymentRequired ?? false,
    pendingCount,
    freeCount,
    proCount,
  };
}

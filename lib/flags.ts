import { cache } from 'react';
import { prisma } from './prisma';

/**
 * Returns whether upfront payment is required for new business accounts.
 *
 * Reads the singleton SiteSettings row. Defaults to false (free access) if the
 * row hasn't been created yet.
 *
 * Wrapped in React cache() so this is at most one DB call per request even if
 * called from multiple places in the same render tree.
 */
export const getPaymentRequired = cache(async (): Promise<boolean> => {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'singleton' },
    select: { paymentRequired: true },
  });
  return settings?.paymentRequired ?? false;
});

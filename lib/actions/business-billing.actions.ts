'use server';

/**
 * Server action for the Billing Settings page.
 *
 * createBillingPortalAction — creates a Stripe Customer Portal session for
 *   the authenticated user's business and returns the hosted portal URL.
 *   The client redirects the browser to that URL; Stripe then handles card
 *   management, invoice downloads, and cancellation entirely on their side.
 *
 * Returns ActionResult<{ url: string }> so the client component can redirect
 * on success or show an error inline on failure.
 */

import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/business/stripe';
import type { ActionResult } from '@/lib/types/actions';

export async function createBillingPortalAction(): Promise<ActionResult<{ url: string }>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  const business = await prisma.business.findUnique({
    where: { ownerId: session.user.id },
    select: { stripeCustomerId: true },
  });

  if (!business?.stripeCustomerId) {
    return { success: false, error: 'No billing account found. Complete payment setup first.' };
  }

  // Create a short-lived portal session — the URL expires in ~5 minutes.
  // return_url brings the user back to the billing page after they are done.
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: business.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/business/dashboard/billing`,
  });

  return { success: true, url: portalSession.url };
}

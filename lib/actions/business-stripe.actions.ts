'use server';

/**
 * Server action for creating a Stripe Checkout Session.
 *
 * Called when the user clicks "Continue to Payment" on /business/confirm.
 *
 * Guard against double-charging:
 *   If the business already has a stripeCustomerId, we check for an existing
 *   active or trialing subscription before creating a new session. If one
 *   exists (payment succeeded but webhook hasn't fired yet), we activate the
 *   account directly and return a dashboard redirect URL instead of a new
 *   checkout URL. This ensures a user who navigates back to /business/confirm
 *   and clicks the button again cannot be charged a second time.
 *
 * Returns:
 *   { success: true, checkoutUrl: string }  — redirect to Stripe
 *   { success: true, redirectTo: string }   — already paid, redirect to dashboard
 *   { success: false, error: string }       — something went wrong
 */

import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/business/stripe';
import type { ActionResult } from '@/lib/types/actions';

export async function createCheckoutSessionAction(): Promise<
  ActionResult<{ checkoutUrl?: string; redirectTo?: string }>
> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: 'You must be signed in to continue.' };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { business: true },
    });

    if (!user?.business) {
      return { success: false, error: 'No business account found for this user.' };
    }

    const { business } = user;

    // Already active — no payment needed
    if (business.status === 'ACTIVE') {
      return { success: true, redirectTo: '/business/dashboard/edit-profile' };
    }

    // -----------------------------------------------------------------
    // Double-charge guard
    // If the business already has a Stripe customer ID, a previous checkout
    // was started. Check whether an active subscription already exists
    // before creating a new session.
    // -----------------------------------------------------------------
    if (business.stripeCustomerId) {
      const subscriptions = await stripe.subscriptions.list({
        customer: business.stripeCustomerId,
        status: 'active',
        limit: 1,
      });

      if (subscriptions.data.length > 0) {
        // Payment succeeded but webhook hasn't activated the account yet.
        // Activate now so the user isn't stuck.
        await prisma.business.update({
          where: { id: business.id },
          data: {
            status: 'ACTIVE',
            stripeSubscriptionId: business.stripeSubscriptionId ?? subscriptions.data[0].id,
          },
        });

        return { success: true, redirectTo: '/business/dashboard/edit-profile' };
      }

      // Also check trialing (free trial) subscriptions
      const trialing = await stripe.subscriptions.list({
        customer: business.stripeCustomerId,
        status: 'trialing',
        limit: 1,
      });

      if (trialing.data.length > 0) {
        await prisma.business.update({
          where: { id: business.id },
          data: {
            status: 'ACTIVE',
            stripeSubscriptionId: business.stripeSubscriptionId ?? trialing.data[0].id,
          },
        });

        return { success: true, redirectTo: '/business/dashboard/edit-profile' };
      }
    }

    if (!process.env.STRIPE_PRICE_ID) {
      throw new Error('STRIPE_PRICE_ID environment variable is not set.');
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      throw new Error('NEXT_PUBLIC_APP_URL environment variable is not set.');
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      client_reference_id: business.id,
      customer_email: user.email ?? undefined,
      // Reuse an existing Stripe customer if one was already created
      ...(business.stripeCustomerId ? { customer: business.stripeCustomerId } : {}),
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${appUrl}/business/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/business/confirm`,
    });

    if (!checkoutSession.url) {
      return { success: false, error: 'Failed to create payment session. Please try again.' };
    }

    return { success: true, checkoutUrl: checkoutSession.url };
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

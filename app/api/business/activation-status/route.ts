/**
 * Activation status polling endpoint — GET /api/business/activation-status
 *
 * The /business/confirm page calls this endpoint every 3 seconds after the
 * user returns from Stripe checkout.
 *
 * Accepts an optional ?session_id=cs_... query parameter. When present and
 * the business is still PENDING, we verify the Stripe Checkout Session
 * directly rather than relying solely on the webhook having already fired.
 * This eliminates the race condition where payment succeeds but the webhook
 * arrives after the polling window closes.
 *
 * If the Stripe session shows payment_status === "paid", we activate the
 * business in the database immediately (idempotent — safe to run multiple
 * times) and return ACTIVE. The webhook will then be a no-op when it arrives.
 *
 * Returns: { status: "PENDING" | "ACTIVE" | "SUSPENDED" }
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/business/stripe';

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      business: {
        select: {
          id: true,
          status: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
        },
      },
    },
  });

  if (!user?.business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }

  const { business } = user;

  // Already active — return immediately, no Stripe call needed
  if (business.status === 'ACTIVE') {
    return NextResponse.json({ status: 'ACTIVE' });
  }

  // If a session_id was passed, verify directly with Stripe.
  // This covers the case where the webhook hasn't arrived yet but the
  // payment was successful.
  const sessionId = req.nextUrl.searchParams.get('session_id');

  if (sessionId && business.status === 'PENDING') {
    try {
      const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

      // Confirm the session belongs to this business (client_reference_id is set at creation)
      const sessionBelongsToBusiness = stripeSession.client_reference_id === business.id;

      if (sessionBelongsToBusiness && stripeSession.payment_status === 'paid') {
        // Payment confirmed — activate the business now without waiting for the webhook.
        // Using upsert-style update so this is idempotent if the webhook also fires.
        await prisma.business.update({
          where: { id: business.id },
          data: {
            status: 'ACTIVE',
            // Only overwrite these if they aren't already set by the webhook
            stripeCustomerId:
              business.stripeCustomerId ??
              (typeof stripeSession.customer === 'string' ? stripeSession.customer : null),
            stripeSubscriptionId:
              business.stripeSubscriptionId ??
              (typeof stripeSession.subscription === 'string' ? stripeSession.subscription : null),
          },
        });

        return NextResponse.json({ status: 'ACTIVE' });
      }
    } catch (err) {
      // Stripe call failed — fall through and return current DB status
      console.error('activation-status: Stripe session retrieval failed', err);
    }
  }

  return NextResponse.json({ status: business.status });
}

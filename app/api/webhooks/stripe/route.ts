/**
 * Stripe webhook handler — /api/webhooks/stripe
 *
 * Stripe sends POST requests to this endpoint whenever a subscription event
 * occurs. We verify the request is genuinely from Stripe (using the webhook
 * signing secret), then update the Business record in the database.
 *
 * Events handled:
 *   checkout.session.completed    → activate the business account
 *   invoice.payment_succeeded     → update the subscription renewal date
 *   invoice.payment_failed        → suspend the business account
 *   customer.subscription.deleted → suspend the business account
 *
 * IMPORTANT: We must read the body as raw text before any parsing.
 * Stripe uses the exact bytes of the body to compute the signature — if the
 * body is parsed (e.g. JSON.parse) first, the signature check will fail.
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/business/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  // Read raw body — must be text, not parsed JSON
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  // Verify the webhook came from Stripe — rejects replayed or forged requests
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  // Route each event type to the appropriate handler
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      default:
        // Other event types are ignored — Stripe may send events we don't handle
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Error handling webhook event ${event.type}:`, error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract a plain string ID from a Stripe expandable field (string | object | null). */
function extractId(field: string | { id: string } | null | undefined): string | null {
  if (!field) return null;
  return typeof field === 'string' ? field : field.id;
}

// ---------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------

/**
 * checkout.session.completed
 * The user completed payment. Activate the business and store the Stripe IDs.
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // client_reference_id is the business.id we set when creating the session
  const businessId = session.client_reference_id;

  if (!businessId) {
    console.error('checkout.session.completed: missing client_reference_id');
    return;
  }

  await prisma.business.update({
    where: { id: businessId },
    data: {
      status: 'ACTIVE',
      stripeCustomerId: extractId(session.customer),
      stripeSubscriptionId: extractId(session.subscription),
    },
  });
}

/**
 * invoice.payment_succeeded
 * A subscription payment went through. Update the renewal date.
 *
 * In Stripe API v2026+, the period end is available directly on the invoice
 * as `period_end` (a Unix timestamp). We convert it to a JS Date for Prisma.
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = extractId(invoice.customer);
  if (!customerId) return;

  const business = await prisma.business.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!business) {
    console.error(`invoice.payment_succeeded: no business found for customer ${customerId}`);
    return;
  }

  await prisma.business.update({
    where: { id: business.id },
    data: {
      // invoice.period_end is a Unix timestamp in seconds — multiply by 1000 for JS Date
      currentPeriodEnd: new Date(invoice.period_end * 1000),
      subscriptionStatus: 'active',
    },
  });
}

/**
 * invoice.payment_failed
 * A renewal payment failed. Suspend the account.
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = extractId(invoice.customer);
  if (!customerId) return;

  const business = await prisma.business.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!business) {
    console.error(`invoice.payment_failed: no business found for customer ${customerId}`);
    return;
  }

  await prisma.business.update({
    where: { id: business.id },
    data: { status: 'SUSPENDED' },
  });
}

/**
 * customer.subscription.deleted
 * The subscription was cancelled (by the customer or by Stripe). Suspend the account.
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = extractId(subscription.customer);
  if (!customerId) return;

  const business = await prisma.business.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!business) {
    console.error(`customer.subscription.deleted: no business found for customer ${customerId}`);
    return;
  }

  await prisma.business.update({
    where: { id: business.id },
    data: { status: 'SUSPENDED' },
  });
}

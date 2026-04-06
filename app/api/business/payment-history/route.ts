/**
 * GET /api/business/payment-history
 *
 * Returns the authenticated business's Stripe invoice history as a JSON array.
 * The client-side PaymentHistoryCard fetches this endpoint via TanStack Query.
 *
 * Each invoice entry contains:
 *   id        — Stripe invoice ID
 *   date      — Unix timestamp (seconds) of when the invoice was created
 *   amount    — Amount paid in cents (divide by 100 for display)
 *   status    — Stripe invoice status string (e.g. "paid", "open", "void")
 *   pdfUrl    — Link to the hosted invoice PDF (may be null)
 *
 * Returns an empty array when no Stripe customer is linked yet (new accounts
 * that have not completed payment setup).
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/business/stripe';

export interface PaymentHistoryItem {
  id: string;
  date: number;       // Unix timestamp in seconds
  amount: number;     // In cents
  status: string;
  pdfUrl: string | null;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const business = await prisma.business.findUnique({
    where: { ownerId: session.user.id },
    select: { stripeCustomerId: true },
  });

  // No Stripe customer yet — return empty list, not an error
  if (!business?.stripeCustomerId) {
    return NextResponse.json({ invoices: [] });
  }

  // Fetch the most recent 24 invoices for this customer from Stripe
  const { data: invoices } = await stripe.invoices.list({
    customer: business.stripeCustomerId,
    limit: 24,
  });

  const items: PaymentHistoryItem[] = invoices.map((inv) => ({
    id: inv.id,
    date: inv.created,
    amount: inv.amount_paid,
    status: inv.status ?? 'unknown',
    pdfUrl: inv.invoice_pdf ?? null,
  }));

  return NextResponse.json({ invoices: items });
}

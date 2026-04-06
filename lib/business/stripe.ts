/**
 * Stripe SDK singleton for the business panel.
 *
 * Initialises the Stripe client once using the server-side secret key and
 * exports it for use in server actions and API route handlers.
 *
 * IMPORTANT: This file must only ever be imported in server-side code
 * (Server Actions, Route Handlers, Server Components). The secret key must
 * never be sent to the browser.
 */

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set.');
}

// The `apiVersion` pin keeps behaviour consistent regardless of Stripe dashboard settings
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-03-25.dahlia',
});

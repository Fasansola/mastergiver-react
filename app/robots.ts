/**
 * robots.ts — Next.js generates /robots.txt from this file.
 *
 * Allows all crawlers on public pages.
 * Blocks dashboard, auth, and API routes.
 */

import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mastergiver.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/business/', '/profile/'],
        disallow: [
          '/business/dashboard/',
          '/business/signin',
          '/business/signup',
          '/business/reset-password',
          '/business/confirm',
          '/business/suspended',
          '/dashboard/',
          '/settings/',
          '/onboarding/',
          '/api/',
          '/logout',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

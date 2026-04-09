/**
 * Dynamic sitemap — Next.js generates /sitemap.xml from this file.
 *
 * Includes:
 *   - Static public pages (home)
 *   - All published business profiles (/business/[slug])
 *   - All published individual profiles (/profile/[username])
 */

import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mastergiver.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  // Published business profiles
  const businesses = await prisma.business.findMany({
    where: { published: true, status: 'ACTIVE' },
    select: { slug: true, updatedAt: true },
  });

  const businessRoutes: MetadataRoute.Sitemap = businesses.map((b) => ({
    url: `${BASE_URL}/business/${b.slug}`,
    lastModified: b.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Published individual profiles
  const profiles = await prisma.profile.findMany({
    where: { status: 'PUBLISHED' },
    select: { username: true, updatedAt: true },
  });

  const profileRoutes: MetadataRoute.Sitemap = profiles
    .filter((p) => p.username)
    .map((p) => ({
      url: `${BASE_URL}/profile/${p.username}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...businessRoutes, ...profileRoutes];
}

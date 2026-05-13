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
import { toCitySlug } from '@/lib/directory';

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
    {
      url: `${BASE_URL}/good-businesses`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Published business profiles
  let businesses: { slug: string; city: string | null; state: string | null; updatedAt: Date }[] = [];
  try {
    businesses = await prisma.business.findMany({
      where: { published: true, status: 'ACTIVE' },
      select: { slug: true, city: true, state: true, updatedAt: true },
    });
  } catch (err) {
    console.error('[sitemap] business query failed:', err);
  }

  const businessRoutes: MetadataRoute.Sitemap = businesses.map((b) => ({
    url: `${BASE_URL}/business/${b.slug}`,
    lastModified: b.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // GOOD Businesses city pages — one per unique city+state with active profiles
  const citySet = new Map<string, Date>();
  for (const b of businesses) {
    if (!b.city || !b.state) continue;
    const slug = toCitySlug(b.city, b.state);
    const existing = citySet.get(slug);
    if (!existing || b.updatedAt > existing) {
      citySet.set(slug, b.updatedAt);
    }
  }
  const cityRoutes: MetadataRoute.Sitemap = Array.from(citySet.entries()).map(
    ([slug, lastModified]) => ({
      url: `${BASE_URL}/good-businesses/${slug}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })
  );

  // Published individual profiles
  let profiles: { username: string | null; updatedAt: Date }[] = [];
  try {
    profiles = await prisma.profile.findMany({
      where: { status: 'PUBLISHED' },
      select: { username: true, updatedAt: true },
    });
  } catch (err) {
    console.error('[sitemap] profile query failed:', err);
  }

  const profileRoutes: MetadataRoute.Sitemap = profiles
    .filter((p) => p.username)
    .map((p) => ({
      url: `${BASE_URL}/profile/${p.username}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...businessRoutes, ...cityRoutes, ...profileRoutes];
}

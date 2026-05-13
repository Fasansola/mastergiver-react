/**
 * lib/directory.ts
 *
 * Database queries and URL utilities for the GOOD Businesses directory.
 * All queries filter to status: ACTIVE + published: true only.
 */

import { prisma } from '@/lib/prisma';

export interface DirectoryBusiness {
  slug: string;
  companyName: string | null;
  logo: string | null;
  city: string | null;
  state: string | null;
  tagline: string | null;
  causes: { cause: { name: string } }[];
}

export interface CityGroup {
  city: string;
  state: string;
  slug: string;
  count: number;
}

/**
 * Convert city + state into a URL-safe slug.
 * e.g. "New York" + "NY" → "new-york-ny"
 * e.g. "Winston-Salem" + "NC" → "winston-salem-nc"
 */
export function toCitySlug(city: string, state: string): string {
  const cityPart = city
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  const statePart = state.toLowerCase().replace(/[^a-z]/g, '');
  return `${cityPart}-${statePart}`;
}

/**
 * Parse a city-state slug back to display values.
 * Strategy: the last hyphen segment is always the 2-char state abbreviation.
 * e.g. "wilmington-nc" → { city: "Wilmington", state: "NC" }
 * e.g. "new-york-ny"   → { city: "New York",   state: "NY" }
 */
export function parseCitySlug(slug: string): { city: string; state: string } {
  const lastHyphen = slug.lastIndexOf('-');
  const cityRaw = slug.slice(0, lastHyphen).replace(/-/g, ' ');
  const stateRaw = slug.slice(lastHyphen + 1).toUpperCase();
  // Title-case each word of the city
  const city = cityRaw.replace(/\b\w/g, (c) => c.toUpperCase());
  return { city, state: stateRaw };
}

/** Fetch all active+published businesses, newest first. */
export async function getAllDirectoryBusinesses(): Promise<DirectoryBusiness[]> {
  try {
    return await prisma.business.findMany({
      where: { status: 'ACTIVE', published: true },
      select: {
        slug: true,
        companyName: true,
        logo: true,
        city: true,
        state: true,
        tagline: true,
        causes: { select: { cause: { select: { name: true } } } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  } catch (err) {
    console.error('[directory] getAllDirectoryBusinesses failed:', err);
    return [];
  }
}

/**
 * Aggregate all active cities, sorted by business count descending.
 * Used to populate the city browse grid and search typeahead.
 */
export async function getCityGroups(): Promise<CityGroup[]> {
  try {
    const businesses = await prisma.business.findMany({
      where: {
        status: 'ACTIVE',
        published: true,
        city: { not: null },
        state: { not: null },
      },
      select: { city: true, state: true },
    });

    const map = new Map<string, { city: string; state: string; count: number }>();

    for (const b of businesses) {
      if (!b.city || !b.state) continue;
      const key = toCitySlug(b.city, b.state);
      const existing = map.get(key);
      if (existing) {
        existing.count++;
      } else {
        map.set(key, { city: b.city, state: b.state, count: 1 });
      }
    }

    return Array.from(map.entries())
      .map(([slug, v]) => ({ ...v, slug }))
      .sort((a, b) => b.count - a.count);
  } catch (err) {
    console.error('[directory] getCityGroups failed:', err);
    return [];
  }
}

/**
 * Fetch all active+published businesses for a given city-state slug.
 * Returns empty array (not 404) if the city has no matching businesses.
 */
export async function getBusinessesByCity(
  citySlug: string
): Promise<DirectoryBusiness[]> {
  const { city, state } = parseCitySlug(citySlug);

  try {
    return await prisma.business.findMany({
      where: {
        status: 'ACTIVE',
        published: true,
        city: { equals: city, mode: 'insensitive' },
        state: { equals: state, mode: 'insensitive' },
      },
      select: {
        slug: true,
        companyName: true,
        logo: true,
        city: true,
        state: true,
        tagline: true,
        causes: { select: { cause: { select: { name: true } } } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  } catch (err) {
    console.error('[directory] getBusinessesByCity failed:', err);
    return [];
  }
}

/**
 * lib/directory.ts
 *
 * Database queries and URL utilities for the GOOD Businesses directory.
 * All queries filter to status: ACTIVE + published: true only.
 * All query functions return empty arrays on error so pages never crash.
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
  /** Number of active+published businesses. 0 = "Coming Soon" city. */
  count: number;
}

/**
 * Static list of cities the platform supports or plans to expand into.
 * Cities in this list that have no active businesses will appear in search
 * results as "Coming Soon" to convey ecosystem growth.
 * Add new cities here as the platform expands.
 */
const SUPPORTED_CITIES: { city: string; state: string }[] = [
  { city: 'Wilmington', state: 'NC' },
  { city: 'Charlotte', state: 'NC' },
  { city: 'Raleigh', state: 'NC' },
  { city: 'Durham', state: 'NC' },
  { city: 'Greensboro', state: 'NC' },
  { city: 'Winston-Salem', state: 'NC' },
  { city: 'Fayetteville', state: 'NC' },
  { city: 'Charleston', state: 'SC' },
  { city: 'Columbia', state: 'SC' },
  { city: 'Greenville', state: 'SC' },
  { city: 'Myrtle Beach', state: 'SC' },
  { city: 'Atlanta', state: 'GA' },
  { city: 'Savannah', state: 'GA' },
  { city: 'Augusta', state: 'GA' },
  { city: 'Nashville', state: 'TN' },
  { city: 'Memphis', state: 'TN' },
  { city: 'Knoxville', state: 'TN' },
  { city: 'Richmond', state: 'VA' },
  { city: 'Virginia Beach', state: 'VA' },
  { city: 'Jacksonville', state: 'FL' },
  { city: 'Tampa', state: 'FL' },
  { city: 'Orlando', state: 'FL' },
  { city: 'Miami', state: 'FL' },
  { city: 'Austin', state: 'TX' },
  { city: 'Dallas', state: 'TX' },
  { city: 'Houston', state: 'TX' },
  { city: 'San Antonio', state: 'TX' },
  { city: 'Denver', state: 'CO' },
  { city: 'Phoenix', state: 'AZ' },
  { city: 'Los Angeles', state: 'CA' },
  { city: 'San Diego', state: 'CA' },
  { city: 'San Francisco', state: 'CA' },
  { city: 'Seattle', state: 'WA' },
  { city: 'Portland', state: 'OR' },
  { city: 'Chicago', state: 'IL' },
  { city: 'New York', state: 'NY' },
  { city: 'Boston', state: 'MA' },
  { city: 'Philadelphia', state: 'PA' },
];

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
 * Returns safe defaults if the slug is malformed.
 */
export function parseCitySlug(slug: string): { city: string; state: string } {
  const lastHyphen = slug.lastIndexOf('-');
  if (lastHyphen <= 0) {
    return { city: slug.replace(/-/g, ' '), state: '' };
  }
  const cityRaw = slug.slice(0, lastHyphen).replace(/-/g, ' ');
  const stateRaw = slug.slice(lastHyphen + 1).toUpperCase();
  const city = cityRaw.replace(/\b\w/g, (c) => c.toUpperCase());
  return { city, state: stateRaw };
}

/** Fetch all active+published businesses, newest first. */
export async function getAllDirectoryBusinesses(): Promise<DirectoryBusiness[]> {
  try {
    return await prisma.business.findMany({
      where: { status: 'ACTIVE', published: true, featuredInDirectory: true },
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
    console.error('[directory] getAllDirectoryBusinesses failed:', err instanceof Error ? err.message : String(err));
    return [];
  }
}

/**
 * Aggregate all active cities merged with the supported cities list.
 * Cities with active businesses have count > 0.
 * Cities in SUPPORTED_CITIES but with no active businesses have count = 0
 * and appear as "Coming Soon" in the search typeahead.
 * Sorted: active cities (by count desc) first, then Coming Soon alphabetically.
 */
export async function getCityGroups(): Promise<CityGroup[]> {
  try {
    const businesses = await prisma.business.findMany({
      where: {
        status: 'ACTIVE',
        published: true,
        featuredInDirectory: true,
        city: { not: null },
        state: { not: null },
      },
      select: { city: true, state: true },
    });

    const map = new Map<string, CityGroup>();

    // Seed with active businesses
    for (const b of businesses) {
      if (!b.city || !b.state) continue;
      const key = toCitySlug(b.city, b.state);
      const existing = map.get(key);
      if (existing) {
        existing.count++;
      } else {
        map.set(key, { city: b.city, state: b.state, slug: key, count: 1 });
      }
    }

    // Add supported cities not yet active as "Coming Soon" (count: 0)
    for (const { city, state } of SUPPORTED_CITIES) {
      const key = toCitySlug(city, state);
      if (!map.has(key)) {
        map.set(key, { city, state, slug: key, count: 0 });
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      // Active cities first, sorted by count desc
      if (a.count > 0 && b.count === 0) return -1;
      if (a.count === 0 && b.count > 0) return 1;
      if (a.count !== b.count) return b.count - a.count;
      // Tie-break alphabetically
      return a.city.localeCompare(b.city);
    });
  } catch (err) {
    console.error('[directory] getCityGroups failed:', err instanceof Error ? err.message : String(err));
    return [];
  }
}

/**
 * Fetch all active+published businesses for a given city-state slug.
 * Respects featuredInDirectory so an admin hide removes the business from city
 * pages as well as the main hub.
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
        featuredInDirectory: true,
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
    console.error('[directory] getBusinessesByCity failed:', err instanceof Error ? err.message : String(err));
    return [];
  }
}

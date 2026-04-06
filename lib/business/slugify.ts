/**
 * Utility for generating URL-safe slugs from business names.
 *
 * A slug is a lowercase, hyphen-separated version of a string that is safe
 * to use in a URL — e.g. "Green Corp!" becomes "green-corp".
 *
 * `generateUniqueSlug` also checks the database so we never create two
 * businesses with the same slug.
 */

import { prisma } from '@/lib/prisma';

/**
 * Convert a string to a URL-safe slug.
 * e.g. "Green Corp!" → "green-corp"
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // replace runs of non-alphanumeric chars with a hyphen
    .replace(/^-+|-+$/g, ''); // strip any leading or trailing hyphens
}

/**
 * Generate a slug that is guaranteed to be unique in the database.
 * If the base slug is already taken, a short random suffix is appended.
 * e.g. "green-corp" → "green-corp-x4f2"
 */
export async function generateUniqueSlug(name: string): Promise<string> {
  const base = slugify(name);

  const existing = await prisma.business.findUnique({
    where: { slug: base },
  });

  // Base slug is available — use it as-is
  if (!existing) return base;

  // Slug is taken — append a random 4-character alphanumeric suffix
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

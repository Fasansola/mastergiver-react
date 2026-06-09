/**
 * Shared blog utilities — used by API routes, admin pages, and public pages.
 */

/**
 * Converts a string into a URL-safe slug.
 * e.g. "Hello World! It's Great" → "hello-world-its-great"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, '')       // strip apostrophes before removing punctuation
    .replace(/[^a-z0-9\s-]/g, '') // remove all non-alphanumeric chars
    .trim()
    .replace(/\s+/g, '-')       // replace spaces with hyphens
    .replace(/-+/g, '-');       // collapse consecutive hyphens
}

/**
 * Estimates reading time from HTML content.
 * Strips tags, counts words, assumes 200 wpm average.
 * Returns minutes rounded up (minimum 1).
 */
export function calculateReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = text.split(' ').filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Formats a date as a human-readable string.
 * e.g. "June 9, 2026"
 */
export function formatPostDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Strips HTML tags and truncates to a plain-text excerpt.
 * Used as a fallback when no explicit excerpt is set.
 */
export function excerptFromContent(html: string, maxLength = 160): string {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

/**
 * Tests for the slugify utility.
 *
 * Only tests the pure `slugify()` function — `generateUniqueSlug` is not
 * tested here because it queries the database.
 */

import { describe, it, expect } from 'vitest';
import { slugify } from '../slugify';

describe('slugify', () => {
  // Basic conversions
  it('converts a simple name to lowercase with hyphens', () => {
    expect(slugify('Green Corp')).toBe('green-corp');
  });

  it('converts a single word', () => {
    expect(slugify('Acme')).toBe('acme');
  });

  it('handles multiple spaces between words', () => {
    expect(slugify('Green   Corp')).toBe('green-corp');
  });

  it('trims leading and trailing whitespace', () => {
    expect(slugify('  Acme Corp  ')).toBe('acme-corp');
  });

  // Special characters
  it('strips punctuation', () => {
    expect(slugify('Green Corp!')).toBe('green-corp');
  });

  it('replaces ampersands with a hyphen', () => {
    expect(slugify('Salt & Light')).toBe('salt-light');
  });

  it('handles apostrophes', () => {
    expect(slugify("O'Brien's")).toBe('o-brien-s');
  });

  it('strips special characters entirely', () => {
    expect(slugify('Café & Bistro')).toBe('caf-bistro');
  });

  // Numbers
  it('preserves numbers', () => {
    expect(slugify('Company 42')).toBe('company-42');
  });

  it('handles a name that is entirely numeric', () => {
    expect(slugify('2024')).toBe('2024');
  });

  // Edge cases — leading/trailing hyphens are stripped
  it('does not produce a leading hyphen', () => {
    expect(slugify('!!! Name')).toBe('name');
  });

  it('does not produce a trailing hyphen', () => {
    expect(slugify('Name !!!')).toBe('name');
  });

  it('collapses consecutive special characters into a single hyphen', () => {
    expect(slugify('A -- B')).toBe('a-b');
  });

  // Real-world business names
  it('handles a realistic long business name', () => {
    expect(slugify('Greater Chicago Community Foundation')).toBe(
      'greater-chicago-community-foundation'
    );
  });

  it('handles a name with a comma', () => {
    expect(slugify('Smith, Jones & Partners')).toBe('smith-jones-partners');
  });
});

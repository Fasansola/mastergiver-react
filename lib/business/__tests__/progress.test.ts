/**
 * Tests for the business profile completion progress calculator.
 *
 * These tests verify two things:
 *   1. `calculateProgress` returns the correct percentage for every combination
 *      of filled / empty sections.
 *   2. `getSectionCompletionStatus` returns a boolean per section that matches
 *      what the calculator uses internally.
 *
 * No database or external services are involved — progress.ts is a pure function.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateProgress,
  getSectionCompletionStatus,
  type BusinessForProgress,
} from '../progress';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** A completely empty business — every section is incomplete. */
const empty: BusinessForProgress = {
  companyName: null,
  aboutUs: null,
  yearsOfInvolvement: null,
  totalContributions: null,
  activePartners: null,
  causes: [],
  partners: [],
  communityEvents: [],
  endorsements: [],
  offers: [],
};

/** A fully completed business — every section has at least the minimum data. */
const full: BusinessForProgress = {
  companyName: 'Acme Corp',
  aboutUs: 'We are a great company.',
  yearsOfInvolvement: 5,
  totalContributions: 10000,
  activePartners: 3,
  causes: [{ id: 'c1' }],
  partners: [{ id: 'p1' }],
  communityEvents: [{ id: 'e1' }],
  endorsements: [{ id: 'en1' }],
  offers: [{ id: 'o1' }],
};

// ---------------------------------------------------------------------------
// calculateProgress
// ---------------------------------------------------------------------------

describe('calculateProgress', () => {
  it('returns 0 when no sections are complete', () => {
    expect(calculateProgress(empty)).toBe(0);
  });

  it('returns 100 when all 7 sections are complete', () => {
    expect(calculateProgress(full)).toBe(100);
  });

  it('returns ~14 (rounded) when exactly 1 section is complete', () => {
    // Only About Us filled in (requires both companyName and aboutUs)
    const oneSection: BusinessForProgress = { ...empty, companyName: 'Acme', aboutUs: 'We give back.' };
    expect(calculateProgress(oneSection)).toBe(14); // Math.round(1/7 * 100)
  });

  it('returns ~29 when 2 sections are complete', () => {
    const two: BusinessForProgress = {
      ...empty,
      companyName: 'Acme',
      aboutUs: 'We give back.',
      yearsOfInvolvement: 3,
    };
    expect(calculateProgress(two)).toBe(29); // Math.round(2/7 * 100)
  });

  it('returns ~43 when 3 sections are complete', () => {
    const three: BusinessForProgress = {
      ...empty,
      companyName: 'Acme',
      aboutUs: 'We give back.',
      yearsOfInvolvement: 3,
      partners: [{ id: 'p1' }],
    };
    expect(calculateProgress(three)).toBe(43); // Math.round(3/7 * 100)
  });

  it('returns ~57 when 4 sections are complete', () => {
    const four: BusinessForProgress = {
      ...empty,
      companyName: 'Acme',
      aboutUs: 'We give back.',
      yearsOfInvolvement: 3,
      partners: [{ id: 'p1' }],
      causes: [{ id: 'c1' }],
    };
    expect(calculateProgress(four)).toBe(57); // Math.round(4/7 * 100)
  });

  it('returns ~71 when 5 sections are complete', () => {
    const five: BusinessForProgress = {
      ...empty,
      companyName: 'Acme',
      aboutUs: 'We give back.',
      yearsOfInvolvement: 3,
      partners: [{ id: 'p1' }],
      causes: [{ id: 'c1' }],
      communityEvents: [{ id: 'e1' }],
    };
    expect(calculateProgress(five)).toBe(71); // Math.round(5/7 * 100)
  });

  it('returns ~86 when 6 sections are complete', () => {
    const six: BusinessForProgress = {
      ...empty,
      companyName: 'Acme',
      aboutUs: 'We give back.',
      yearsOfInvolvement: 3,
      partners: [{ id: 'p1' }],
      causes: [{ id: 'c1' }],
      communityEvents: [{ id: 'e1' }],
      endorsements: [{ id: 'en1' }],
    };
    expect(calculateProgress(six)).toBe(86); // Math.round(6/7 * 100)
  });

  // --- Section 1: About Us ---

  it('Section 1 (About Us): both companyName and aboutUs must be present', () => {
    expect(calculateProgress({ ...empty, companyName: 'A', aboutUs: 'We care.' })).toBe(14);
  });

  it('Section 1 (About Us): companyName alone is NOT complete', () => {
    expect(calculateProgress({ ...empty, companyName: 'Acme' })).toBe(0);
  });

  it('Section 1 (About Us): aboutUs alone is NOT complete', () => {
    expect(calculateProgress({ ...empty, aboutUs: 'We care.' })).toBe(0);
  });

  it('Section 1 (About Us): whitespace-only companyName is NOT complete', () => {
    expect(calculateProgress({ ...empty, companyName: '   ', aboutUs: 'We care.' })).toBe(0);
  });

  it('Section 1 (About Us): null companyName is NOT complete', () => {
    expect(calculateProgress({ ...empty, companyName: null, aboutUs: 'We care.' })).toBe(0);
  });

  // --- Section 2: Impact Summary ---

  it('Section 2: complete when only yearsOfInvolvement is set', () => {
    expect(calculateProgress({ ...empty, yearsOfInvolvement: 1 })).toBe(14);
  });

  it('Section 2: complete when only totalContributions is set', () => {
    expect(calculateProgress({ ...empty, totalContributions: 500 })).toBe(14);
  });

  it('Section 2: complete when only activePartners is set', () => {
    expect(calculateProgress({ ...empty, activePartners: 0 })).toBe(14);
  });

  it('Section 2: NOT complete when all three are null', () => {
    expect(calculateProgress(empty)).toBe(0);
  });

  // --- Sections 3–7: relation-based ---

  it('Section 3 (Partners): complete with 1 partner', () => {
    expect(calculateProgress({ ...empty, partners: [{ id: 'p1' }] })).toBe(14);
  });

  it('Section 3 (Partners): NOT complete with empty array', () => {
    expect(calculateProgress({ ...empty, partners: [] })).toBe(0);
  });

  it('Section 4 (Areas of Impact): complete with 1 cause', () => {
    expect(calculateProgress({ ...empty, causes: [{ id: 'c1' }] })).toBe(14);
  });

  it('Section 5 (Community Events): complete with 1 event', () => {
    expect(calculateProgress({ ...empty, communityEvents: [{ id: 'e1' }] })).toBe(14);
  });

  it('Section 6 (Endorsements): complete with 1 endorsement', () => {
    expect(calculateProgress({ ...empty, endorsements: [{ id: 'en1' }] })).toBe(14);
  });

  it('Section 7 (Offers): complete with 1 offer', () => {
    expect(calculateProgress({ ...empty, offers: [{ id: 'o1' }] })).toBe(14);
  });

  it('multiple entries in a relation still count as one completed section', () => {
    // 3 partners should still only count section 3 once
    const manyPartners: BusinessForProgress = {
      ...empty,
      partners: [{ id: 'p1' }, { id: 'p2' }, { id: 'p3' }],
    };
    expect(calculateProgress(manyPartners)).toBe(14); // only section 3
  });
});

// ---------------------------------------------------------------------------
// getSectionCompletionStatus
// ---------------------------------------------------------------------------

describe('getSectionCompletionStatus', () => {
  it('returns 7 booleans', () => {
    expect(getSectionCompletionStatus(empty)).toHaveLength(7);
  });

  it('all false when nothing is filled in', () => {
    const status = getSectionCompletionStatus(empty);
    expect(status.every((s) => s === false)).toBe(true);
  });

  it('all true when everything is filled in', () => {
    const status = getSectionCompletionStatus(full);
    expect(status.every((s) => s === true)).toBe(true);
  });

  it('correctly identifies which individual sections are complete', () => {
    // Fill in sections 1, 4, 7 only
    const partial: BusinessForProgress = {
      ...empty,
      companyName: 'Acme',        // section 1 (requires both name + aboutUs)
      aboutUs: 'We give back.',   // section 1
      causes: [{ id: 'c1' }],    // section 4
      offers: [{ id: 'o1' }],    // section 7
    };
    const [s1, s2, s3, s4, s5, s6, s7] = getSectionCompletionStatus(partial);
    expect(s1).toBe(true);
    expect(s2).toBe(false);
    expect(s3).toBe(false);
    expect(s4).toBe(true);
    expect(s5).toBe(false);
    expect(s6).toBe(false);
    expect(s7).toBe(true);
  });

  it('is consistent with calculateProgress', () => {
    // The count of trues should match what calculateProgress uses
    const status = getSectionCompletionStatus(full);
    const trueCount = status.filter(Boolean).length;
    expect(calculateProgress(full)).toBe(Math.round((trueCount / 7) * 100));
  });
});

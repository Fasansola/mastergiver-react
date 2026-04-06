/**
 * Business profile completion progress calculator.
 *
 * There are 7 accordion sections on the edit-profile page. Each completed
 * section contributes ~14.3% to the overall completion score (100 ÷ 7).
 *
 * A section is considered complete when it has been saved at least once —
 * defined by whether the relevant DB fields are populated.
 *
 * This is a pure function (no DB access, no side effects) so it is easy to
 * test and can be called from both the sidebar and any other UI that needs
 * to show completion state.
 */

/**
 * The subset of the Business record (plus relation counts) that the progress
 * calculator needs. Keeping this narrow means we only SELECT what we use.
 */
export type BusinessForProgress = {
  // Section 1 — About Us
  companyName: string | null;
  aboutUs: string | null;

  // Section 2 — Impact Summary
  yearsOfInvolvement: number | null;
  totalContributions: unknown; // Prisma Decimal — we only need null-check
  activePartners: number | null;

  // Sections 3–7 — relation-based (complete = at least one record saved)
  causes: unknown[];         // Section 4 — Areas of Impact
  partners: unknown[];       // Section 3 — Community Partners
  communityEvents: unknown[]; // Section 5 — In the Community
  endorsements: unknown[];   // Section 6 — Endorsements
  offers: unknown[];         // Section 7 — Community Offers
};

/** How many sections exist in total. */
const TOTAL_SECTIONS = 7;

/**
 * Returns true when the "About Us" section has enough content to be published.
 * Both a company name and an "About Us" description must be present — these
 * are the minimum fields a visitor needs to understand who the business is.
 */
function isAboutUsComplete(b: BusinessForProgress): boolean {
  const hasName = b.companyName !== null && b.companyName.trim().length > 0;
  const hasAbout = b.aboutUs !== null && b.aboutUs.trim().length > 0;
  return hasName && hasAbout;
}

/**
 * Returns true when the "Impact Summary" section has been saved.
 * Any one of the three fields being present counts as saved.
 */
function isImpactSummaryComplete(b: BusinessForProgress): boolean {
  return (
    b.yearsOfInvolvement !== null ||
    b.totalContributions !== null ||
    b.activePartners !== null
  );
}

/**
 * Calculate the overall profile completion percentage (0–100).
 *
 * Each section contributes an equal share. The result is rounded to the
 * nearest whole number so the UI always shows a clean integer.
 */
export function calculateProgress(business: BusinessForProgress): number {
  // Build an array of booleans — one per section — then count the trues
  const completedSections = [
    isAboutUsComplete(business),                  // Section 1
    isImpactSummaryComplete(business),            // Section 2
    business.partners.length > 0,                 // Section 3
    business.causes.length > 0,                   // Section 4
    business.communityEvents.length > 0,          // Section 5
    business.endorsements.length > 0,             // Section 6
    business.offers.length > 0,                   // Section 7
  ].filter(Boolean).length;

  return Math.round((completedSections / TOTAL_SECTIONS) * 100);
}

/**
 * Returns an array of 7 booleans — one per section — so the UI can mark
 * individual sections as complete without re-running the full calculation.
 */
export function getSectionCompletionStatus(business: BusinessForProgress): boolean[] {
  return [
    isAboutUsComplete(business),
    isImpactSummaryComplete(business),
    business.partners.length > 0,
    business.causes.length > 0,
    business.communityEvents.length > 0,
    business.endorsements.length > 0,
    business.offers.length > 0,
  ];
}

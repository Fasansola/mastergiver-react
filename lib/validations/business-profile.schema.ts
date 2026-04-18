/**
 * Zod validation schemas for the Edit Profile page sections.
 *
 * One schema per accordion section. Used in both the client-side form
 * (via React Hook Form + zodResolver) and the server actions.
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Section 1 — About Us
// ---------------------------------------------------------------------------

export const aboutUsSchema = z.object({
  logo: z.string().nullable().optional(),
  coverPhoto: z.string().nullable().optional(),
  companyName: z.string().min(1, 'Company name is required').max(100),
  address: z.string().max(200).nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  state: z.string().max(100).nullable().optional(),
  zipCode: z.string().max(20).nullable().optional(),
  aboutUs: z.string().max(500, 'About Us must be 500 characters or fewer').nullable().optional(),
  tagline: z.string().max(200).nullable().optional(),
  website: z.string().url('Please enter a valid URL').or(z.literal('')).nullable().optional(),
});

export type AboutUsInput = z.infer<typeof aboutUsSchema>;

// ---------------------------------------------------------------------------
// Section 2 — Impact Summary
// ---------------------------------------------------------------------------

export const impactSummarySchema = z.object({
  yearsOfInvolvement: z
    .number({ error: 'Enter a number' })
    .int()
    .min(0)
    .nullable()
    .optional(),
  totalContributions: z
    .number({ error: 'Enter a number' })
    .min(0)
    .nullable()
    .optional(),
  activePartners: z
    .number({ error: 'Enter a number' })
    .int()
    .min(0)
    .nullable()
    .optional(),
});

export type ImpactSummaryInput = z.infer<typeof impactSummarySchema>;

// ---------------------------------------------------------------------------
// Section 3 — Community Partners (one entry at a time)
// ---------------------------------------------------------------------------

export const partnerSchema = z.object({
  image: z.string().nullable().optional(),
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().min(1, 'Description is required').max(1000),
});

export type PartnerInput = z.infer<typeof partnerSchema>;

// ---------------------------------------------------------------------------
// Section 4 — Areas of Impact
// ---------------------------------------------------------------------------

export const areasOfImpactSchema = z.object({
  causeIds: z.array(z.string()),
});

export type AreasOfImpactInput = z.infer<typeof areasOfImpactSchema>;

// ---------------------------------------------------------------------------
// Section 5 — In the Community (one entry at a time)
// ---------------------------------------------------------------------------

export const communityEventSchema = z.object({
  photo: z.string({ error: 'Photo is required' }).min(1, 'Photo is required'),
  description: z.string().min(1, 'Description is required').max(1000),
  externalUrl: z
    .string()
    .url('Please enter a valid URL')
    .or(z.literal(''))
    .nullable()
    .optional(),
});

export type CommunityEventInput = z.infer<typeof communityEventSchema>;

// ---------------------------------------------------------------------------
// Section 6 — Endorsements (one entry at a time)
// ---------------------------------------------------------------------------

export const endorsementSchema = z.object({
  endorsingOrg: z.string().min(1, 'Organization name is required').max(200),
  endorserName: z.string().max(200).nullable().optional(),
  endorsementStatement: z.string().min(1, 'Statement is required').max(1000),
});

export type EndorsementInput = z.infer<typeof endorsementSchema>;

// ---------------------------------------------------------------------------
// Section 7 — Community Offers (one entry at a time)
// ---------------------------------------------------------------------------

export const offerSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(1000),
  link: z
    .string()
    .url('Please enter a valid URL')
    .or(z.literal(''))
    .nullable()
    .optional(),
  offerCode: z.string().max(100).nullable().optional(),
  // Comes from an <input type="date"> so it's a string like "2025-12-31"
  expiresAt: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        // Compare date strings directly (YYYY-MM-DD) — avoids timezone issues
        const today = new Date().toISOString().slice(0, 10);
        return val >= today;
      },
      { message: 'Expiry date must be today or in the future' },
    ),
});

export type OfferInput = z.infer<typeof offerSchema>;

// ---------------------------------------------------------------------------
// Section 8 — Impact Record (one entry at a time)
// ---------------------------------------------------------------------------

export const impactRecordSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  causeId: z.string().min(1, 'Area of impact is required'),
  organization: z.string().optional().nullable(),
  impactType: z.enum(['ONE_TIME', 'ONGOING']),
  startYear: z.number().int().min(1900).max(2200),
  endYear: z.number().int().min(1900).max(2200).optional().nullable(),
  isPresent: z.boolean(),
  contributionType: z
    .enum(['DONATION', 'SPONSORSHIP', 'VOLUNTEER_WORK', 'EVENT_PROGRAM', 'IN_KIND_SUPPORT'])
    .optional()
    .nullable(),
  amount: z.number().positive().optional().nullable(),
  details: z.string().max(500).optional().nullable(),
});

export type ImpactRecordInput = z.infer<typeof impactRecordSchema>;

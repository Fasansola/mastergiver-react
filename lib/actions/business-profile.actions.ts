'use server';

/**
 * Server actions for the Edit Profile page.
 *
 * Each action is responsible for one section of the accordion (or one
 * CRUD operation on a multi-entry section). All actions:
 *   - Verify the user's session
 *   - Look up their Business record (so we can't spoof another business's ID)
 *   - Validate input with Zod
 *   - Mutate the database
 *   - Return ActionResult
 */

import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import {
  aboutUsSchema,
  impactSummarySchema,
  partnerSchema,
  areasOfImpactSchema,
  communityEventSchema,
  endorsementSchema,
  offerSchema,
  type AboutUsInput,
  type ImpactSummaryInput,
  type PartnerInput,
  type AreasOfImpactInput,
  type CommunityEventInput,
  type EndorsementInput,
  type OfferInput,
} from '@/lib/validations/business-profile.schema';
import type { ActionResult } from '@/lib/types/actions';

// ---------------------------------------------------------------------------
// Auth helper — used by every action below
// ---------------------------------------------------------------------------

/** Fetch the authenticated user's Business record or return null. */
async function getAuthenticatedBusiness() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.business.findUnique({
    where: { ownerId: session.user.id },
  });
}

// ---------------------------------------------------------------------------
// Section 1 — About Us
// ---------------------------------------------------------------------------

export async function saveAboutUsAction(data: AboutUsInput): Promise<ActionResult> {
  const business = await getAuthenticatedBusiness();
  if (!business) return { success: false, error: 'Unauthorized' };

  const parsed = aboutUsSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: 'Invalid input.' };

  const { logo, coverPhoto, companyName, address, city, zipCode, aboutUs, tagline, website } =
    parsed.data;

  await prisma.business.update({
    where: { id: business.id },
    data: {
      ...(logo !== undefined && { logo }),
      ...(coverPhoto !== undefined && { coverPhoto }),
      companyName,
      ...(address !== undefined && { address }),
      ...(city !== undefined && { city }),
      ...(zipCode !== undefined && { zipCode }),
      ...(aboutUs !== undefined && { aboutUs }),
      ...(tagline !== undefined && { tagline }),
      ...(website !== undefined && { website: website || null }),
    },
  });

  return { success: true };
}

// ---------------------------------------------------------------------------
// Section 2 — Impact Summary
// ---------------------------------------------------------------------------

export async function saveImpactSummaryAction(
  data: ImpactSummaryInput,
): Promise<ActionResult> {
  const business = await getAuthenticatedBusiness();
  if (!business) return { success: false, error: 'Unauthorized' };

  const parsed = impactSummarySchema.safeParse(data);
  if (!parsed.success) return { success: false, error: 'Invalid input.' };

  await prisma.business.update({
    where: { id: business.id },
    data: {
      yearsOfInvolvement: parsed.data.yearsOfInvolvement ?? null,
      // totalContributions is a Prisma Decimal — pass the number directly
      totalContributions: parsed.data.totalContributions ?? null,
      activePartners: parsed.data.activePartners ?? null,
    },
  });

  return { success: true };
}

// ---------------------------------------------------------------------------
// Section 3 — Community Partners (CRUD)
// ---------------------------------------------------------------------------

export async function createPartnerAction(
  data: PartnerInput,
): Promise<ActionResult<{ id: string }>> {
  const business = await getAuthenticatedBusiness();
  if (!business) return { success: false, error: 'Unauthorized' };

  const parsed = partnerSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: 'Invalid input.' };

  const partner = await prisma.businessPartner.create({
    data: {
      businessId: business.id,
      name: parsed.data.name,
      description: parsed.data.description,
      image: parsed.data.image ?? null,
    },
  });

  return { success: true, id: partner.id };
}

export async function updatePartnerAction(
  id: string,
  data: PartnerInput,
): Promise<ActionResult> {
  const business = await getAuthenticatedBusiness();
  if (!business) return { success: false, error: 'Unauthorized' };

  const parsed = partnerSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: 'Invalid input.' };

  try {
    await prisma.businessPartner.update({
      where: { id, businessId: business.id },
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
        image: parsed.data.image ?? null,
      },
    });
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === 'P2025') return { success: false, error: 'Partner not found.' };
    throw e;
  }

  return { success: true };
}

export async function deletePartnerAction(id: string): Promise<ActionResult> {
  const business = await getAuthenticatedBusiness();
  if (!business) return { success: false, error: 'Unauthorized' };

  await prisma.businessPartner.deleteMany({
    where: { id, businessId: business.id },
  });

  return { success: true };
}

// ---------------------------------------------------------------------------
// Section 4 — Areas of Impact
// ---------------------------------------------------------------------------

export async function saveAreasOfImpactAction(
  data: AreasOfImpactInput,
): Promise<ActionResult> {
  const business = await getAuthenticatedBusiness();
  if (!business) return { success: false, error: 'Unauthorized' };

  const parsed = areasOfImpactSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: 'Please select at least one area.' };

  // Replace all existing cause selections with the new set in one transaction
  await prisma.$transaction([
    prisma.businessCause.deleteMany({ where: { businessId: business.id } }),
    prisma.businessCause.createMany({
      data: parsed.data.causeIds.map((causeId) => ({
        businessId: business.id,
        causeId,
      })),
    }),
  ]);

  return { success: true };
}

// ---------------------------------------------------------------------------
// Section 5 — In the Community (CRUD)
// ---------------------------------------------------------------------------

export async function createCommunityEventAction(
  data: CommunityEventInput,
): Promise<ActionResult<{ id: string }>> {
  const business = await getAuthenticatedBusiness();
  if (!business) return { success: false, error: 'Unauthorized' };

  const parsed = communityEventSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: 'Invalid input.' };

  const event = await prisma.businessCommunityEvent.create({
    data: {
      businessId: business.id,
      description: parsed.data.description,
      photo: parsed.data.photo ?? null,
      externalUrl: parsed.data.externalUrl || null,
    },
  });

  return { success: true, id: event.id };
}

export async function updateCommunityEventAction(
  id: string,
  data: CommunityEventInput,
): Promise<ActionResult> {
  const business = await getAuthenticatedBusiness();
  if (!business) return { success: false, error: 'Unauthorized' };

  const parsed = communityEventSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: 'Invalid input.' };

  try {
    await prisma.businessCommunityEvent.update({
      where: { id, businessId: business.id },
      data: {
        description: parsed.data.description,
        photo: parsed.data.photo ?? null,
        externalUrl: parsed.data.externalUrl || null,
      },
    });
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === 'P2025') return { success: false, error: 'Event not found.' };
    throw e;
  }

  return { success: true };
}

export async function deleteCommunityEventAction(id: string): Promise<ActionResult> {
  const business = await getAuthenticatedBusiness();
  if (!business) return { success: false, error: 'Unauthorized' };

  await prisma.businessCommunityEvent.deleteMany({
    where: { id, businessId: business.id },
  });

  return { success: true };
}

// ---------------------------------------------------------------------------
// Section 6 — Endorsements (CRUD)
// ---------------------------------------------------------------------------

export async function createEndorsementAction(
  data: EndorsementInput,
): Promise<ActionResult<{ id: string }>> {
  const business = await getAuthenticatedBusiness();
  if (!business) return { success: false, error: 'Unauthorized' };

  const parsed = endorsementSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: 'Invalid input.' };

  const endorsement = await prisma.businessEndorsement.create({
    data: {
      businessId: business.id,
      endorsingOrg: parsed.data.endorsingOrg,
      endorserName: parsed.data.endorserName ?? null,
      endorsementStatement: parsed.data.endorsementStatement,
    },
  });

  return { success: true, id: endorsement.id };
}

export async function updateEndorsementAction(
  id: string,
  data: EndorsementInput,
): Promise<ActionResult> {
  const business = await getAuthenticatedBusiness();
  if (!business) return { success: false, error: 'Unauthorized' };

  const parsed = endorsementSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: 'Invalid input.' };

  try {
    await prisma.businessEndorsement.update({
      where: { id, businessId: business.id },
      data: {
        endorsingOrg: parsed.data.endorsingOrg,
        endorserName: parsed.data.endorserName ?? null,
        endorsementStatement: parsed.data.endorsementStatement,
      },
    });
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === 'P2025') return { success: false, error: 'Endorsement not found.' };
    throw e;
  }

  return { success: true };
}

export async function deleteEndorsementAction(id: string): Promise<ActionResult> {
  const business = await getAuthenticatedBusiness();
  if (!business) return { success: false, error: 'Unauthorized' };

  await prisma.businessEndorsement.deleteMany({
    where: { id, businessId: business.id },
  });

  return { success: true };
}

// ---------------------------------------------------------------------------
// Section 7 — Community Offers (CRUD)
// ---------------------------------------------------------------------------

export async function createOfferAction(
  data: OfferInput,
): Promise<ActionResult<{ id: string }>> {
  const business = await getAuthenticatedBusiness();
  if (!business) return { success: false, error: 'Unauthorized' };

  const parsed = offerSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: 'Invalid input.' };

  const offer = await prisma.businessOffer.create({
    data: {
      businessId: business.id,
      title: parsed.data.title,
      description: parsed.data.description,
      link: parsed.data.link || null,
      offerCode: parsed.data.offerCode || null,
      // expiresAt is a date string from <input type="date"> — convert to Date
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
    },
  });

  return { success: true, id: offer.id };
}

export async function updateOfferAction(
  id: string,
  data: OfferInput,
): Promise<ActionResult> {
  const business = await getAuthenticatedBusiness();
  if (!business) return { success: false, error: 'Unauthorized' };

  const parsed = offerSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: 'Invalid input.' };

  try {
    await prisma.businessOffer.update({
      where: { id, businessId: business.id },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        link: parsed.data.link || null,
        offerCode: parsed.data.offerCode || null,
        expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
      },
    });
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === 'P2025') return { success: false, error: 'Offer not found.' };
    throw e;
  }

  return { success: true };
}

export async function deleteOfferAction(id: string): Promise<ActionResult> {
  const business = await getAuthenticatedBusiness();
  if (!business) return { success: false, error: 'Unauthorized' };

  await prisma.businessOffer.deleteMany({
    where: { id, businessId: business.id },
  });

  return { success: true };
}

// ---------------------------------------------------------------------------
// Publish
// ---------------------------------------------------------------------------

export async function publishBusinessAction(): Promise<ActionResult> {
  const business = await getAuthenticatedBusiness();
  if (!business) return { success: false, error: 'Unauthorized' };

  // Guard: About Us and Impact Summary must be complete before a profile can go live.
  // Checking server-side ensures this cannot be bypassed by a client-side patch.
  const hasName = business.companyName !== null && business.companyName.trim().length > 0;
  const hasAbout = business.aboutUs !== null && business.aboutUs.trim().length > 0;
  const hasImpact =
    business.yearsOfInvolvement !== null ||
    business.totalContributions !== null ||
    business.activePartners !== null;

  if (!hasName || !hasAbout) {
    return {
      success: false,
      error: 'Complete your About Us section (company name and description) before publishing.',
    };
  }

  if (!hasImpact) {
    return {
      success: false,
      error: 'Complete your Impact Summary section before publishing.',
    };
  }

  await prisma.business.update({
    where: { id: business.id },
    data: { published: true },
  });

  return { success: true };
}

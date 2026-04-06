/**
 * Edit Profile page — /business/dashboard/edit-profile
 *
 * Server Component. Fetches the full business record (all relations) plus
 * all available causes, serialises everything to plain JSON-safe values,
 * and hands it to the interactive EditProfileClient.
 */

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { getSectionCompletionStatus } from '@/lib/business/progress';
import EditProfileClient from '@/components/business/edit-profile/EditProfileClient';

const EditProfilePage = async () => {
  const session = await auth();
  if (!session?.user?.id) redirect('/business/signin');

  // Fetch the business with every relation needed by the sections
  const business = await prisma.business.findUnique({
    where: { ownerId: session.user.id },
    include: {
      causes: { include: { cause: true } },
      partners: true,
      communityEvents: true,
      endorsements: true,
      offers: true,
    },
  });

  if (!business) redirect('/business/signup');

  // All active causes for the Areas of Impact chip grid
  const allCauses = await prisma.cause.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, color: true },
  });

  // Serialise: convert Prisma Decimal and Date objects to plain strings
  // so they cross the Server → Client Component boundary safely
  const businessData = {
    id: business.id,
    slug: business.slug,
    published: business.published,
    logo: business.logo,
    coverPhoto: business.coverPhoto,
    companyName: business.companyName,
    address: business.address,
    city: business.city,
    zipCode: business.zipCode,
    aboutUs: business.aboutUs,
    tagline: business.tagline,
    website: business.website,
    yearsOfInvolvement: business.yearsOfInvolvement,
    totalContributions: business.totalContributions?.toString() ?? null,
    activePartners: business.activePartners,
    selectedCauseIds: business.causes.map((bc) => bc.causeId),
    partners: business.partners.map((p) => ({
      id: p.id,
      image: p.image,
      name: p.name,
      description: p.description,
    })),
    communityEvents: business.communityEvents.map((e) => ({
      id: e.id,
      photo: e.photo,
      description: e.description,
      externalUrl: e.externalUrl,
    })),
    endorsements: business.endorsements.map((e) => ({
      id: e.id,
      endorsingOrg: e.endorsingOrg,
      endorserName: e.endorserName,
      endorsementStatement: e.endorsementStatement,
    })),
    offers: business.offers.map((o) => ({
      id: o.id,
      title: o.title,
      description: o.description,
      link: o.link,
      offerCode: o.offerCode,
      // Convert Date to a date-input-compatible string (YYYY-MM-DD)
      expiresAt: o.expiresAt ? o.expiresAt.toISOString().split('T')[0] : null,
    })),
  };

  // Compute which sections are already complete for the accordion indicators
  const sectionCompletion = getSectionCompletionStatus({
    companyName: business.companyName,
    aboutUs: business.aboutUs,
    yearsOfInvolvement: business.yearsOfInvolvement,
    totalContributions: business.totalContributions,
    activePartners: business.activePartners,
    causes: business.causes,
    partners: business.partners,
    communityEvents: business.communityEvents,
    endorsements: business.endorsements,
    offers: business.offers,
  });

  return (
    <EditProfileClient
      business={businessData}
      allCauses={allCauses}
      sectionCompletion={sectionCompletion}
    />
  );
};

export default EditProfilePage;

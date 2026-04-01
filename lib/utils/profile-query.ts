/**
 * Shared Prisma select configuration for full profile queries.
 * Used by the dashboard page and the public profile page.
 */
export const profileQuerySelect = {
  username: true,
  profilePicture: true,
  firstName: true,
  lastName: true,
  city: true,
  state: true,
  aboutMe: true,
  whyIGive: true,
  status: true,
  publishedAt: true,
  causes: {
    select: {
      cause: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
          icon: true,
        },
      },
    },
  },
  skills: {
    select: {
      skill: {
        select: { id: true, name: true, slug: true },
      },
    },
  },
  organizations: {
    select: {
      organization: {
        select: {
          id: true,
          pledgeOrgId: true,
          name: true,
          logo: true,
          location: true,
          ein: true,
          website: true,
          mission: true,
        },
      },
    },
  },
} as const;

# CLAUDE.md — MasterGiver Project Context

Read this file at the start of every session to understand the project state, conventions, and known issues.

---

## 1. Project Overview

**MasterGiver** is a public platform where users create profiles showcasing their philanthropic identity: the causes they care about, organizations they support, and skills they contribute to charitable work. Users complete a guided onboarding flow, then receive a shareable public profile URL.

The core value proposition is a verified, public "giving pledge" page — similar to a LinkedIn profile but focused entirely on charitable giving and impact.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.6 (App Router), React 19, TypeScript 5 |
| Database | PostgreSQL (Docker locally), Prisma ORM v5 |
| Auth | NextAuth v5 (beta.30), credentials provider, JWT sessions |
| UI Library | Chakra UI v3 (Panda CSS-based API) + Ark UI (Combobox) |
| Styling | Tailwind CSS v4 (used alongside Chakra for utilities) |
| State | Zustand v5 with devtools middleware |
| Forms | React Hook Form v7 + Zod v4 + @hookform/resolvers |
| Data Fetching | TanStack Query v5 (used only for org search) |
| HTTP Client | Axios v1 |
| Email | Resend v6 + React Email v5 (templated transactional emails) |
| File Storage | Vercel Blob v2 (profile pictures) |
| Other | bcryptjs, country-state-city, next-themes (forced light mode), framer-motion, lucide-react, react-icons |

**Local dev:** `docker-compose.yml` spins up PostgreSQL. Run `npx prisma migrate dev` and `npx prisma db seed` after first setup.

---

## 3. Project Structure

```
mastergiver/
├── app/
│   ├── (auth)/                    — Auth route group (login, signup, reset-password, verify-email)
│   │   └── layout.tsx             — Centered card, 700px wide
│   ├── (dashboard)/               — Protected area
│   │   ├── layout.tsx             — Sidebar + main content HStack
│   │   ├── dashboard/page.tsx     — Main profile view
│   │   └── (settings)/            — Nested settings layout
│   │       ├── settings/page.tsx  — Edit profile (reuses ProfilePreview)
│   │       └── settings/account/  — Account settings (INCOMPLETE)
│   ├── (onboarding)/              — Onboarding flow
│   │   ├── layout.tsx             — Wider card, 974px wide
│   │   └── onboarding/            — page.tsx (step router), create-profile/, what-i-care-about/, preview/, confirmation/
│   ├── api/
│   │   ├── organizations/search/  — Pledge.com proxy route
│   │   └── upload/                — Vercel Blob upload/delete
│   ├── profile/[username]/        — Public profile (PUBLISHED only, 404 for DRAFT)
│   ├── logout/page.tsx
│   └── page.tsx                   — Home (placeholder: <div>Hello</div>)
│
├── components/
│   ├── auth/                      — LoginForm, SignUpForm, ResetPasswordForm, VerificationResult, etc.
│   ├── dashboard/                 — Sidebar, NavItem, ProfileCard, ProfileDisplay, ReadMore
│   ├── layout/
│   │   └── Header.tsx, HeaderButtons.tsx
│   ├── settings/                  — EmailSection, PasswordSection, DeleteAccountSection
│   └── onboarding/
│       ├── CreateProfileForm.tsx
│       ├── ProfilePreview.tsx     — Dual-mode component (onboarding + settings)
│       ├── ProfilePictureUpload.tsx
│       ├── LocationSelector.tsx
│       ├── skeletons/
│       ├── profile-preview/       — 9 section sub-components (NameSection, AboutSection, etc.)
│       └── what-i-care-about/     — CausesSelect, SkillsSelect, OrganizationsSelect, cards, SelectedGrid
│
├── lib/
│   ├── actions/                       — auth.actions.ts, onboarding.actions.ts, account.actions.ts, index.ts
│   ├── auth/                          — auth.ts, auth.actions.ts, auth.config.ts, session.ts, token.ts
│   ├── axios/                         — axios.ts (base instance), pledge.axios.ts (Pledge.com client)
│   ├── data/us-location.ts
│   ├── email/                         — Resend client + verify-email and reset-password templates
│   ├── prisma.ts                      — Prisma client singleton
│   ├── store/onboarding.store.ts      — Zustand store for Step 2 selections
│   ├── theme/                         — Chakra theme.ts + component recipes
│   ├── types/actions.ts               — Shared ActionResult discriminated union type
│   ├── utils/profile-query.ts         — Shared Prisma select config for full profile queries
│   └── validations/auth.schema.ts     — Zod schemas for auth forms
│
├── hooks/
│   ├── useDebounce.ts
│   ├── useOrganizationSearch.ts   — Org combobox search logic (TanStack Query + Chakra collection)
│   └── useProfilePictureUpload.ts — Upload/delete logic for profile picture
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts                    — Seeds 200+ skills only (causes NOT seeded — see Known Bugs)
│   └── migrations/
└── public/brand-assets/, components-assets/
```

---

## 4. Completed Milestones

| Milestone | Description | Status |
|---|---|---|
| 0 | Project setup — Next.js, Prisma, Docker, Tailwind, Chakra | Done |
| 1 | Auth — sign-up, email verification, login, password reset | Done |
| 2 | Onboarding Step 1 — profile picture, location, about me | Done |
| 3 | Onboarding Step 2 — why I give, causes, skills, org search | Done |
| 4 | Onboarding Step 3 — profile preview, inline editing, publish | Done |
| 5 | Public profile page — `/profile/[username]` | Done |
| 6 | Dashboard — profile display, settings/edit profile | Partially done (see below) |

---

## 5. Current Work (Milestone 6 — In Progress)

**Done in Milestone 6:**
- Dashboard with full profile display (`/dashboard`)
- Profile display component with causes, skills, organizations, empty states
- Sidebar navigation with active states
- Edit profile at `/settings` (reuses `ProfilePreview` in settings mode)
- Public profile at `/profile/[username]`

**Still to do:**
- `/settings/account` — change email, change password (currently stubbed out)
- Site-wide responsive design — the entire app is desktop-only right now; all layouts need mobile/tablet breakpoints

---

## 6. Known Bugs

All bugs found during initial audit (2026-03-29). Update status as fixed.

### Critical

| # | File | Issue | Status |
|---|---|---|---|
| 1 | `lib/actions/onboarding.actions.ts:224` | Missing `await` on `updateProfileData()` — causes/skills/orgs/whyIGive writes are fire-and-forget; data may not save before redirect | Open |
| 2 | `app/(onboarding)/onboarding/page.tsx:13` | Typo: `redirect('/dasboard')` (missing `h`) — 404 for users who revisit `/onboarding` post-completion | Open |
| 3 | `lib/auth/auth.actions.ts:161` | Missing leading slash: `'onboarding'` instead of `'/onboarding'` — post-login redirect may go to `/login/onboarding` | Open |
| 4 | `components/auth/VerificationResult.tsx:64` | `redirect()` from `next/navigation` called inside a `'use client'` component — throws at runtime; should use `router.push()` | Open |
| 5 | `components/onboarding/profile-preview/NameSection.tsx:44-55` | Input `value` bound to props (`firstName`/`lastName`) instead of `draft.firstName`/`draft.lastName` — displayed value doesn't reflect typing | Open |
| 6 | `app/logout/page.tsx` | `logout()` and `router.push()` called directly in render body, not inside `useEffect` — fires on every render | Open |

### Non-Critical

| # | File | Issue | Status |
|---|---|---|---|
| 7 | `lib/theme/recipes/input.recipe.ts:6` | `borderWidth: '9px'` — almost certainly a typo for `'1px'`; masked on most inputs by inline CSS override | Fixed |
| 8 | `components/auth/AuthHeading.tsx:15` | `fontFamily=""` — empty string overrides theme font on all auth headings | Fixed |
| 9 | `components/layout/dashboard/ProfileCard.tsx:59` | `profile.city + ', ' + profile.state` renders as `"null, null"` when either field is unset | Fixed |
| 10 | `lib/auth/auth.config.ts:106` | Comment reads "Using database for sessions storage" but `strategy: 'jwt'` is set — misleading only | Open |
| 11 | `components/onboarding/what-i-care-about/OrganizationsSelect.tsx` | Two `console.log` debug statements left in production code | Fixed |
| 12 | `lib/actions/onboarding.actions.ts` | `revalidatePath(\`/${profile.id}\`)` uses DB id not username — targets a non-existent path, does nothing | Fixed |
| 13 | `app/(dashboard)/(settings)/settings/page.tsx` | `existingOrgs` filter drops orgs where `pledgeOrgId === null` — silently loses any manually-added organizations | Open |
| 14 | `lib/auth/auth.actions.ts` | Resend rate limiting uses a module-level `Map` — resets on every serverless cold start, provides no real protection in production | Open |

---

## 7. Architecture Decisions

**JWT sessions (not database sessions)**
Sessions are stored in JWT tokens (30-day expiry). The `Session` and `Account` Prisma models exist for the NextAuth adapter but are not actively used. Session refresh happens on `trigger === 'update'` in the JWT callback.

**Server Actions for all mutations**
All data mutations go through Next.js Server Actions in `lib/actions/onboarding.actions.ts` and `lib/auth/auth.actions.ts`. No separate API layer for mutations — API routes are only used for proxying (Pledge.com) and file uploads (Vercel Blob).

**Zustand for onboarding Step 2 state**
The `useOnboardingStore` holds selected causes, skills, orgs, and whyIGive text during the onboarding flow. It is seeded from the DB when entering the preview/settings page via a `useEffect`. The store uses Zustand `devtools` middleware (named `OnboardingStore`).

**Chakra UI v3 component patterns**
Chakra v3 uses a new Panda CSS-based API. Component recipes live in `lib/theme/recipes/`. The provider is in `components/ui/provider.tsx`. Color mode is forced to light via `forcedTheme="light"` on `ThemeProvider`.

**Profile status flow**
Profiles are created as `DRAFT` during onboarding. Clicking "Launch Profile" on the preview step calls `publishProfile()` which sets `status: PUBLISHED` and `publishedAt`. The public profile route returns 404 for non-`PUBLISHED` profiles.

**Pledge.com integration**
Organization search proxies through `/api/organizations/search` to avoid CORS. The actual Axios client is in `lib/axios/pledge.axios.ts`. `lib/api/pledge.ts` exists but is empty — any future Pledge.com helpers should go there.

**File uploads**
Profile pictures go through `POST /api/upload` which calls Vercel Blob. The route also deletes the previous blob URL before uploading a new one. The blob URL is stored in `Profile.profilePicture`.

---

## 8. Coding Conventions

**File naming**
- Page files: `page.tsx` (Next.js convention)
- Components: PascalCase, e.g. `ProfilePreview.tsx`
- Server actions files: `[domain].actions.ts`
- Hooks: camelCase prefixed with `use`, e.g. `useDebounce.ts`
- Zustand stores: `[domain].store.ts`
- Schemas: `[domain].schema.ts`
- Recipes: `[component].recipe.ts`

**Component organization**
- Break complex pages into sub-components in a folder named after the parent component (e.g., `profile-preview/`, `what-i-care-about/`)
- Skeleton loading components go in a `skeletons/` subfolder
- No barrel `index.ts` files — import directly from component files

**Server Actions pattern**
```ts
export async function myThingAction(data: FormData): Promise<ActionResult> {
  const session = await requireAuth();      // throws redirect if not authed
  // ... validate, mutate, return { success, error }
}
```
All action exports use the `Action` suffix (e.g. `signUpAction`, `saveProfileBasicsAction`). Return type is `ActionResult` from `lib/types/actions.ts` — a discriminated union: `{ success: true } | { success: false; error: string }`. Use `ActionResult<{ extraField: string }>` to attach extra data to the success branch. Never throw from an action — catch and return error objects.

**Auth protection**
Use the helpers in `lib/auth/session.ts`:
- `requireAuth()` — redirects to `/login` if no session
- `requireCompletedOnboarding()` — redirects to `/onboarding` if onboarding incomplete
- `requireIncompleteOnboarding()` — redirects to `/dashboard` if already completed

**Chakra UI usage**
- Use Chakra components (`Box`, `VStack`, `HStack`, `Text`, etc.) as the primary layout and UI system
- Tailwind utility classes are used sparingly for things Chakra doesn't cover cleanly
- Custom variants/styles go in `lib/theme/` recipes, not inline `sx` props
- For className-based Chakra styling, use `className="inputForm"` pattern (defined in `globals.css`)

**Form pattern**
```tsx
const form = useForm<Schema>({ resolver: zodResolver(schema) });
const onSubmit = form.handleSubmit(async (data) => {
  const result = await serverAction(data);
  if (!result.success) { /* show error */ }
});
```

**TypeScript**
- Strict mode is on — no `any` without a comment explaining why
- Prisma-generated types are used directly; don't redefine models as interfaces
- Zod schemas in `lib/validations/` are the single source of truth for form validation types

---

## 9. Responsive Design Standards

The app is currently desktop-only. Responsive design is active work. All new layout code and any layout being touched for other reasons should follow these standards.

### Breakpoints

| Name | Width | Target |
|---|---|---|
| `base` | 0px+ | Mobile phones |
| `md` | 768px+ | Tablets |
| `lg` | 1024px+ | Desktop (current design baseline) |

### Syntax

Always use Chakra's responsive object syntax. Never use Tailwind breakpoint prefixes (`sm:`, `md:`) for layout — Chakra handles it consistently with its own system.

```tsx
// Correct
<Stack direction={{ base: 'column', lg: 'row' }} gap={{ base: '4', lg: '8' }}>

// Wrong — don't mix Tailwind breakpoints for layout
<div className="flex-col lg:flex-row gap-4 lg:gap-8">
```

### Layout Patterns

**Stacking: side-by-side → vertical**
Any `HStack` that places content side by side on desktop should stack vertically on mobile:
```tsx
// Before (desktop-only)
<HStack gap="16">...</HStack>

// After (responsive)
<Stack direction={{ base: 'column', lg: 'row' }} gap={{ base: '6', lg: '16' }}>
```

**Fixed widths → responsive max-widths**
Hardcoded pixel widths become `w="100%"` with a `maxW` cap, so they fill the screen on small viewports and stay capped on large ones:
```tsx
// Auth card: was width="700px"
<Flex w="100%" maxW="700px" ...>

// Onboarding card: was width="974px"
<Flex w="100%" maxW="974px" ...>
```

**Padding and gaps scale down on mobile**
```tsx
// Sections
py={{ base: '6', lg: 'sectionGap' }}
px={{ base: '4', lg: '8' }}

// Card internal padding
p={{ base: '6', lg: 'sectionGap' }}

// Content gaps
gap={{ base: '6', lg: '16' }}
```

**Font sizes** — keep the same unless readability requires adjustment. The existing type scale (`heading`, `subheading`, `body`, `small`) works at all sizes.

### Specific Component Targets

**`app/(auth)/layout.tsx`**
- Card: `width="700px"` → `w="100%" maxW="700px"`
- Card padding: `p="sectionGap"` → `p={{ base: '6', lg: 'sectionGap' }}`
- Outer vertical padding: `py="sectionGap"` → `py={{ base: '6', lg: 'sectionGap' }}`

**`app/(onboarding)/layout.tsx`**
- Card: `width="974px"` → `w="100%" maxW="974px"`
- Same padding treatment as auth layout

**`app/(dashboard)/layout.tsx` + `Sidebar`**
- On `lg`: sidebar visible at `w="25%" maxW="264px"`, main content fills remainder
- On `base`/`md`: sidebar hidden; a hamburger button in the top bar opens a `Drawer` overlay
- The sticky sidebar's `position="sticky"` becomes `position="fixed"` inside the drawer on mobile
- `NavItemList` and badge panel render identically inside the drawer

**`components/layout/Header.tsx`**
- On `lg`: logo left, Login + Sign Up buttons right (current behavior)
- On `base`/`md`: logo left, hamburger icon right — tapping opens a simple dropdown or drawer with the nav links
- `HeaderButtons` (Login/Sign Up) hidden on mobile, shown inside the mobile menu

**`components/layout/dashboard/ProfileDisplay.tsx`**
- `HStack alignItems="start" gap="16"` → `Stack direction={{ base: 'column', lg: 'row' }}`
- `ProfileCard` loses `mt="-100px"` on mobile (no hero overlap) and `position="sticky"` only applies at `lg`
- Profile card becomes full-width on mobile, then its natural max-width on desktop

**`app/(dashboard)/(settings)/layout.tsx`**
- Two-column `HStack` (nav sidebar + content) → stacks vertically on mobile
- Settings nav becomes a horizontal tab-bar on `base`/`md`, vertical sidebar on `lg`
- `minW="320px"` on the nav panel is removed on mobile

### Drawer / Mobile Menu Convention

Use Chakra's `Drawer` component for both the sidebar and the header mobile menu:
```tsx
<Drawer.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)} placement="start">
  <Portal>
    <Drawer.Backdrop />
    <Drawer.Positioner>
      <Drawer.Content maxW="264px">
        {/* same content as desktop sidebar */}
      </Drawer.Content>
    </Drawer.Positioner>
  </Portal>
</Drawer.Root>
```

The trigger button (hamburger) should only render on `base`/`md`:
```tsx
<Box display={{ base: 'block', lg: 'none' }}>
  <IconButton aria-label="Open menu" onClick={() => setIsOpen(true)}>
    <LuMenu />
  </IconButton>
</Box>
```

### Checklist for Any Layout Change

Before marking a layout component as responsive:
- [ ] No hardcoded pixel widths (except `maxW` caps)
- [ ] All `HStack` side-by-side layouts have a `base: 'column'` direction
- [ ] Padding and gap values use responsive objects at `base` and `lg` at minimum
- [ ] Nothing overflows or gets clipped on a 375px viewport
- [ ] Sidebar/nav is accessible on mobile (drawer or tab-bar)

---

## 10. Important Notes

**`prisma` and `@prisma/client` are in `devDependencies`**
This will break production builds (Vercel). Both need to move to `dependencies` before any production deployment.

**Causes are not seeded**
`prisma/seed.ts` seeds 200+ skills but no causes. The `Cause` model has `name`, `slug`, `color`, and `icon` fields. The causes combobox in onboarding Step 2 will be empty on a fresh database. Causes need to be seeded before the onboarding flow is usable end-to-end.

**Public profile URL is `/profile/[username]`, not `/[username]`**
The intended final URL structure is `mastergiver.com/username` (root-level dynamic route). Currently it's at `/profile/[username]`. This will require adding `app/[username]/page.tsx` and is a future change.

**No `middleware.ts`**
There is no Next.js middleware file. Route protection is handled per-page via session helper calls inside Server Components. This is functional but less efficient than edge-level middleware. Adding `middleware.ts` is a future improvement.

**Theme is forced to light mode**
`next-themes` is installed and `ThemeProvider` has `forcedTheme="light"`. Dark mode is not planned. Don't add dark mode styles.

**NextAuth v5 is beta**
`next-auth@5.0.0-beta.30` with Next.js 16 may have edge cases. Keep this version pinned — do not upgrade without testing the full auth flow.

**Org deduplication**
When saving organizations in `saveCausesSkillsOrgs`, the action uses `upsert` on `pledgeOrgId` to avoid duplicate org rows. Manual orgs (no `pledgeOrgId`) would need a different deduplication strategy.

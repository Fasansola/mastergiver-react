# CLAUDE.md — MasterGiver Project Context

Read this file at the start of every session to understand the project state, conventions, and known issues.

---

## 1. Project Overview

**MasterGiver** is a public platform with two distinct panels:

**Phase 1 — Individual User Panel (complete)**
Users create profiles showcasing their philanthropic identity: causes they care about, organizations they support, and skills they contribute. Users complete a guided onboarding flow and receive a shareable public profile URL.

**Phase 2 — Business Panel (current work)**
Businesses pay an annual $59 subscription to create a public profile showcasing their community values, impact, partners, endorsements, and offers. The business panel is a fully separate layer of the application — separate routing (`/business/*`), separate design system, and no shared UI components with the user panel.

---

## 2. Tech Stack

| Layer         | Technology                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| Framework     | Next.js 16.1.6 (App Router), React 19, TypeScript 5                                                     |
| Database      | PostgreSQL (Docker locally), Prisma ORM v5                                                              |
| Auth          | NextAuth v5 (beta.30), credentials provider, JWT sessions                                               |
| UI Library    | Chakra UI v3 (Panda CSS-based API) + Ark UI (Combobox)                                                  |
| Styling       | Tailwind CSS v4 (used alongside Chakra for utilities)                                                   |
| State         | Zustand v5 with devtools middleware                                                                     |
| Forms         | React Hook Form v7 + Zod v4 + @hookform/resolvers                                                       |
| Data Fetching | TanStack Query v5                                                                                       |
| HTTP Client   | Axios v1                                                                                                |
| Email         | Resend v6 + React Email v5 (templated transactional emails)                                             |
| File Storage  | Vercel Blob v2 (profile pictures + business images)                                                     |
| Payments      | Stripe (Checkout + Webhooks + Customer Portal) — Phase 2 only                                           |
| Other         | bcryptjs, country-state-city, next-themes (forced light mode), framer-motion, lucide-react, react-icons |

**Local dev:** `docker-compose.yml` spins up PostgreSQL. Run `npx prisma migrate dev` and `npx prisma db seed` after first setup.

---

## 3. Project Structure

```
mastergiver/
├── app/
│   ├── (auth)/                    — Auth route group (login, signup, reset-password, verify-email)
│   │   └── layout.tsx             — Centered card, 700px wide
│   ├── (dashboard)/               — Protected individual user area
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
│   │   ├── upload/                — Vercel Blob upload/delete
│   │   ├── webhooks/stripe/       — Stripe webhook handler (Phase 2)
│   │   └── business/              — Business API routes (Phase 2)
│   ├── business/                  — Business panel (Phase 2)
│   │   ├── signup/
│   │   ├── signin/
│   │   ├── reset-password/
│   │   │   └── new/
│   │   ├── confirm/               — Payment gate (Stripe Checkout)
│   │   ├── suspended/             — Suspended account notice
│   │   ├── dashboard/
│   │   │   ├── layout.tsx         — Business sidebar + progress tracker
│   │   │   ├── edit-profile/      — 7-section accordion onboarding/edit
│   │   │   ├── account-settings/
│   │   │   └── billing/
│   │   └── [slug]/                — Public business profile page
│   ├── profile/[username]/        — Public individual profile (PUBLISHED only)
│   ├── logout/page.tsx
│   └── page.tsx                   — Home (placeholder)
│
├── components/
│   ├── auth/                      — Individual user auth components
│   ├── dashboard/                 — Individual user dashboard components
│   ├── layout/
│   ├── settings/
│   ├── onboarding/
│   └── business/                  — All business panel components (Phase 2)
│       ├── layout/                — Sidebar, DashboardShell, ProgressBar
│       ├── auth/                  — Business auth forms
│       ├── edit-profile/          — One component per accordion section
│       ├── profile/               — Public profile view components
│       └── shared/                — Reusable business UI primitives
│
├── lib/
│   ├── actions/                   — Individual user server actions
│   ├── auth/
│   ├── axios/
│   ├── business/                  — Business logic (Phase 2)
│   │   ├── stripe.ts              — Stripe helpers
│   │   ├── progress.ts            — Profile completion calculation
│   │   └── slugify.ts             — Slug generation
│   ├── data/us-location.ts
│   ├── email/
│   ├── prisma.ts
│   ├── store/
│   ├── theme/
│   ├── types/actions.ts
│   ├── utils/profile-query.ts
│   └── validations/
│
├── hooks/
├── prisma/
│   ├── schema.prisma              — Contains both Phase 1 and Phase 2 models
│   ├── seed.ts
│   └── migrations/
└── public/
```

---

## 4. Completed Milestones

| Milestone | Description                                                  | Status         |
| --------- | ------------------------------------------------------------ | -------------- |
| 0         | Project setup — Next.js, Prisma, Docker, Tailwind, Chakra    | Done           |
| 1         | Auth — sign-up, email verification, login, password reset    | Done           |
| 2         | Onboarding Step 1 — profile picture, location, about me      | Done           |
| 3         | Onboarding Step 2 — why I give, causes, skills, org search   | Done           |
| 4         | Onboarding Step 3 — profile preview, inline editing, publish | Done           |
| 5         | Public profile page — `/profile/[username]`                  | Done           |
| 6         | Dashboard — profile display, settings/edit profile           | Partially done |
| 7         | Business Panel — Phase 2                                     | In progress    |

---

## 5. Current Work — Phase 2: Business Panel

We are building the business panel step by step. Complete each step and wait for confirmation before proceeding.

**Build order:**

- [ ] Step 1 — Prisma schema + migration ✅ Done
- [ ] Step 2 — Business auth pages (signup, signin, reset password)
- [ ] Step 3 — Stripe Checkout integration + confirm page
- [ ] Step 4 — Dashboard layout + sidebar + progress tracker
- [ ] Step 5 — Edit profile page (7 accordion sections)
- [ ] Step 6 — Account settings page
- [ ] Step 7 — Billing settings page
- [ ] Step 8 — Public business profile page (`/business/[slug]`)

**Detailed specs for each step live in `PHASE2_BRIEF.md`. Read the relevant section before starting each step.**

---

## 6. Business Panel — Design System

The business panel has its own visual identity. Apply these tokens to all `/business/*` pages and components. Do not use these in Phase 1 components.

### Typography

| Token                  | Font         | Weight | Size | Line Height | Color   |
| ---------------------- | ------------ | ------ | ---- | ----------- | ------- |
| Heading (H1)           | Libre Bodoni | 700    | 32px | 120%        | #27262D |
| Small Heading (H2)     | Libre Bodoni | 700    | 24px | 140%        | #27262D |
| Accordion Heading (H3) | Libre Bodoni | 700    | 20px | 150%        | #2F2B77 |
| Body                   | SF Pro       | 400    | 16px | 150%        | #000000 |
| Big Text               | SF Pro       | 400    | 20px | 120%        | #000000 |
| Small Text             | SF Pro       | 400    | 14px | 120%        | #000000 |
| Input Label            | SF Pro       | 700    | 14px | 20px        | #575C62 |
| Placeholder            | SF Pro       | 510    | 14px | 100%        | #575C62 |
| Button Text            | SF Pro       | 700    | 20px | 160%        | #FFFFFF |

Input labels: `letter-spacing: 1.16px`, `text-transform: uppercase`
Placeholders: `letter-spacing: -0.15px`, `text-transform: capitalize`

### Components

**Input Field**

```
background: #F9FAFB
border: 1px solid #F3F4F6
height: 42px
border-radius: 6px
padding: 10px 16px
```

**Primary Button**

```
background: #2F2B77
height: 64px
border-radius: 8px
padding: 16px 40px
gap: 8px
box-shadow: 0px 8px 10px -6px #E2E1FF, 0px 20px 25px -5px #D4D1FF
```

**Sidebar Nav — Active**

```
background: #2F2B77
width: 330px
height: 52px
border-radius: 8px
padding: 10px
gap: 16px
box-shadow: 0px 8px 10px -6px #E2E1FF, 0px 20px 25px -5px #D4D1FF
text: SF Pro 510, 18px, line-height 20px, letter-spacing -0.15px, color #FFFFFF
```

**Sidebar Nav — Inactive**

```
background: transparent
width: 330px
height: 56px
border-radius: 14px
padding: 12px 16px
gap: 16px
text: SF Pro 510, 18px, line-height 20px, letter-spacing -0.15px, color #000000
```

---

## 7. Business Panel — Key Architecture Decisions

**Stripe Checkout (not Elements, not merchant link)**
Annual subscription at $59/year. Flow: create Checkout Session server-side → redirect to Stripe hosted page → webhook confirms payment → account activated. Secret key is server-side only, never in client code.

**Webhook events to handle:**

- `checkout.session.completed` → set `status: ACTIVE`
- `invoice.payment_succeeded` → update `currentPeriodEnd`
- `invoice.payment_failed` → set `status: SUSPENDED`
- `customer.subscription.deleted` → set `status: SUSPENDED`

**Business auth is separate from user auth**
Business users register and sign in via `/business/signin` — not `/login`. They share the same `User` model (one account per email) but the business panel checks for a linked `Business` record and its `status` field.

**Access control via middleware**
All `/business/dashboard/*` routes are protected in `middleware.ts`:

- No session → `/business/signin`
- `status: PENDING` → `/business/confirm`
- `status: SUSPENDED` → `/business/suspended`
- `status: ACTIVE` → allow through

**Progress tracker**
7 accordion sections, each worth ~14.3%. A section is complete when its required fields are populated. Logic lives in `lib/business/progress.ts` as a pure function.

**Phase 1 model touches (minimal)**
Only two Phase 1 models were modified for Phase 2:

- `User` — added `business Business?` relation
- `Cause` — added `businesses BusinessCause[]` relation

No other Phase 1 models were touched.

---

## 8. Known Bugs

### Critical

| #   | File                                                          | Issue                                                                         | Status |
| --- | ------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------ |
| 1   | `lib/actions/onboarding.actions.ts:224`                       | Missing `await` on `updateProfileData()` — data may not save before redirect  | Open   |
| 2   | `app/(onboarding)/onboarding/page.tsx:13`                     | Typo: `redirect('/dasboard')` — 404 post-completion                           | Open   |
| 3   | `lib/auth/auth.actions.ts:161`                                | Missing leading slash: `'onboarding'` instead of `'/onboarding'`              | Open   |
| 4   | `components/auth/VerificationResult.tsx:64`                   | `redirect()` called in `use client` component — should use `router.push()`    | Open   |
| 5   | `components/onboarding/profile-preview/NameSection.tsx:44-55` | Input bound to props not draft state — displayed value doesn't reflect typing | Open   |
| 6   | `app/logout/page.tsx`                                         | `logout()` and `router.push()` called in render body not `useEffect`          | Open   |

### Non-Critical

| #   | File                                                              | Issue                                                                 | Status |
| --- | ----------------------------------------------------------------- | --------------------------------------------------------------------- | ------ |
| 7   | `lib/theme/recipes/input.recipe.ts:6`                             | `borderWidth: '9px'` — typo for `'1px'`                               | Fixed  |
| 8   | `components/auth/AuthHeading.tsx:15`                              | `fontFamily=""` — overrides theme font                                | Fixed  |
| 9   | `components/layout/dashboard/ProfileCard.tsx:59`                  | `"null, null"` when city/state unset                                  | Fixed  |
| 10  | `lib/auth/auth.config.ts:106`                                     | Misleading comment about session strategy                             | Open   |
| 11  | `components/onboarding/what-i-care-about/OrganizationsSelect.tsx` | Debug `console.log` in production                                     | Fixed  |
| 12  | `lib/actions/onboarding.actions.ts`                               | `revalidatePath` uses DB id not username                              | Fixed  |
| 13  | `app/(dashboard)/(settings)/settings/page.tsx`                    | `existingOrgs` filter silently drops manual orgs                      | Open   |
| 14  | `lib/auth/auth.actions.ts`                                        | Rate limiting resets on cold start — no real protection in production | Open   |

---

## 9. Architecture Decisions (Phase 1)

**JWT sessions (not database sessions)**
Sessions stored in JWT tokens (30-day expiry). `Session` and `Account` Prisma models exist for the NextAuth adapter but are not actively used.

**Server Actions for all mutations**
All data mutations go through Next.js Server Actions. No separate API layer for mutations — API routes only used for proxying and file uploads.

**Zustand for onboarding Step 2 state**
`useOnboardingStore` holds selected causes, skills, orgs, and whyIGive text during onboarding. Seeded from DB when entering preview/settings via `useEffect`.

**Chakra UI v3 component patterns**
Chakra v3 uses Panda CSS-based API. Recipes in `lib/theme/recipes/`. Provider in `components/ui/provider.tsx`. Forced light mode.

**Profile status flow**
Profiles created as `DRAFT`. Publishing sets `status: PUBLISHED`. Public profile returns 404 for non-published profiles.

**Pledge.com integration**
Organization search proxies through `/api/organizations/search`. Axios client in `lib/axios/pledge.axios.ts`.

**File uploads**
Profile pictures through `POST /api/upload` → Vercel Blob. Route deletes previous blob before uploading new one.

---

## 10. Coding Conventions

**File naming**

- Pages: `page.tsx`
- Components: PascalCase — `ProfilePreview.tsx`
- Server actions: `[domain].actions.ts`
- Hooks: `use[Name].ts`
- Stores: `[domain].store.ts`
- Schemas: `[domain].schema.ts`
- Recipes: `[component].recipe.ts`

**Component rules**

- Every component in its own file
- Max ~150 lines per component — split if larger
- Comment block at top of every file explaining what it does
- Inline comments on non-obvious logic
- No barrel `index.ts` files — import directly

**Server Actions pattern**

```ts
export async function myThingAction(data: FormData): Promise<ActionResult> {
  const session = await requireAuth();
  // validate, mutate, return { success, error }
}
```

Return type is always `ActionResult` from `lib/types/actions.ts`. Never throw from an action.

**Auth protection**

- `requireAuth()` — redirects to `/login` if no session
- `requireCompletedOnboarding()` — redirects to `/onboarding` if incomplete
- `requireIncompleteOnboarding()` — redirects to `/dashboard` if complete

**Chakra UI usage**

- Chakra components as primary layout and UI system
- Tailwind used sparingly for things Chakra doesn't cover
- Custom variants in `lib/theme/` recipes, not inline `sx` props

**Form pattern**

```tsx
const form = useForm<Schema>({ resolver: zodResolver(schema) });
const onSubmit = form.handleSubmit(async (data) => {
  const result = await serverAction(data);
  if (!result.success) {
    /* show error */
  }
});
```

**TypeScript**

- Strict mode on — no `any` without explanatory comment
- Prisma-generated types used directly
- Zod schemas are single source of truth for validation types

---

## 11. Responsive Design Standards

The app is currently desktop-only. All new code and any layout touched for other reasons must follow these standards.

### Breakpoints

| Name   | Width   | Target  |
| ------ | ------- | ------- |
| `base` | 0px+    | Mobile  |
| `md`   | 768px+  | Tablet  |
| `lg`   | 1024px+ | Desktop |

Always use Chakra's responsive object syntax. Never use Tailwind breakpoint prefixes for layout.

```tsx
// Correct
<Stack direction={{ base: 'column', lg: 'row' }} gap={{ base: '4', lg: '8' }}>
```

---

## 12. Important Notes

**`prisma` and `@prisma/client` are in `devDependencies`**
Must move to `dependencies` before any production deployment.

**Causes are not seeded**
`seed.ts` seeds 200+ skills but no causes. The causes combobox will be empty on a fresh database.

**Public profile URL**
Currently `/profile/[username]`. Intended final URL is `mastergiver.com/username` — future change.

**No `middleware.ts` for Phase 1**
Route protection handled per-page via session helpers. Phase 2 will introduce `middleware.ts` for business dashboard protection.

**Theme is forced to light mode**
`forcedTheme="light"` on `ThemeProvider`. No dark mode planned.

**NextAuth v5 is beta**
Pinned at `beta.30`. Do not upgrade without testing the full auth flow.

**Stripe environment variables needed for Phase 2**

```
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=        ← annual $59 subscription price ID from Stripe dashboard
NEXT_PUBLIC_APP_URL=    ← needed for Stripe success/cancel redirect URLs
```

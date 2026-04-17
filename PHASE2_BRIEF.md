---

## MasterGiver – Phase 2: Business Panel

### Project Context
This is Phase 2 of the MasterGiver platform. Phase 1 (Individual User Panel) is complete. The Business Panel is a **separate layer** of the application — separate routing, separate styling, and no shared UI components with the user panel. Treat it as a self-contained sub-application within the same Next.js 14+ App Router project.

**How we are working together:**
We are building this step by step together. Do not build ahead. After each step, explain what you built, why you made the decisions you did, and what the next step will be. Wait for my confirmation before proceeding. I am a React beginner so:
- Break every component into small, single-purpose files
- Add a comment block at the top of every file explaining what it does
- Add inline comments on any logic that isn't immediately obvious
- Name variables, functions, and files clearly and descriptively
- Keep data fetching logic separate from UI components
- Prioritise reusable components wherever patterns repeat
- No component should exceed ~150 lines — split it up if it does

---

### Tech Stack

Next.js 14+ (App Router), TypeScript, Tailwind CSS, Chakra UI v3, Prisma + PostgreSQL, Auth.js (NextAuth v5 beta), Vercel Blob (image uploads), React Hook Form + Zod (all forms), TanStack Query (all async data fetching), Zustand (cross-component state where needed)

---

### Design System

The business panel has a visually distinct identity from the individual user panel. All business styles are scoped — no shared layout or UI components with the user panel.

#### Typography

**Headings (H1)**

```
font-family: Libre Bodoni
font-weight: 700
font-size: 32px
line-height: 120%
color: #27262D
text-align: center
```

**Small Heading (H2)**

```
font-family: Libre Bodoni
font-weight: 700
font-size: 24px
line-height: 140%
text-align: center
```

**Accordion Heading (H3)**

```
font-family: Libre Bodoni
font-weight: 700
font-size: 20px
line-height: 150%
color: #2F2B77
```

**Body Text**

```
font-family: SF Pro
font-weight: 400
font-size: 16px
line-height: 150%
color: #000000
text-align: center
```

**Small Text**

```
font-family: SF Pro
font-weight: 400
font-size: 14px
line-height: 120%
vertical-align: middle
```

**Big Text**

```
font-family: SF Pro
font-weight: 400
font-size: 20px
line-height: 120%
```

**Input Label**

```
font-family: SF Pro
font-weight: 700
font-size: 14px
line-height: 20px
letter-spacing: 1.16px
text-transform: uppercase
color: #575C62
```

**Placeholder**

```
font-family: SF Pro
font-weight: 510
font-size: 14px
line-height: 100%
letter-spacing: -0.15px
color: #575C62
text-transform: capitalize
```

**Button Text**

```
font-family: SF Pro
font-weight: 700
font-size: 20px
line-height: 160%
vertical-align: middle
```

#### Components

**Input Field**

```
background: #F9FAFB
border: 1px solid #F3F4F6
border-top: 1px solid #F3F4F6
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

**Sidebar Nav Item — Active State**

```
background: #2F2B77
width: 330px
height: 52px
border-radius: 8px
padding: 10px
gap: 16px
box-shadow: 0px 8px 10px -6px #E2E1FF, 0px 20px 25px -5px #D4D1FF
text: SF Pro, 510 weight, 18px, line-height 20px, letter-spacing -0.15px
```

**Sidebar Nav Item — Inactive State**

```
background: transparent
width: 330px
height: 56px
border-radius: 14px
padding: 12px 16px
gap: 16px
text: SF Pro, 510 weight, 18px, line-height 20px, letter-spacing -0.15px, color #000000
```

---

### Routing Structure

```
/business/signup
/business/signin
/business/reset-password
/business/reset-password/new
/business/confirm
/business/dashboard/edit-profile
/business/dashboard/account-settings
/business/dashboard/billing
/business/[slug]
```

---

### Step-by-Step Build Order

Build in this exact sequence. Stop and wait for my confirmation after each step before proceeding.

1. Prisma schema + migration
2. Auth pages — Signup, Signin, Reset Password
3. Stripe Checkout integration + Confirm page
4. Dashboard layout + Sidebar with progress tracker
5. Edit Profile page — all 7 accordion sections
6. Account Settings page
7. Billing Settings page
8. Public Business Profile page (`/business/[slug]`)

---

### Prisma Schema

Add the following models. Do not modify any existing Phase 1 models. If you need to touch a Phase 1 model for any reason, flag it and explain why before making the change.

```prisma
enum BusinessStatus {
  PENDING
  ACTIVE
  SUSPENDED
}

model Business {
  id                   String           @id @default(cuid())
  slug                 String           @unique
  ownerId              String           @unique
  owner                User             @relation(fields: [ownerId], references: [id])
  status               BusinessStatus   @default(PENDING)
  published            Boolean          @default(false)

  // About Us
  logo                 String?
  coverPhoto           String?
  companyName          String?
  address              String?
  city                 String?
  zipCode              String?
  aboutUs              String?
  tagline              String?
  website              String?

  // Impact Summary
  yearsOfInvolvement   Int?
  totalContributions   Decimal?
  activePartners       Int?

  // Areas of Impact — uses the same Cause enum/model as Phase 1
  areasOfImpact        Cause[]

  // Stripe
  stripeCustomerId     String?
  stripeSubscriptionId String?
  subscriptionStatus   String?
  currentPeriodEnd     DateTime?

  // Relations
  partners             BusinessPartner[]
  communityEvents      BusinessCommunityEvent[]
  endorsements         BusinessEndorsement[]
  offers               BusinessOffer[]

  createdAt            DateTime         @default(now())
  updatedAt            DateTime         @updatedAt
}

model BusinessPartner {
  id          String   @id @default(cuid())
  businessId  String
  business    Business @relation(fields: [businessId], references: [id], onDelete: Cascade)
  image       String?
  name        String
  description String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model BusinessCommunityEvent {
  id          String   @id @default(cuid())
  businessId  String
  business    Business @relation(fields: [businessId], references: [id], onDelete: Cascade)
  photo       String?
  description String
  externalUrl String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model BusinessEndorsement {
  id                   String   @id @default(cuid())
  businessId           String
  business             Business @relation(fields: [businessId], references: [id], onDelete: Cascade)
  endorsingOrg         String
  endorserName         String?
  endorsementStatement String
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}

model BusinessOffer {
  id          String    @id @default(cuid())
  businessId  String
  business    Business  @relation(fields: [businessId], references: [id], onDelete: Cascade)
  title       String
  description String
  link        String?
  offerCode   String?
  expiresAt   DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

**Note on `areasOfImpact Cause[]`:** Look at how the `Cause` type is defined in Phase 1 — whether it is a Prisma enum, a separate model, or a string array constant. Mirror that exact pattern here so the data is consistent across both panels. If it requires a join table between `Business` and `Cause`, create that join table.

---

### Auth Pages

All auth pages use the business design system defined above. Structurally mirror the Phase 1 auth page layout but apply business panel styles — do not import or reuse Phase 1 auth components.

#### `/business/signup`

Fields: Business Name, Email, Password, Confirm Password

- Validate with Zod: all fields required, passwords must match, email must be valid
- On submit: create a `User` record + a linked `Business` record with `status: PENDING`
- Auto-generate a unique slug from the business name (e.g. "Green Corp" → `green-corp`). If slug is taken, append a short random suffix
- Redirect to `/business/confirm` on success
- Link to `/business/signin` at the bottom

#### `/business/signin`

Fields: Email, Password

- On success, check business `status`:
  - `PENDING` → redirect to `/business/confirm`
  - `ACTIVE` → redirect to `/business/dashboard/edit-profile`
  - `SUSPENDED` → show inline suspension message, do not redirect
- Link to `/business/reset-password`
- Link to `/business/signup`

#### `/business/reset-password`

Field: Email only

- Send a password reset link via Auth.js email provider
- After submit, always show a confirmation message regardless of whether the email exists (security best practice — never reveal if an email is registered)

#### `/business/reset-password/new`

Fields: New Password, Confirm New Password

- Read and validate the reset token from URL params
- On success: redirect to `/business/signin` and show a success toast
- On invalid/expired token: show a clear error message with a link back to `/business/reset-password`

---

### Stripe Integration

**Approach: Stripe Checkout in subscription mode — $59/year, fixed price.**

Do not use a Stripe merchant link. Do not use Stripe Elements. Use Stripe Checkout hosted page.

#### Payment Flow

1. Business registers → `status: PENDING`
2. User lands on `/business/confirm`
3. Server creates a Stripe Checkout Session with:
   - `mode: "subscription"`
   - `client_reference_id: businessId`
   - `customer_email: user's email`
   - `success_url: /business/confirm?session_id={CHECKOUT_SESSION_ID}`
   - `cancel_url: /business/confirm`
4. User clicks the payment button → redirected to Stripe hosted checkout
5. On return to `success_url`: the confirm page polls `/api/business/activation-status` every 3 seconds, up to 5 attempts, checking if `status === "ACTIVE"`
6. If active: redirect to `/business/dashboard/edit-profile`
7. If polling times out: show "Still confirming your payment…" state with a manual refresh button and a support contact note

#### Webhook Handler — `/api/webhooks/stripe`

Listen for and handle the following events:

| Event                           | Action                                                                   |
| ------------------------------- | ------------------------------------------------------------------------ |
| `checkout.session.completed`    | Set `status: ACTIVE`, save `stripeCustomerId` and `stripeSubscriptionId` |
| `invoice.payment_succeeded`     | Update `currentPeriodEnd`                                                |
| `invoice.payment_failed`        | Set `status: SUSPENDED`                                                  |
| `customer.subscription.deleted` | Set `status: SUSPENDED`                                                  |

Verify the Stripe webhook signature on every incoming request. Reject unverified requests with a 400 response.

---

### Dashboard Layout

All `/business/dashboard/*` routes share a layout file at `/app/business/dashboard/layout.tsx`.

#### Sidebar

- Business logo (small, if uploaded — fall back to initials avatar if not)
- Profile completion progress bar (0–100%) — see progress logic below
- Nav links: Edit Profile, Account Settings, Billing
- Logout button pinned to the bottom
- Apply active/inactive nav item styles as defined in the design system above

#### Progress Calculation

There are 7 accordion sections. Each saved section contributes ~14.3% to the total (100 ÷ 7). A section is considered complete when it has been saved at least once. Derive this from whether the relevant fields on the `Business` record are populated. Keep this logic in `/lib/business/progress.ts` as a pure function so it can be tested and reused easily.

---

### Edit Profile Page — `/business/dashboard/edit-profile`

An accordion list of 7 sections. Global rules for all sections:

- Each section opens on click, closes automatically on save
- Saving a section triggers a progress tracker update
- All forms: React Hook Form + Zod
- All mutations: TanStack Query `useMutation`
- Image uploads: proxied API route to Vercel Blob — never call Vercel Blob directly from the client

---

**Section 1 – About Us**
Fields: Logo (image upload), Cover Photo (image upload), Company Name, Company Address, City, Zip Code, About Us (Textarea), Tagline, Website URL
→ Save Section button

---

**Section 2 – Impact Summary**
Fields: Years of Community Involvement (number), Community Contributions (currency amount), Active Community Partners & Programs (number)
→ Save Section button

---

**Section 3 – Our Community Partners & Programs** _(multi-entry)_
Fields per entry: Image (upload), Organization or Program Name, Description

Behaviour:

- Saved entries render as cards above the form showing the image, name, and description with Edit and Delete action buttons
- **Add Another** — saves the current entry as a card, resets the form for the next entry
- **Save Section** — saves the current entry as a card and closes the accordion

---

**Section 4 – Areas of Impact**
Multi-select UI using the same cause categories and data from Phase 1. Import the causes data/constants only — do not import any Phase 1 UI components. Render as a selectable tag/chip grid.
→ Save Section button

---

**Section 5 – In the Community** _(multi-entry)_
Fields per entry: Photo (upload), Photo Description, External Reference URL (optional)

- Same card-display and Add More / Save Section pattern as Section 3

---

**Section 6 – Community Endorsements** _(multi-entry)_
Fields per entry: Endorsing Organization or Program, Endorser Name (optional), Endorsement Statement

- Same card-display and Add More Endorsements / Save Section pattern as Section 3

---

**Section 7 – Community Offers** _(multi-entry)_
Fields per entry: Offer Title, Offer Description, Link to Offer (optional), Offer Code (optional), Offer Expiration (date picker)

- Same card-display and Add More Offers / Save Section pattern as Section 3

---

**Bottom of page:**

- **Preview Profile** button → opens `/business/[slug]` in a new tab (works before and after publishing)
- **Publish Profile** button → sets `published: true` on the business record, shows an inline success confirmation

---

### Account Settings — `/business/dashboard/account-settings`

Two separate card sections on the same page:

**Account Information**
Fields: Business Name, Email
→ Save button. Show success/error toast.

**Change Password**
Fields: Current Password, New Password, Confirm New Password
→ Save button. Show success/error toast.

---

### Billing Settings — `/business/dashboard/billing`

Three card sections:

**Current Plan**

- Plan: Business
- Status: Active or Suspended (styled differently for each state)
- Next renewal date from `currentPeriodEnd`
- Amount: $59 / year

**Manage Billing**

- Button: "Update Payment Method / View Invoices"
- On click: server generates a Stripe Customer Portal session using `stripeCustomerId` and redirects the user to the portal URL
- Stripe handles everything from there (card updates, invoice history, cancellation)

**Payment History**

- Table columns: Date, Amount, Status
- Fetch from Stripe API using `stripeCustomerId`
- Show a loading state and an empty state if no payments found

---

### Public Business Profile — `/business/[slug]`

- If `published: false` or business not found → show a clean "This profile is not available" message, no dashboard chrome
- Read-only, no edit controls
- Sections with no saved data are hidden gracefully — do not render empty sections
- Render in order: Cover Photo, Logo + Company Name + Tagline, About Us, Impact Summary stats, Areas of Impact tags, Community Partners cards, In the Community gallery, Endorsements, Community Offers
- Apply business panel design system — clean public layout, no sidebar

---

### Auth & Access Control (Middleware)

Protect all `/business/dashboard/*` routes in Next.js middleware:

| Condition                     | Action                            |
| ----------------------------- | --------------------------------- |
| No session                    | Redirect to `/business/signin`    |
| Session + `status: PENDING`   | Redirect to `/business/confirm`   |
| Session + `status: SUSPENDED` | Redirect to `/business/suspended` |
| Session + `status: ACTIVE`    | Allow through                     |

Do not rely on client-side checks alone. All access control must be enforced at the middleware level.

---

### File & Folder Structure

```
/app/business/
  signup/
  signin/
  reset-password/
    new/
  confirm/
  dashboard/
    layout.tsx
    edit-profile/
    account-settings/
    billing/
  [slug]/
  suspended/

/components/business/
  layout/
    Sidebar.tsx
    DashboardShell.tsx
    ProgressBar.tsx
  auth/
    SignupForm.tsx
    SigninForm.tsx
    ResetPasswordForm.tsx
    NewPasswordForm.tsx
  edit-profile/
    AboutUsSection.tsx
    ImpactSummarySection.tsx
    PartnersSection.tsx
    AreasOfImpactSection.tsx
    CommunitySection.tsx
    EndorsementsSection.tsx
    OffersSection.tsx
    MultiEntryCard.tsx
    ImageUploadInput.tsx
  profile/
    CoverHero.tsx
    ImpactStats.tsx
    PartnerCards.tsx
    EndorsementList.tsx
    OfferCards.tsx
  shared/
    SectionAccordion.tsx
    FormField.tsx
    SaveButton.tsx

/lib/business/
  stripe.ts
  progress.ts
  slugify.ts

/app/api/
  webhooks/
    stripe/
      route.ts
  business/
    activation-status/
      route.ts
    profile/
      route.ts
    partners/
      route.ts
    events/
      route.ts
    endorsements/
      route.ts
    offers/
      route.ts
    billing-portal/
      route.ts
```

---

### General Rules for Claude Code

- Do not modify any existing Phase 1 files unless absolutely necessary. If you must touch a Phase 1 file, flag it and explain why before making the change
- Every component in its own file
- No component exceeds ~150 lines — break it up if it does
- Comment block at the top of every file explaining what it does
- Inline comments on any logic that isn't immediately obvious
- All forms: React Hook Form + Zod — no uncontrolled inputs
- All async data: TanStack Query — no raw fetch or axios in components
- Image uploads: always through a proxied API route to Vercel Blob — never expose keys client-side
- Stripe secret key: server-side only, never in client code

---

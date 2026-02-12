# MasterGiver - Project Context

## Product Vision

Public platform for showcasing giving pledges. Users display causes, organizations, and skills they donate.

## Key Features (v1)

- Email/password authentication
- Public profile pages (mastergiver.com/username)
- Onboarding flow (6 steps)
- What I Care About (predefined + custom causes)
- Giving Skills (predefined + custom)
- Organizations (Pledge.com API + manual)
- Admin panel (manage causes/skills)

## Key Constraints

- All profiles are PUBLIC by default
- Usernames are LOCKED after first set
- No donation/payment features in v1
- Design is COMPLETE in Figma (implementation only)
- Text fields: 255 character limit
- Profile pictures: 2MB max, GIF/JPG/PNG only

## Database Setup

- PostgreSQL via Docker (local dev)
- Admin user: admin@mastergiver.com / Admin@123
- Seeded with 8 predefined causes
- Seeded with 15 predefined skills

## Current Environment

- Local development on macOS
- Docker Compose for PostgreSQL
- VS Code as editor
- Node.js 18+
- Deploying to Vercel (when ready)

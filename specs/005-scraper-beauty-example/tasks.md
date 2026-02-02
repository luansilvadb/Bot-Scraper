# Tasks: Amazon Scraper Beauty Example

**Feature**: `005-scraper-beauty-example`
**Status**: Planned

## Phase 1: Setup
*Initialize seeding capabilities.*

**Goal**: Enable `prisma db seed` command.

- [x] T001 Update `backend/package.json` with prisma seed configuration pointing to `ts-node prisma/seed.ts`.
- [x] T002 Update `backend/tsconfig.json` to allow `ts-node` executions if needed (optional check).

## Phase 2: User Story 1 - Configure and Scrape Beauty Products
*Create reusable seed data for the Beauty Bot.*

**Goal**: Automatically configure the bot for the User via script.
**Independent Test**: Running `npx prisma db seed` creates/updates the "Beauty Bot".

- [x] T003 [US1] Create `backend/prisma/seed.ts` script that upserts a "Beauty Bot" targeted at `https://www.amazon.com.br/s?k=beleza`.
- [X] T004 [US1] Run `npx prisma db seed` to verify creation (Manual Verification).

## Dependencies

- **US1** depends on Phase 1 setup.

## Parallel Execution Examples

- **Phase 1** must happen before **Phase 2**.

## Implementation Strategy

1.  **Setup**: Configure package.json.
2.  **Seed Script**: Write the TypeScript/Prisma script.
3.  **Run**: Execute and verify.

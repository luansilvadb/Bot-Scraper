# Research: Amazon Scraper Beauty Example

**Feature**: `005-scraper-beauty-example`
**Status**: Complete

## 1. Beauty Product Strategy

### Goal
Configure the scraper to target Amazon's beauty category to demonstrate functionality.

### URL Selection
Amazon Brazil Beauty Category: `https://www.amazon.com.br/b?node=16209062011` (Beleza)
Alternative (Search): `https://www.amazon.com.br/s?k=maquiagem`

**Decision**: Use a specific search query like `https://www.amazon.com.br/s?k=beleza` or `https://www.amazon.com.br/s?k=maquiagem` because search results pages (`.s-result-item`) are exactly what our scraper is optimized for. Category pages *sometimes* have different layouts (editorial content), while search results are consistent.

### Configuration Method

**Option A: Database Seed**
- **Pros**: Reproducible, good for setting up dev env.
- **Cons**: We don't have a seed script currently.

**Option B: Manual API Creation**
- **Pros**: Easy.
- **Cons**: Tedious to repeat.

**Option C: Create Seed Script**
- **Pros**: Best practice. We can add a `prisma/seed.ts` file.
- **Decision**: Create a `prisma/seed.ts` script that ensures a "Beauty Bot" exists.

## 2. Implementation Details

1.  **Create `backend/prisma/seed.ts`**:
    *   Check if bot "Beauty Bot" exists.
    *   If not, create it with:
        *   Name: `Beauty Bot`
        *   URL: `https://www.amazon.com.br/s?k=beleza`
        *   Cron: `0 * * * *` (Hourly)
        *   Tag: `demo-tag`

2.  **Update `package.json`**:
    *   Add `prisma seed` configuration.

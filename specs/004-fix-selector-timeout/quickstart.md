# Quickstart: Fix Amazon Scraper Selector Timeout

**Feature**: `004-fix-selector-timeout`

## Verification

### 1. Test existing tests
Run unit tests to ensure no regression and verify the new failure case.

```bash
cd backend
npm test -- src/modules/scraping/scrapers/amazon.scraper.spec.ts
```

### 2. Live Scrape Test (Manual)
1. Start Backend: `npm run start:dev`
2. Trigger scrape for `https://amazon.com.br` (Homepage).
3. Observe logs.
   - **Success**: Log `Product grid not found. Returning empty list.` followed by job completion.
   - **Failure**: Log `timeout 10000ms exceeded` with stack trace.

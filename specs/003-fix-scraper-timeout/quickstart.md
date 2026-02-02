# Quickstart: Fix Amazon Scraper Timeout Error

**Feature**: `003-fix-scraper-timeout`

## Verification

### 1. Test existing tests
The unit tests should be updated to assert the new call signature.

```bash
cd backend
npm test -- src/modules/scraping/scrapers/amazon.scraper.spec.ts
```

### 2. Live Scrape Test (Manual)
1. Start Backend: `npm run start:dev`
2. Trigger check/scrape for an Amazon Bot.
3. Observe logs.
   - **Success**: Log series: `Navigating...` -> `Wait for product grid...` -> `Extracting...` -> `Found X products`.
   - **Failure**: Log `timeout 60000ms exceeded`.

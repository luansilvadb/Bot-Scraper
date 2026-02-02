# Quickstart: Fix Amazon Scraper Invalid URL Error

**Feature**: `002-fix-amazon-scraper`

## How to Test

### 1. Unit Tests (Recommended)
Run the backend unit tests to verify the `AmazonScraper` logic matches the spec.

```bash
cd backend
npm test -- src/modules/scraping/scrapers/amazon.scraper.spec.ts
```

*Note: You may need to create the spec file if it doesn't exist yet.*

### 2. Manual Verification
Trigger a bot with a protocol-less URL.

1. Start the backend: `npm run start:dev`
2. Start the frontend: `npm run dev`
3. Create a new Bot or use an existing one.
4. Trigger a "Check" or "Scrape" operation (depending on UI availability) with the URL `amazon.com.br`.
5. Check backend logs:
   - Expectations:
     - Log: `Navigating to https://amazon.com.br...` (Modified URL)
     - No `Protocol error` in logs.

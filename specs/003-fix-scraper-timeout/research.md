# Research: Fix Amazon Scraper Timeout Error

**Feature**: `003-fix-scraper-timeout`
**Status**: Complete

## 1. Navigation Strategy Analysis

### Problem
`page.goto(url, { waitUntil: 'networkidle' })` times out (60000ms) on Amazon.
**Cause**: Amazon and other modern e-commerce sites have perpetual background network stats (ads, metrics, syncing) that prevent the network from ever being "idle" (no connections for 500ms).

### Solution Choices

#### Option A: `waitUntil: 'networkidle'` (Current)
- **Pros**: Ensures page is "fully" loaded.
- **Cons**: Extremely brittle on complex sites. High timeout rate.

#### Option B: `waitUntil: 'load'`
- **Pros**: Waits for `load` event (all resources like images).
- **Cons**: Still slow if large images or ads are loading. unnecessary for data scraping if text is ready.

#### Option C: `waitUntil: 'domcontentloaded'` (Chosen)
- **Pros**: Fast. Fires as soon as HTML parsing is done.
- **Cons**: Dynamic content (AJAX) might not be there yet.
- **Mitigation**: We already use `page.waitForSelector('.s-result-item')` immediately after navigation. This explicit wait handles the AJAX loading part perfectly.

### Decision
Switch to `domcontentloaded`. This is the industry standard practice for scraping modern SPAs/Hybrid apps with Playwright to avoid `networkidle` flakes.

## 2. Implementation Details

- **Change**: In `amazon.scraper.ts`:
  ```typescript
  // Old
  await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 60000 });
  
  // New
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  ```
- **Test Updates**:
  - The existing unit tests mock `page.goto`. We need to update the `expected` call arguments in the tests to match the new `waitUntil` option.

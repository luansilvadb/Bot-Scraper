# Research: Fix Amazon Scraper Selector Timeout

**Feature**: `004-fix-selector-timeout`
**Status**: Complete

## 1. Selector Strategy

### Problem
`page.waitForSelector('.s-result-item')` throws if the element isn't found within 10s. This happens on the homepage or non-product pages, crashing the entire job processor.

### Solution Choices

#### Option A: Check for multiple selectors
- **Pros**: Could handle homepage if we knew what to look for there.
- **Cons**: We only want products right now. Complexity increases.

#### Option B: `try/catch` the wait
- **Pros**: Simple. If not found, we assume "No products found".
- **Cons**: Might mask genuine network errors if not logged carefully.
- **Decision**: Use `try/catch`. This is the standard "soft fail" pattern in scraping.

### 2. Implementation Logic

```typescript
try {
  await page.waitForSelector('.s-result-item', { timeout: 10000 });
} catch (e) {
  this.logger.warn('Product grid not found. Returning empty list.');
  return [];
}
// Proceed to extraction if found
```

## 2. Testing Strategy

- **Mock**: Need to mock `waitForSelector` to throw an error.
- **Assertion**: Verify `scrape` returns `[]` and does not throw.

# Implementation Plan: Fix Amazon Scraper Selector Timeout

**Branch**: `004-fix-selector-timeout` | **Date**: 2026-02-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-fix-selector-timeout/spec.md`

## Summary

Enhance `AmazonScraper` to gracefully handle cases where the product selector `.s-result-item` is missing (e.g., on Homepage). Replace the hard failure (timeout exception) with a `try/catch` block that logs a warning and returns an empty array.

## Technical Context

**Language/Version**: TypeScript (Node.js LTS)
**Primary Dependencies**: NestJS, Playwright
**Storage**: N/A
**Testing**: Jest (Unit tests)
**Target Platform**: Node.js Backend
**Project Type**: Backend Module Update
**Performance Goals**: Fail-fast or return empty on non-product pages, no unhandled 500 errors.
**Constraints**: Must return `[]` type-safe response on failure.(ScrapedProductData[])
**Scale/Scope**: Single file update (`AmazonScraper`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Modular Architecture**: Change isolated to `AmazonScraper`.
- [x] **II. Test Standards**: Unit tests will cover the "not found" scenario.
- [x] **III. UX and Consistency**: Provides feedback via logs instead of crashing the job.
- [x] **IV. Scalability and Async**: Non-blocking failure handling.

## Project Structure

### Documentation (this feature)

```text
specs/004-fix-selector-timeout/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (N/A)
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output (N/A)
```

### Source Code (repository root)

```text
backend/
├── src/
│   └── modules/
│       └── scraping/
│           └── scrapers/
│               ├── amazon.scraper.ts       # TARGET: Add try/catch around waitForSelector
│               └── amazon.scraper.spec.ts  # TARGET: Add failure case test
```

**Structure Decision**: Modifying existing `AmazonScraper`.

## Complexity Tracking

*No violations found.*

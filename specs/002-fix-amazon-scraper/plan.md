# Implementation Plan: Fix Amazon Scraper Invalid URL Error

**Branch**: `002-fix-amazon-scraper` | **Date**: 2026-02-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-fix-amazon-scraper/spec.md`

## Summary

Enhance `AmazonScraper` to validate and sanitize target URLs before navigation. Specifically, automatically prepend `https://` if the protocol is missing to prevent `Protocol error (Page.navigate)` crashes in Playwright.

## Technical Context

**Language/Version**: TypeScript (Node.js LTS)
**Primary Dependencies**: NestJS, Playwright
**Storage**: N/A (Logic fix only)
**Testing**: Jest (Unit tests for scraper URL logic)
**Target Platform**: Node.js Backend
**Project Type**: Backend Module Update
**Performance Goals**: Zero crashes on missing protocol URLs.
**Constraints**: Must handle "amazon.com.br" and similar variants without failing.
**Scale/Scope**: Single class update (`AmazonScraper`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Modular Architecture**: Change is isolated to `AmazonScraper` in `scraping` module.
- [x] **II. Test Standards**: Plan includes updating/adding unit tests for `AmazonScraper` to verify URL sanitization.
- [x] **III. UX and Consistency**: Logs added for debugging transparency as per principles.
- [x] **IV. Scalability and Async**: Logic is synchronous and lightweight, does not block event loop.

## Project Structure

### Documentation (this feature)

```text
specs/002-fix-amazon-scraper/
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
│               ├── amazon.scraper.ts       # TARGET: Add URL validation here
│               └── amazon.scraper.spec.ts  # TARGET: Add unit tests here
```

**Structure Decision**: Modifying existing `AmazonScraper` class in `backend/src/modules/scraping/scrapers/`. verified against existing structure.

## Complexity Tracking

*No violations found.*

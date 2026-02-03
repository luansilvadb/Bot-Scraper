# Implementation Plan - Separate Backend from Scraper

This plan outlines the steps to decouple scraping logic from the backend and delegate it to the newly refactored NestJS Worker.

## User Review Required

> [!IMPORTANT]
> The implementation will move the core scraping logic (Playwright interactions) entirely to the worker. The backend will become a "Task Dispatcher" and "Data Processor".

## Proposed Changes

### 1. Backend: Scraping Module
- **`ScrapingProcessor`**: Modify to stop using `PlaywrightService` and `AmazonScraper`. Instead, it will create a `ScrapingTask` entry in the database for the Bot's `targetUrl`.
- **`ScrapingService`**: (Optional) Update to clarify that it now schedules tasks rather than direct execution.

### 2. Backend: Workers Module
- **`WS_EVENTS` & Dtos**: Update `TaskCompletedDto` to support multiple results (for listing pages).
- **`WorkersGateway`**: Update `handleTaskCompleted` to process multiple products if returned by the worker. It will use the `ProfitFilter` and `prisma.scrapedProduct.upsert` logic previously in `ScrapingProcessor`.

### 3. Worker: Scraper Module
- **`AmazonListScraper`**: Port the logic from `backend/src/modules/scraping/scrapers/amazon.scraper.ts` to the worker.
- **`ScraperService`**: Update to detect if a URL is a listing page or a single product page, and use the appropriate scraper.

### 4. Database Schema
- **`ScrapingTask`**: Add `botId` (String?) as an optional field to track which bot originated the task.
- **`ScrapedProduct`**: No changes needed.

## Infrastructure
- **BullMQ**: Will still be used to trigger the "Bot" processing, but the processor will just create a "Task" for the worker.
- **Socket.IO**: Used for the backend <-> worker communication.

## Verification Plan

### Automated Tests
- **Unit Tests**: Update backend `WorkersGateway` tests to handle multiple results.
- **Unit Tests**: Add tests for the new worker `AmazonListScraper`.

### Manual Verification
1. Click "Scrape Now" in the UI.
2. Observe logs in the **Worker terminal** (not backend).
3. Verify that products appear in the "Products" page in the UI.
4. Verify that "Backend" console shows ZERO playwright logs.

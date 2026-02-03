# Bot-Scraper Local Worker (NestJS)

A standalone NestJS application that scrapes Amazon product pages using Playwright, designed to run on home networks to utilize residential IPs.

## Prerequisites

- Node.js (v18 or later)
- TypeScript (v5+)
- Valid `WORKER_TOKEN` (generated from the main Bot-Scraper dashboard)

## Installation

1.  Navigate to the `worker/` directory:
    ```bash
    cd worker
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Install Playwright browsers (required for scraping):
    ```bash
    npx playwright install chromium
    ```

## Configuration

1.  Create a `.env` file in the `worker/` directory:
    ```env
    BACKEND_URL="http://localhost:3000"
    WORKER_TOKEN="your_token_here"
    HEADLESS=true
    ```

## Usage

### Development Mode
```bash
npm run start:dev
```

### Production Mode
1.  Build the worker:
    ```bash
    npm run build
    ```
2.  Start the compiled worker:
    ```bash
    npm run start:prod
    ```

## Architecture

Refactored to NestJS for improved maintainability and architectural consistency with the backend, while remaining a standalone deployment.

- **CommunicationModule**: Manages Socket.IO connection and authentication.
- **ScraperModule**: Encapsulates Playwright logic and browser management.
- **OrchestrationModule**: Coordinates tasks, heartbeats, and network monitoring.

## Functionality

- **Connection**: Connects to the main Backend via Socket.IO.
- **Heartbeat**: Sends a heartbeat with status (IDLE/BUSY/BLOCKED) and network info.
- **Scraping**: Executes Amazon product scraping with basic detection avoidance.

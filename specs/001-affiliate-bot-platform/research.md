# Research & Decisions

**Branch**: `001-affiliate-bot-platform` | **Date**: 2026-02-01

## 1. Technology Stack Selection

### 1.1 Backend Framework
- **Decision**: **NestJS** (Node.js/TypeScript)
- **Rationale**: The User explicitly requested a robust backend for handling cron jobs and long-running processes. NestJS provides a structured, modular architecture perfect for scaling bot logic and integrates natively with BullMQ (queues).
- **Alternatives Considered**: 
  - Next.js API Routes: Rejected because Next.js creates "serverless-like" handlers that are prone to timeouts on long scraping jobs.
  - Express.js (Raw): Rejected to enforce better architectural discipline (Modules/Services) as per the project Constitution.

### 1.2 Frontend Framework
- **Decision**: **Vite + React** (SPA)
- **Rationale**: A Single Page Application (SPA) is ideal for a real-time admin dashboard. Vite offers superior local dev performance compared to Webpack.
- **Alternatives Considered**:
  - Next.js (App Router): Rejected for the frontend to decouple the UI completely from the heavy backend logic.

### 1.3 Scraping Engine
- **Decision**: **Playwright**
- **Rationale**: Supports modern sites (Amazon) better than Cheerio/Axios. Crucially, it has official ARM64 support for the target Oracle Cloud environment.
- **Alternatives Considered**:
  - Puppeteer: Older API, slight performance overhead compared to Playwright.
  - Selenium: Too heavy and requires more complex driver management.

### 1.4 Job Queue
- **Decision**: **BullMQ (Redis)**
- **Rationale**: Scraping is inherently asynchronous and failure-prone. BullMQ allows robust retries, delayed jobs, and separating the "Producer" (Scheduler) from the "Consumer" (Scraper).
- **Alternatives Considered**:
  - In-memory queue: Rejected because job state must be preserved if the container restarts.

## 2. Deployment Strategy

### 2.1 Target Platform
- **Decision**: **Oracle Cloud (Ampere/ARM64) via Easypanel**
- **Rationale**: User's existing infrastructure.
- **Implementation**: We will provide a `docker-compose.yml` that defines the stack. Easypanel will use this to build the images directly on the ARM64 server, avoiding cross-compilation headaches.

### 2.2 Local Development
- **Decision**: **Native execution** (No Docker)
- **Rationale**: User's Windows environment does not have Docker. We will ensure `package.json` scripts (`start:dev`) run the services directly on the host machine.

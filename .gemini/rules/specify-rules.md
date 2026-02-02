# Bot-Scraper Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-01

## Active Technologies
- PostgreSQL 16 (Relational), Redis 7 (Queues/Cache) (001-affiliate-bot-platform)
- Node.js 20+ (LTS), TypeScript 5+ (Strict Mode) (001-affiliate-bot-platform)
- PostgreSQL (Data), Redis (Queues/Cache) (001-affiliate-bot-platform)
- TypeScript (Node.js LTS) + NestJS, Playwright (002-fix-amazon-scraper)
- N/A (Logic fix only) (002-fix-amazon-scraper)
- TypeScript (Node.js LTS) + Prisma Client (005-scraper-beauty-example)
- PostgreSQL (via Prisma) (005-scraper-beauty-example)
- TypeScript 5.7+ (strict mode) (006-fullstack-crud)
- PostgreSQL (via Prisma ORM) (006-fullstack-crud)
- TypeScript 5.x (strict mode) / Node.js LTS + NestJS 11, Prisma ORM, @nestjs/websockets, @nestjs/platform-socket.io, Playwright (007-local-worker-scraper)
- PostgreSQL (existing via Prisma) (007-local-worker-scraper)

- TypeScript 5.x (Node.js 20 LTS "Iron" or 22 "Hydrogen") (001-affiliate-bot-platform)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

npm test; npm run lint

## Code Style

TypeScript 5.x (Node.js 20 LTS "Iron" or 22 "Hydrogen"): Follow standard conventions

## Recent Changes
- 007-local-worker-scraper: Added TypeScript 5.x (strict mode) / Node.js LTS + NestJS 11, Prisma ORM, @nestjs/websockets, @nestjs/platform-socket.io, Playwright
- 007-local-worker-scraper: Added TypeScript 5.x (strict mode) / Node.js LTS + NestJS 11, Prisma ORM, @nestjs/websockets, @nestjs/platform-socket.io, Playwright


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->

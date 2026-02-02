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
- TypeScript 5.x (modo estrito) + Electron 28+, React 18, Socket.io-client, Playwright (010-electron-worker-tray)
- electron-store (arquivo local criptografado) para configurações (010-electron-worker-tray)
- TypeScript 5.3+ (strict mode) + Electron 40+, Vite 7+, React 18, Fluent UI 9, electron-store 8 (011-simplified-worker-config)
- electron-store (encrypted local JSON) (011-simplified-worker-config)
- PostgreSQL (worker tokens stored in Worker entity) (012-worker-token-ux)
- TypeScript 5.x, Node.js LTS + Electron 28+, React 18, Fluent UI v9, Vite (013-tray-config-ux)
- electron-store (encrypted local config) (013-tray-config-ux)
- TypeScript 5.x, React 18.x (Worker App) + `@fluentui/react-components` (UI), `electron` (Runtime) (014-fix-token-input)
- Electron Store (via IPC) for config persistence (014-fix-token-input)

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
- 014-fix-token-input: Added TypeScript 5.x, React 18.x (Worker App) + `@fluentui/react-components` (UI), `electron` (Runtime)
- 014-fix-token-input: Added TypeScript 5.x, React 18.x (Worker App) + `@fluentui/react-components` (UI), `electron` (Runtime)
- 013-tray-config-ux: Added TypeScript 5.x, Node.js LTS + Electron 28+, React 18, Fluent UI v9, Vite


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->

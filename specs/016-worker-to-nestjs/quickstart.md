# Quickstart: Worker Development

## Prerequisites
- Node.js 18+
- Use `npm` (no Docker required for local dev)

## Setup
1. Navigate to `worker/`.
2. Install dependencies: `npm install`.
3. Copy `.env.example` to `.env`:
   ```bash
   BACKEND_URL=http://localhost:3000
   WORKER_TOKEN=development-token
   HEADLESS=false # Set to false to see the browser
   ```

## Running
- **Development**: `npm run dev` (Starts NestJS with watch mode)
- **Production**: `npm run build && npm run start`

## Testing
- Unit: `npm run test`
- E2E: `npm run test:e2e` (Requires local backend running or mocked)

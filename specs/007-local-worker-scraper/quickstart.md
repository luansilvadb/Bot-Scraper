# Quickstart: Local Worker Scraper

**Feature**: 007-local-worker-scraper  
**Date**: 2026-02-01

## Prerequisites

- **Node.js LTS** (v20.x or later) installed on both server and worker machines
- **PostgreSQL** running locally (or accessible)
- **Redis** running locally (for BullMQ queues)
- **Main application** (backend + frontend) already set up

---

## Phase 1: Backend Setup

### 1.1 Install New Dependencies

```bash
cd backend
npm install @nestjs/websockets @nestjs/platform-socket.io
```

### 1.2 Apply Database Migration

After adding the new models to `prisma/schema.prisma`:

```bash
cd backend
npx prisma migrate dev --name add-local-worker-scraper
npx prisma generate
```

### 1.3 Generate Worker Token

Create a worker token for authentication:

```bash
# Add to backend/.env
WORKER_AUTH_TOKEN=your-secure-random-token-here-min-32-chars

# Generate a secure token (PowerShell):
[guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N")
```

### 1.4 Configure WebSocket Gateway

Add to `backend/.env`:

```env
# WebSocket Configuration
WS_HEARTBEAT_INTERVAL=10000    # 10 seconds
WS_HEARTBEAT_TIMEOUT=30000     # 30 seconds
WORKER_AUTH_TOKEN=your-token-here
```

### 1.5 Start Backend

```bash
cd backend
npm run start:dev
```

The WebSocket gateway will be available at `ws://localhost:3000/workers`

---

## Phase 2: Worker Application Setup

### 2.1 Initialize Worker Project

```bash
# From repository root
mkdir worker
cd worker
npm init -y
npm install socket.io-client playwright axios typescript ts-node @types/node
npx playwright install chromium
```

### 2.2 Configure Worker

Create `worker/.env`:

```env
# Server Connection
SERVER_URL=ws://your-server-ip:3000
WORKER_TOKEN=same-token-as-backend

# Worker Identity
WORKER_NAME=home-worker-1

# Scraping Configuration
HEADLESS=true
RATE_LIMIT_MIN_MS=10000
RATE_LIMIT_MAX_MS=15000

# Logging
LOG_LEVEL=info
```

### 2.3 Run Worker

```bash
cd worker
npx ts-node src/main.ts
```

Expected output:
```
[INFO] Connecting to ws://your-server-ip:3000/workers...
[INFO] Connected! Worker ID: abc123-def456
[INFO] Registered as "home-worker-1"
[INFO] ISP detected: Vivo | IP: 187.xxx.xxx.xxx
[INFO] Waiting for tasks...
```

---

## Phase 3: Create Your First Task

### Via API

```bash
# Create a single task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "productUrl": "https://www.amazon.com.br/dp/B09V3KXJPB"
  }'

# Response
{
  "id": "task-uuid",
  "status": "PENDING",
  "productUrl": "https://www.amazon.com.br/dp/B09V3KXJPB",
  "createdAt": "2026-02-01T23:45:00Z"
}
```

### Via Frontend (when available)

1. Navigate to `/workers` dashboard
2. View connected workers
3. Click "New Task" and paste Amazon product URL
4. Monitor progress in real-time

---

## Verification Checklist

### Backend
- [ ] WebSocket gateway running on `/workers` namespace
- [ ] Database migrations applied (LocalWorker, ScrapingTask, ScrapingResult tables)
- [ ] Worker auth token configured in `.env`

### Worker
- [ ] Can connect to server WebSocket
- [ ] Receives `worker:registered` event
- [ ] Heartbeat sending every 10 seconds
- [ ] ISP/IP detection working

### End-to-End
- [ ] Create task via API
- [ ] Task assigned to connected worker
- [ ] Worker scrapes Amazon page
- [ ] Result saved to database
- [ ] Task status shows COMPLETED

---

## Troubleshooting

### Worker can't connect

1. Check server URL and port
2. Verify auth token matches between server and worker
3. Check firewall allows WebSocket connection
4. Ensure backend is running

### Connection drops frequently

1. Check network stability
2. Increase `WS_HEARTBEAT_TIMEOUT` if needed
3. Check for proxy/firewall interference

### Scraping blocked

1. Verify using residential IP (not VPN/proxy)
2. Check rate limiting is enabled (10-15s delay)
3. Try increasing delay between requests
4. Switch to different ISP if consistently blocked

### ISP detection fails

1. Check internet connectivity
2. Verify `ipinfo.io` is accessible
3. Check for corporate firewall blocking the request

---

## Development Tips

### Run Worker with Visible Browser

For debugging, disable headless mode:

```env
# worker/.env
HEADLESS=false
```

### Increase Logging

```env
# worker/.env
LOG_LEVEL=debug
```

### Test WebSocket Connection

Use `wscat` to test the gateway:

```bash
npm install -g wscat
wscat -c "ws://localhost:3000/workers?token=your-token"
```

---

## Next Steps

1. Run `/speckit.tasks` to generate implementation tasks
2. Implement workers module in backend
3. Create worker application
4. Add frontend dashboard
5. Test end-to-end flow

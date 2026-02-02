# Quickstart: Worker-Only Infrastructure

This guide describes how to verify the new simplified infrastructure.

## Prerequisites
- Cloud PostgreSQL instance.
- Cloud Redis instance.
- Docker & Docker Compose.

## 1. Environment Setup
Update your `.env` file with the cloud connection strings:
```env
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public"
REDIS_URL="redis://default:pass@host:6379"
```

## 2. Infrastructure Deployment
Run the simplified Docker Compose:
```bash
docker compose up -d
```
Verify only 2 containers are running:
```bash
docker ps
# Should show: backend, frontend
```

## 3. Database Migration
Apply the changes to your cloud database:
```bash
npx prisma migrate deploy
```

## 4. Verification
1. Open the dashboard at `http://localhost:8080`.
2. Confirm the "Proxies" menu is gone.
3. Register a Local Worker.
4. Create a scraping bot and trigger it.
5. Verify the task is assigned to the Local Worker.

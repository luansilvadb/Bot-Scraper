# Quickstart Guide

**Branch**: `001-affiliate-bot-platform`

## Prerequisites (Local Dev - Windows)
- **Node.js**: v20+ (LTS)
- **PostgreSQL**: Installed and running on port 5432.
- **Redis**: Installed and running on port 6379.
- **Git**: Installed.

> **Note**: As per project constitution, Docker is NOT required for local development.

## 1. Installation

The project uses a Monorepo structure with separate `backend` and `frontend` directories.

```powershell
# 1. Clone the repository
git clone <repo-url>
cd Bot-Scraper

# 2. Install Backend Dependencies
cd backend
npm install

# 3. Install Frontend Dependencies
cd ../frontend
npm install
```

## 2. Configuration (`.env`)

Create a `.env` file in the `backend/` directory:

```ini
# backend/.env

# Database (Adjust password/user if needed)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/affiliate_bot?schema=public"

# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379

# Security
# Set the admin password for the dashboard
ADMIN_PASSWORD="admin" 
JWT_SECRET="dev-secret-key-change-me"

# App
PORT=3000
```

Create a `.env` file in the `frontend/` directory (if needed, usually Vite uses .env.local):

```ini
# frontend/.env
VITE_API_URL="http://localhost:3000"
```

## 3. Database Migration

Initialize the database schema using Prisma (from `backend/`):

```powershell
cd backend
npx prisma migrate dev --name init
```

## 4. Running Locally

You will need two terminal windows.

**Terminal 1 (Backend):**
```powershell
cd backend
npm run start:dev
# Server starts at http://localhost:3000
```

**Terminal 2 (Frontend):**
```powershell
cd frontend
npm run dev
# Dashboard starts at http://localhost:5173
```

## 5. Deployment (Oracle Cloud / Easypanel)

1.  Ensure your Easypanel server is set up.
2.  Connect your GitHub repository to Easypanel.
3.  Use the `docker-compose.yml` (Stack) configuration provided in the root to define the services.
4.  Easypanel will auto-build the Dockerfiles.

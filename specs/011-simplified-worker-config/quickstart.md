# Quickstart: Simplified Worker Configuration

**Feature**: 011-simplified-worker-config  
**Date**: 2026-02-02

## Overview

This feature simplifies the worker configuration by removing the server URL field from the user interface. The URL is now configured via environment variables at build time.

## Prerequisites

- Node.js 20+ (LTS)
- npm 10+
- Windows 10/11

## Environment Setup

### 1. Create Environment Files

```bash
cd worker-app

# Development environment
echo "VITE_SERVER_URL=http://localhost:30001" > .env.development

# Production environment (update URL for your server)
echo "VITE_SERVER_URL=https://api.example.com" > .env.production
```

### 2. Verify Environment Variables

The environment variable `VITE_SERVER_URL` is used to configure the backend server URL:

| Environment | File | Default URL |
|-------------|------|-------------|
| Development | `.env.development` | `http://localhost:30001` |
| Production | `.env.production` | Must be configured |

## Running the Application

### Development Mode

```bash
cd worker-app
npm run dev
```

- Uses `.env.development`
- Hot-reload enabled
- DevTools available

### Production Build

```bash
cd worker-app
npm run build:win
```

- Uses `.env.production`
- Creates installer in `release/` folder

## User Flow

### First-Time Setup

1. User launches the application
2. Configuration screen shows with only **Token** field
3. User enters their token from the web dashboard
4. Clicks "Conectar"
5. Worker connects and minimizes to tray

### Reconfiguring

1. Right-click tray icon → "Configurações"
2. Update token if needed
3. Click "Salvar"

## File Changes Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `.env.development` | NEW | Development server URL |
| `.env.production` | NEW | Production server URL |
| `.env.example` | NEW | Template documentation |
| `electron/types.ts` | MODIFY | Update config comments |
| `electron/services/config-store.ts` | MODIFY | Read URL from env |
| `electron/ipc-handlers.ts` | MODIFY | Inject URL on save |
| `src/components/ConfigWindow.tsx` | MODIFY | Remove URL field |

## Validation Checklist

- [ ] `.env.development` exists and contains `VITE_SERVER_URL`
- [ ] `.env.production` exists and contains `VITE_SERVER_URL`
- [ ] `npm run dev` uses development URL
- [ ] `npm run build` uses production URL
- [ ] Configuration form shows only Token field
- [ ] Saving configuration works with just Token
- [ ] Worker connects successfully

## Troubleshooting

### "Cannot connect to server"

1. Check that the backend is running at the configured URL
2. Verify `.env.development` has the correct URL
3. Restart the dev server after changing `.env` files

### "Environment variable not found"

1. Ensure the `.env` file exists in `worker-app/` root
2. Variable must be prefixed with `VITE_`
3. Restart the build/dev process after changes

### "Token is required" error

1. Ensure you've entered a valid token
2. Token must be non-empty
3. Copy the token directly from the web dashboard

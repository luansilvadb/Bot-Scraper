# Implementation Plan - Worker-Only Infrastructure & Proxy Removal

## Technical Context

The project is moving towards a distributed architecture where scraping is handled exclusively by **Local Workers** (residential IPs) rather than paid/managed proxies. This requires removing the legacy `ProxyModule` and associated infrastructure (local database/cache containers) to favor cloud-managed services.

**Current State:**
- `db` and `redis` containers running locally via Docker Compose.
- `ProxyModule` exists in the backend for managing proxy pools.
- Scraping tasks can potentially use proxies (legacy logic).
- Frontend has a "Proxies" management section.

**Target State:**
- Docker Compose only manages `backend` and `frontend`.
- `DATABASE_URL` and `REDIS_URL` point to external cloud services (PostgreSQL/Redis).
- `ProxyModule` completely removed (code deleted).
- All scraping tasks strictly routed to `LocalWorkers`.

## Constitution Check

### I. Arquitetura Modular e Tipagem
- **Compliance**: Removing an entire module (`ProxyModule`) improves modularity by reducing bloat. We will ensure that removing it doesn't leave broken references in other modules.

### IV. Escalabilidade e Assincronia
- **Compliance**: Moving to cloud-managed Redis/DB facilitates horizontal scaling of the backend and frontend replicas.

### Environment Constraints
- **Compliance**: The `.env` and `docker-compose.yml` must support external services while remaining compatible with the "Docker-only for deployment" rule.

## Phase 0: Research & Unknowns

The goal is to map all dependencies of the `ProxyModule` to ensure a clean removal without side effects.

### Unknowns:
- [ ] List all files in `backend/src/modules/proxy/`.
- [ ] Identify all imports of `ProxyModule` or `ProxyService` in other modules (e.g., `ScrapingModule`, `AppModule`).
- [ ] Locate all frontend routes and menu items related to Proxies.
- [ ] Verify the current state of "fallback" logic in the task dispatcher.

### Research Tasks:
1. **Dependency Analysis**: Search for all occurrences of "Proxy" in the codebase to identify integration points.
2. **Scraping Engine Review**: Check `backend/src/modules/tasks/tasks.service.ts` and `backend/src/modules/scraping/` for logic that chooses between "Local Worker" vs "Proxy".

## Phase 1: Design & Contracts

### Data Model Changes
- **Migration**: A new Prisma migration to drop the `Proxy` table (and any related tables like `ProxyMetric`).
- **Prisma Schema**: Update `schema.prisma` to remove the `Proxy` model.

### Infrastructure Changes
- **Docker**: Update `docker-compose.yml` to remove `db` and `redis` services and their volumes.
- **Environment**: Update `.env.example` to use `REDIS_URL` instead of `REDIS_HOST/PORT`.

### API & Contracts
- **Deletions**:
    - `DELETE /api/proxies/*`
    - `POST /api/proxies/check`
- **Updates**:
    - `POST /api/tasks`: Ensure the schema no longer accepts or requires proxy-related config.

## Phase 2: Implementation Steps

1. **Clean Infrastructure**:
    - Modify `docker-compose.yml`.
    - Update `backend` config to use `REDIS_URL`.
2. **Prisma Migration**:
    - Update `schema.prisma`.
    - Run `npx prisma migrate dev --name remove_proxy_table`.
3. **Backend Deletion**:
    - Delete `backend/src/modules/proxy/` directory.
    - Remove imports from `AppModule`.
    - Cleanup `TasksService` or `ScrapingService` references to proxies.
4. **Frontend Deletion**:
    - Remove "Proxies" from Sidebar.
    - Delete proxy-related pages/features in `frontend/src/features/`.
5. **Config Update**:
    - Remove proxy-specific environment variables.

## Phase 3: Validation

- [ ] `docker compose up` works with only 2 containers.
- [ ] Application connects successfully to external DB/Redis.
- [ ] Proxy menu is gone from the UI.
- [ ] Scraping tasks are successfully dispatched to Local Workers.
- [ ] No "Proxy" related errors in backend logs.

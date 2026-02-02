# Feature Specification: Worker-Only Infrastructure & Proxy Removal

**Feature Branch**: `009-worker-only-infra`  
**Created**: 2026-02-02  
**Status**: Draft  
**Input**: User description: "Remover proxy, usar apenas local worker, e limpar docker-compose para backend/frontend apenas (PostgreSQL/Redis na nuvem)"

## Clarifications

### Session 2026-02-02
- Q: Como devemos tratar as tabelas e os dados de proxies existentes no banco de dados durante a migração? → A: Remover via Migração (Criar uma migração do Prisma para excluir as tabelas relacionadas a proxies do banco de dados).
- Q: Devemos preparar estrutura para a API oficial nesta tarefa? → A: Foco Estrito (Apenas remover proxies e ajustar infra. Ignorar API oficial por enquanto).
- Q: Formato de conexão do Redis? → A: URL Única (Mudar para usar apenas `REDIS_URL` no backend, facilitando a integração com serviços de nuvem).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Simplified Deployment (Priority: P1)

As a System Administrator, I want to deploy the application using Docker Compose without managing database or cache containers locally, so that I can utilize cloud-managed services for better reliability and lower local resource usage.

**Why this priority**: Focuses on the core infrastructure requirement of moving DB/Redis to the cloud and simplifying the Docker setup.

**Independent Test**: Running `docker compose up` should only start the backend and frontend services. The system should successfully connect to external PostgreSQL and Redis instances.

**Acceptance Scenarios**:
1. **Given** a Docker environment, **When** I run `docker compose up`, **Then** only the `backend` and `frontend` containers are started.
2. **Given** valid cloud database and Redis connection details in `.env`, **When** the backend starts, **Then** it connects to the cloud services without errors.

---

### User Story 2 - Proxy Removal (Priority: P2)

As a User, I want the system to handle all scraping tasks exclusively through local workers, removing all legacy proxy configuration and UI elements, to simplify the user interface and avoid costs associated with paid proxies.

**Why this priority**: Simplifies the application by removing unused/unwanted features and focusing on the most effective architecture (Local Workers).

**Independent Test**: Log in to the dashboard and verify that no "Proxy" menu or configuration remains. Verify that newly created tasks are automatically assigned to available workers.

**Acceptance Scenarios**:
1. **Given** the Sidebar navigation, **When** I look at the menu, **Then** the "Proxies" item is no longer visible.
2. **Given** a scraping task, **When** it is created, **Then** it is exclusively assigned to a Local Worker instead of attempting to use a proxy pool.

---

### Edge Cases

- **Missing Cloud Credentials**: What happens if `.env` does not contain valid cloud Redis/DB URLs? (System should fail gracefully with clear logs).
- **Network Latency**: How does the system handle increased latency since DB/Redis are now in the cloud? (Should be monitored, but for the current load, it's expected to be acceptable).
- **Local Worker Availability**: What happens if no local worker is online? (Tasks should remain in `PENDING` status as they no longer have a fallback proxy option).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST remove the `ProxyModule` and all associated controllers, services, and DTOs from the backend.
- **FR-002**: The Frontend MUST remove the Proxy management page and Sidebar navigation item.
- **FR-003**: The `docker-compose.yml` MUST be updated to remove `db` and `redis` services.
- **FR-004**: The `docker-compose.yml` MUST expose environment variables for `DATABASE_URL` and `REDIS_URL` pointing to external services.
- **FR-005**: The Scraping Engine MUST be updated to exclusively use Local Workers for all tasks, removing any logic that relies on a proxy pool or managed proxies.
- **FR-006**: The application MUST support standard environment variables for external database and redis connection strings.

### Key Entities *(include if feature involves data)*

- **LocalWorker**: Continues to be the primary entity for task execution.
- **ScrapingTask**: No longer contains proxy-related metadata or routing flags.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Docker footprint reduced from 4 containers to 2.
- **SC-002**: Database and Redis connection time to cloud services is under 100ms on a standard network.
- **SC-003**: 100% of scraping tasks are processed by Local Workers.
- **SC-004**: All "Proxy" related code (approx. 10+ files) is removed from the codebase.

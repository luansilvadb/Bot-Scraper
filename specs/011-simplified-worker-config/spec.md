# Feature Specification: Simplified Worker Configuration

**Feature Branch**: `011-simplified-worker-config`  
**Created**: 2026-02-02  
**Status**: Draft  
**Input**: User description: "Simplify worker configuration by removing server URL field and using environment variable, keeping only the token field for user input"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - First-Time Worker Setup (Priority: P1)

A user downloads the Bot-Scraper Worker application for the first time. Upon launching the app, they see a simple, clean configuration screen with only one field: "Token de Acesso". The user copies their unique token from the web dashboard, pastes it into the field, and clicks "Conectar". The worker immediately connects to the server and begins operating in the background.

**Why this priority**: This is the core user flow. Reducing friction from 2 fields to 1 field improves onboarding success rate and reduces user confusion. The server URL is consistent across all users so there's no reason for them to enter it manually.

**Independent Test**: Can be fully tested by launching a fresh installation, entering only a token, and verifying the worker connects successfully.

**Acceptance Scenarios**:

1. **Given** a fresh installation of the worker app, **When** the user opens the app for the first time, **Then** they see a configuration screen with only a Token input field (no URL field visible)
2. **Given** the configuration screen is displayed, **When** the user enters a valid token and clicks "Conectar", **Then** the worker connects to the pre-configured server URL and shows the status window
3. **Given** the configuration screen is displayed, **When** the user enters an invalid or empty token, **Then** an appropriate error message is displayed without exposing internal details

---

### User Story 2 - Environment-Based URL Configuration (Priority: P1)

A developer or DevOps engineer needs to configure different server URLs for development, staging, and production environments. They set the `VITE_SERVER_URL` environment variable in the appropriate `.env` file before building the application. The built application uses the configured URL without requiring any code changes.

**Why this priority**: This enables proper CI/CD workflows and environment separation. It's a foundational capability that supports the main user story.

**Independent Test**: Can be tested by building the application with different `.env` files and verifying each build connects to the correct server.

**Acceptance Scenarios**:

1. **Given** a `.env.development` file with `VITE_SERVER_URL=http://localhost:30001`, **When** running `npm run dev`, **Then** the worker uses `http://localhost:30001` as the server URL
2. **Given** a `.env.production` file with `VITE_SERVER_URL=https://api.example.com`, **When** running `npm run build`, **Then** the built application uses `https://api.example.com` as the server URL
3. **Given** no `VITE_SERVER_URL` is defined, **When** the application starts, **Then** a sensible default URL is used (e.g., `http://localhost:30001` for development)

---

### User Story 3 - Reconfiguring Token (Priority: P2)

An existing user needs to change their worker token (e.g., they regenerated it in the dashboard, or they're moving the worker to a different account). They access the Settings from the tray menu, see the simplified form with just the Token field, update it, and save.

**Why this priority**: While less common than first-time setup, this is an important maintenance scenario. Users shouldn't need to re-enter the server URL when only the token changes.

**Independent Test**: Can be tested by opening Settings on a previously configured worker, changing the token, and verifying the new token is used.

**Acceptance Scenarios**:

1. **Given** a configured worker running in the tray, **When** the user opens Settings, **Then** they see the Token field pre-filled with their current token (masked)
2. **Given** the Settings screen is open, **When** the user updates the token and clicks "Salvar", **Then** the worker reconnects with the new token
3. **Given** the Settings screen is open, **When** the user clicks "Cancelar", **Then** no changes are made and the worker continues with the previous configuration

---

### Edge Cases

- What happens when the environment variable is not set at build time?
  - The application should use a fallback default URL (localhost for dev, or show a build error for production if required)
- How does the system handle network connectivity issues during first connection?
  - Show a clear error message with retry option, without exposing the server URL
- What happens if the token format is clearly invalid (empty, too short)?
  - Client-side validation prevents submission and shows helpful guidance
- How does the system handle server URL changes after deployment?
  - Users must update to a new version of the application (this is expected behavior)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Configuration form MUST display only the Token field; server URL field MUST be removed from the user-facing interface
- **FR-002**: Application MUST read server URL from the `VITE_SERVER_URL` environment variable at build time
- **FR-003**: If `VITE_SERVER_URL` is not defined, application MUST use `http://localhost:30001` as default
- **FR-004**: Application MUST provide `.env.development` and `.env.production` template files with documented URL configuration
- **FR-005**: Token field MUST validate that input is not empty before allowing submission
- **FR-006**: Error messages MUST be user-friendly and MUST NOT expose the configured server URL or internal error details
- **FR-007**: Worker Name field MUST remain optional for users who want to identify multiple workers
- **FR-008**: Auto-Start and Minimize to Tray options MUST remain available in the configuration form

### Key Entities

- **WorkerConfig**: Configuration data structure
  - `serverUrl`: String - Now read from environment variable, not user input
  - `workerToken`: String - User-provided authentication token
  - `workerName`: String (optional) - User-friendly identifier for the worker
  - `autoStart`: Boolean - Whether to start with Windows
  - `minimizeToTray`: Boolean - Whether to minimize to tray on close

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete worker setup in under 30 seconds (reduced from 60+ seconds with URL entry)
- **SC-002**: 100% of first-time users should not need to look up or type a server URL
- **SC-003**: Configuration form shows exactly 1 required field (Token) instead of 2 (URL + Token)
- **SC-004**: Build process correctly injects different URLs for development vs production environments without code changes
- **SC-005**: Zero support tickets related to "what URL should I enter?" or similar URL-related confusion

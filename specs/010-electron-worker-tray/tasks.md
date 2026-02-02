# Tasks: Electron Worker Tray App

Refactor the existing Node.js worker into a professional Electron desktop application with a tray icon.

## Phase 1: Setup & Infrastructure ✅

- [x] T001 Initialize Electron project structure in `worker-app/`
- [x] T002 Configure `package.json` with Electron, React, and worker dependencies
- [x] T003 Configure `tsconfig.json` for strict TypeScript
- [x] T004 Setup `electron-vite.config.ts` for bundling
- [x] T005 Setup `.gitignore` for the Electron project
- [x] T006 Create basic `index.html` for the React application
- [x] T007 Create React entry point `src/main.tsx` with Fluent UI provider

---

## Phase 2: Foundational Worker Migration ✅

- [x] T008 Implement base Electron Main process in `worker-app/electron/main.ts`
- [x] T009 Implement Context Bridge preload script in `worker-app/electron/preload.ts`
- [x] T010 Define IPC types and communication contract in `worker-app/electron/types.ts`
- [x] T011 Create base App component in `worker-app/src/App.tsx`
- [x] T012 Create global type definitions in `worker-app/src/global.d.ts`
- [x] T014 Setup base CSS and design tokens in `worker-app/src/index.css`
- [x] T015 Migrate WebSocket client logic
- [x] T016 Migrate scraper service logic
- [x] T017 Create WorkerStatus state management

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Start & Minimize to Tray ✅

- [x] T018 Create tray icon assets (idle, working, error, connecting)
- [x] T019 Implement System Tray class with icon management
- [x] T020 Implement context menu for tray (Abrir, Pausar, Sair)
- [x] T021 Implement single instance lock
- [x] T022 Configure window to minimize to tray on close
- [x] T023 Implement IPC handlers for connect/disconnect
- [x] T024 Wire tray icon to WebSocket connection state

---

## Phase 4: User Story 2 - Mini Janela de Status ✅

- [x] T025 Create frameless BrowserWindow for status popup
- [x] T026 Position window in bottom-right corner of screen
- [x] T027 Implement show/hide on tray click
- [x] T028 Implement close on blur (click outside)
- [x] T029 Create StatusWindow React component with status display
- [x] T030 Create useWorkerStatus hook for IPC communication
- [x] T031 Style StatusWindow with glassmorphism/notification style
- [x] T032 Display connection status and task counters
- [x] T033 Display "Trabalhando..." with animation when processing

---

## Phase 5: User Story 3 - Configuração Inicial ✅

- [x] T034 Create encrypted config storage using electron-store
- [x] T035 Derive encryption key from machine hardware ID
- [x] T036 Implement IPC handlers for get/save config
- [x] T037 Create ConfigForm React component
- [x] T038 Create ConfigWindow (separate window or modal)
- [x] T039 Implement form validation (URL format, token length)
- [x] T040 Display error messages for invalid config
- [x] T041 Show config window on first launch (no saved config)
- [x] T042 Auto-connect after successful config save

---

## Phase 6: User Story 4 - Indicador Visual de Status na Bandeja ✅

- [x] T043 Define TrayState enum and derivation logic
- [x] T044 Implement dynamic icon switching based on WorkerStatus
- [x] T045 Update tooltip text based on current state
- [x] T046 Implement icon animation (pulsing) for WORKING state
- [x] T047 Subscribe to worker state changes and update tray

---

## Phase 7: User Story 5 - Iniciar com o Windows ✅

- [x] T048 Add autoStart preference to WorkerConfig
- [x] T049 Implement setLoginItemSettings toggle
- [x] T050 Add autoStart toggle to ConfigForm
- [x] T051 Wire toggle to IPC handler
- [x] T052 Apply autoStart setting on app launch

---

## Phase 8: Polish & Cross-Cutting Concerns ✅

- [x] T053 Create build configuration for Windows in `worker-app/electron-builder.yml`
- [x] T054 Add app icons for Windows installer in `worker-app/build/icon.png`
- [x] T055 Implement auto-reconnect with exponential backoff
- [x] T056 Add graceful shutdown on quit
- [x] T057 Create README.md for worker-app
- [x] T058 Add npm scripts (dev, build, build:win)
- [x] T059 Test production build configuration
- [x] T060 Run quickstart.md validation checklist

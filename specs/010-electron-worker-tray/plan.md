# Implementation Plan: Electron Worker Tray Application

**Branch**: `010-electron-worker-tray` | **Date**: 2026-02-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-electron-worker-tray/spec.md`

## Summary

Transformar o Worker atual (Node.js CLI) em uma aplicação desktop Electron com interface minimalista. O aplicativo rodará na bandeja do sistema (system tray) do Windows, exibindo uma mini janela de status estilo notificação. Reutiliza a lógica de WebSocket e Scraping existente no projeto `worker/`, encapsulando-a em um ambiente Electron com interface React.

## Technical Context

**Language/Version**: TypeScript 5.x (modo estrito)  
**Primary Dependencies**: Electron 28+, React 18, Socket.io-client, Playwright  
**Storage**: electron-store (arquivo local criptografado) para configurações  
**Testing**: Playwright Test (E2E), Jest (unitários)  
**Target Platform**: Windows 10/11 (x64)  
**Project Type**: Desktop Application (Electron + React)  
**Performance Goals**: <100MB RAM ocioso, <2s para reflexão de status  
**Constraints**: Instalador <150MB, Single Instance, Auto-start opcional  
**Scale/Scope**: 1 usuário por instalação, 1 conexão WebSocket ativa

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Status | Notas |
|-----------|--------|-------|
| I. Arquitetura Modular e Tipagem | ✅ PASS | Electron Main/Renderer segue separação de responsabilidades; TypeScript estrito será usado |
| II. Padrões de Teste | ✅ PASS | Testes unitários com Jest + E2E com Playwright Test para UI |
| III. Experiência do Usuário | ✅ PASS | Interface minimalista focada em feedback visual claro |
| IV. Escalabilidade e Assincronia | ✅ PASS | WebSocket é não-bloqueante; scraping delegado ao Playwright |

**Restrições Especiais Aplicadas:**
- "Sem Docker local" → Desenvolvimento e build serão nativos no Windows
- "Stealth First" → Reutilizar configuração de Playwright patched do worker existente

## Project Structure

### Documentation (this feature)

```text
specs/010-electron-worker-tray/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (IPC contracts)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
worker-app/                    # Nova pasta para o aplicativo Electron
├── package.json               # Dependências Electron + React
├── electron/                  # Electron Main Process
│   ├── main.ts               # Entry point, Tray, Window management
│   ├── tray.ts               # System Tray logic
│   ├── ipc-handlers.ts       # IPC communication handlers
│   └── preload.ts            # Preload script (context bridge)
├── src/                       # Renderer Process (React)
│   ├── App.tsx               # Main React component
│   ├── components/
│   │   ├── StatusWindow.tsx  # Mini window de status
│   │   ├── ConfigForm.tsx    # Formulário de configuração
│   │   └── StatusIcon.tsx    # Indicador visual
│   ├── hooks/
│   │   └── useWorkerStatus.ts # Hook para estado do worker
│   └── services/
│       ├── websocket.ts      # Lógica de conexão (migrada do worker/)
│       ├── scraper.ts        # Lógica de scraping (migrada do worker/)
│       └── config.ts         # Gerenciamento de configuração
├── assets/
│   └── icons/                # Ícones de tray (.ico, .png)
└── tests/
    ├── unit/
    └── e2e/
```

**Structure Decision**: Novo projeto Electron separado do `worker/` existente para:
1. Evitar conflitos de dependências (Electron vs Node.js puro)
2. Permitir builds independentes
3. Manter o worker CLI funcional para desenvolvimento/debug

## Dependencies

### Core
- `electron`: Framework desktop
- `electron-builder`: Build e packaging para Windows
- `electron-store`: Persistência de configuração criptografada
- `@electron/remote`: Comunicação simplificada (se necessário)

### UI (Renderer)
- `react` + `react-dom`: Interface
- `@fluentui/react-components`: Design system (consistência com frontend existente)
- Reutilizar estilos CSS do frontend quando aplicável

### Worker Logic (migrado de worker/)
- `socket.io-client`: WebSocket
- `playwright`: Scraping (already patched)

### Build & Dev
- `electron-vite`: Bundler otimizado para Electron
- `typescript`: Tipagem
- `concurrently`: Dev server paralelo

## Phases Overview

### Phase 0: Research
- Melhor abordagem para Electron + React integration
- electron-store vs keytar para criptografia de credenciais
- Single instance lock pattern
- Windows auto-start registry vs startup folder

### Phase 1: Design & Contracts
- IPC contract entre Main e Renderer
- Estado do Worker (state machine)
- Ícones de tray para cada estado

### Phase 2: Implementation (via /speckit.tasks)
- Tasks ordenadas por User Story priority

## Complexity Tracking

> **Nenhuma violação de Constitution detectada. Tabela não aplicável.**

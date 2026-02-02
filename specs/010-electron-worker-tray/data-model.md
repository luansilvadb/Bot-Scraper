# Data Model: Electron Worker Tray Application

**Feature**: 010-electron-worker-tray  
**Date**: 2026-02-02

## Overview

Este documento define as estruturas de dados utilizadas no aplicativo Electron Worker. Como é uma aplicação desktop standalone, não há banco de dados relacional - os dados são mantidos em memória (runtime state) e em arquivo local criptografado (configuração persistente).

---

## Entities

### 1. WorkerConfig (Persisted)

Configurações do Worker salvas localmente via `electron-store`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| serverUrl | string | Yes | URL do backend (ex: `https://api.example.com`) |
| workerToken | string | Yes | Token de autenticação do worker |
| workerName | string | Yes | Nome identificador do worker |
| autoStart | boolean | No | Se deve iniciar com o Windows (default: false) |
| minimizeToTray | boolean | No | Se deve minimizar para tray ao fechar (default: true) |

**Storage Location**: `%APPDATA%/bot-scraper-worker/config.json` (encrypted)

**Validation Rules**:
- `serverUrl`: Must be valid URL (http:// or https://)
- `workerToken`: Non-empty string, min 10 characters
- `workerName`: Non-empty string, max 50 characters

---

### 2. WorkerStatus (Runtime State)

Estado atual do Worker mantido em memória no Main Process.

| Field | Type | Description |
|-------|------|-------------|
| connectionState | ConnectionState | Estado da conexão WebSocket |
| workerId | string \| null | ID atribuído pelo servidor após registro |
| tasksCompleted | number | Contador de tarefas finalizadas na sessão |
| tasksFailed | number | Contador de tarefas com erro na sessão |
| currentTask | CurrentTask \| null | Informações da tarefa em andamento |
| lastError | string \| null | Última mensagem de erro (se houver) |
| connectedAt | Date \| null | Timestamp da conexão bem-sucedida |
| externalIp | string \| null | IP externo detectado |
| ispName | string \| null | Nome do provedor de internet |

---

### 3. ConnectionState (Enum)

Estados possíveis da conexão WebSocket.

| Value | Description | Tray Icon |
|-------|-------------|-----------|
| DISCONNECTED | Não conectado ao servidor | 🔴 Vermelho |
| CONNECTING | Tentando estabelecer conexão | 🟡 Amarelo |
| CONNECTED | Conectado e aguardando tarefas | 🟢 Verde |
| WORKING | Processando uma tarefa de scraping | 🔵 Azul (animado) |
| ERROR | Erro de conexão ou autenticação | 🔴 Vermelho |
| RECONNECTING | Reconectando após perda de conexão | 🟡 Amarelo |

---

### 4. CurrentTask (Runtime State)

Informações sobre a tarefa sendo processada.

| Field | Type | Description |
|-------|------|-------------|
| taskId | string | ID único da tarefa |
| productUrl | string | URL do produto sendo extraído |
| startedAt | Date | Quando a tarefa iniciou |
| progress | string | Descrição do passo atual (ex: "Carregando página...") |

---

### 5. TrayState (Derived State)

Estado visual do ícone na bandeja, derivado do WorkerStatus.

| Field | Type | Description |
|-------|------|-------------|
| iconPath | string | Caminho para o arquivo de ícone atual |
| tooltip | string | Texto exibido ao passar o mouse sobre o ícone |
| isAnimating | boolean | Se o ícone deve pulsar/animar |

**Derivation Rules**:
```
if (connectionState === WORKING) → icon-working, animating
else if (connectionState === CONNECTED) → icon-idle, not animating
else if (connectionState === CONNECTING || RECONNECTING) → icon-connecting
else → icon-error
```

---

## State Transitions

### Connection State Machine

```
                    ┌─────────────┐
                    │ DISCONNECTED│
                    └──────┬──────┘
                           │ connect()
                           ▼
                    ┌─────────────┐
           ┌───────►│ CONNECTING  │◄───────┐
           │        └──────┬──────┘        │
           │               │ success       │ retry
           │               ▼               │
           │        ┌─────────────┐        │
           │        │  CONNECTED  │────────┤
           │        └──────┬──────┘        │
           │               │ task          │
           │               │ assigned      │
           │               ▼               │
           │        ┌─────────────┐        │
           │        │   WORKING   │        │
           │        └──────┬──────┘        │
           │               │ task          │
           │               │ complete      │
           │               ▼               │
           │        ┌─────────────┐        │
           │        │  CONNECTED  │        │
           │        └─────────────┘        │
           │                               │
           │        ┌─────────────┐        │
           └────────┤RECONNECTING │────────┘
                    └─────────────┘
                           │ max retries
                           ▼
                    ┌─────────────┐
                    │    ERROR    │
                    └─────────────┘
```

---

## IPC Message Types

### Main → Renderer

| Event | Payload | Description |
|-------|---------|-------------|
| `worker:status-changed` | WorkerStatus | Notifica mudança de estado |
| `worker:config-loaded` | WorkerConfig \| null | Configuração carregada ao iniciar |
| `worker:task-progress` | { taskId, progress } | Atualização de progresso da tarefa |

### Renderer → Main (Invoke)

| Channel | Args | Returns | Description |
|---------|------|---------|-------------|
| `worker:get-status` | - | WorkerStatus | Obtém estado atual |
| `worker:get-config` | - | WorkerConfig \| null | Obtém configuração salva |
| `worker:save-config` | WorkerConfig | boolean | Salva nova configuração |
| `worker:connect` | - | void | Inicia conexão com servidor |
| `worker:disconnect` | - | void | Desconecta do servidor |
| `worker:toggle-pause` | - | boolean | Pausa/Resume o worker |

---

## Persistence Strategy

| Data | Storage | Encryption | Lifecycle |
|------|---------|------------|-----------|
| WorkerConfig | electron-store file | AES-256 | Persists across sessions |
| WorkerStatus | In-memory (Main Process) | N/A | Reset on app restart |
| Task History | Not persisted locally | N/A | Sent to backend only |

---

## Notes

- **Sem banco de dados local**: Toda persistência de tarefas/produtos é feita no backend (nuvem).
- **Minimal footprint**: Apenas configuração é salva localmente para manter o app leve.
- **Privacy**: IP externo e ISP são obtidos via API do backend, não armazenados localmente além da sessão.

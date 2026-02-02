# Research: Electron Worker Tray Application

**Feature**: 010-electron-worker-tray  
**Date**: 2026-02-02  
**Status**: Complete

## Research Topics

### 1. Electron + React Integration Pattern

**Decision**: Usar `electron-vite` como bundler

**Rationale**: 
- Configuração zero para projetos Electron + React + TypeScript
- Hot Module Replacement (HMR) funciona tanto no Main quanto no Renderer
- Build otimizado para produção
- Suporte nativo a preload scripts

**Alternatives Considered**:
- `electron-forge`: Mais completo mas complexo para projetos simples
- `webpack` manual: Configuração trabalhosa, propenso a erros
- `electron-react-boilerplate`: Muito "opinionated", dificulta customização

---

### 2. Credential Storage Security

**Decision**: Usar `electron-store` com criptografia habilitada

**Rationale**:
- API simples e direta para persistência local
- Suporte nativo a encryptionKey derivada
- Arquivo JSON criptografado (AES-256)
- Não requer runtime adicional (vs keytar que precisa de native modules)

**Alternatives Considered**:
- `keytar`: Usa Windows Credential Manager, mais seguro mas complexo de buildar
- `.env` plaintext: Inseguro, qualquer programa pode ler
- `node-keychain`: Deprecated, sem suporte ativo

**Implementation Notes**:
```typescript
import Store from 'electron-store';

const store = new Store({
  encryptionKey: 'derived-from-machine-id',
  name: 'worker-config',
});
```

---

### 3. Single Instance Lock

**Decision**: Usar `app.requestSingleInstanceLock()` nativo do Electron

**Rationale**:
- API nativa do Electron, sem dependências extras
- Permite focar a janela existente quando segunda instância tenta abrir
- Cross-platform (funciona em Windows, macOS, Linux)

**Implementation Pattern**:
```typescript
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
```

---

### 4. Windows Auto-Start

**Decision**: Usar `app.setLoginItemSettings()` nativo do Electron

**Rationale**:
- API nativa, sem manipulação direta do Registry
- Usa a pasta de Startup do Windows automaticamente
- Pode ser habilitado/desabilitado programaticamente

**Alternatives Considered**:
- Manipulação direta do Registry: Requer permissões elevadas
- Scheduled Task: Overkill para auto-start simples
- `auto-launch` npm package: Dependência extra para algo que Electron já faz

**Implementation Pattern**:
```typescript
app.setLoginItemSettings({
  openAtLogin: true,
  path: app.getPath('exe'),
});
```

---

### 5. System Tray Implementation

**Decision**: Usar `Tray` class nativo do Electron com ícones dinâmicos

**Rationale**:
- API robusta e bem documentada
- Suporte a ícones diferentes para cada estado
- Menu de contexto nativo do Windows
- Tooltip dinâmico

**Icon Strategy**:
- `icon-idle.ico`: Verde (16x16, 32x32, 64x64)
- `icon-working.ico`: Azul (animação simulada com troca periódica)
- `icon-error.ico`: Vermelho
- `icon-connecting.ico`: Amarelo/Cinza

**Implementation Notes**:
```typescript
const tray = new Tray(path.join(__dirname, 'assets/icon-idle.ico'));

tray.setToolTip('Bot-Scraper Worker - Conectado');
tray.setContextMenu(Menu.buildFromTemplate([
  { label: 'Abrir', click: () => showStatusWindow() },
  { label: 'Pausar', click: () => togglePause() },
  { type: 'separator' },
  { label: 'Sair', click: () => app.quit() },
]));
```

---

### 6. Mini Window (Notification Style)

**Decision**: BrowserWindow frameless posicionada no canto inferior direito

**Rationale**:
- Controle total sobre aparência e animação
- Pode ter bordas arredondadas e transparência
- Fecha ao perder foco (comportamento de notificação)

**Key BrowserWindow Options**:
```typescript
const statusWindow = new BrowserWindow({
  width: 320,
  height: 180,
  frame: false,
  transparent: true,
  resizable: false,
  skipTaskbar: true,
  alwaysOnTop: true,
  show: false,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
  },
});

// Posicionar no canto inferior direito
const { width, height } = screen.getPrimaryDisplay().workAreaSize;
statusWindow.setPosition(width - 340, height - 200);
```

---

### 7. IPC Communication Pattern

**Decision**: Context Bridge com API tipada

**Rationale**:
- Segurança: Renderer não tem acesso direto ao Node.js
- Type-safety: Contratos claros entre Main e Renderer
- Manutenibilidade: API explícita facilita debugging

**Contract Design**:
```typescript
// preload.ts
contextBridge.exposeInMainWorld('workerAPI', {
  getStatus: () => ipcRenderer.invoke('worker:get-status'),
  connect: (config: WorkerConfig) => ipcRenderer.invoke('worker:connect', config),
  disconnect: () => ipcRenderer.invoke('worker:disconnect'),
  onStatusChange: (callback: (status: WorkerStatus) => void) => {
    ipcRenderer.on('worker:status-changed', (_, status) => callback(status));
  },
});
```

---

### 8. Playwright Integration in Electron

**Decision**: Executar Playwright no Main Process como child process

**Rationale**:
- Renderer Process não deve rodar código pesado
- Playwright precisa de acesso ao sistema de arquivos
- Isolar crashes do navegador do app principal

**Implementation Notes**:
- Reutilizar código do `worker/src/scraper.service.ts`
- Comunicar resultados via IPC
- Browser instance gerenciada no Main Process

---

## Summary Table

| Topic | Decision | Complexity |
|-------|----------|------------|
| Bundler | electron-vite | Low |
| Credentials | electron-store (encrypted) | Low |
| Single Instance | app.requestSingleInstanceLock() | Low |
| Auto-Start | app.setLoginItemSettings() | Low |
| System Tray | Electron Tray with dynamic icons | Medium |
| Mini Window | Frameless BrowserWindow | Medium |
| IPC | Context Bridge + typed API | Medium |
| Scraping | Playwright in Main Process | High (migration) |

**All research topics resolved. Ready for Phase 1: Design & Contracts.**

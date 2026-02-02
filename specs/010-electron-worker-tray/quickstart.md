# Quickstart: Electron Worker Tray Application

**Feature**: 010-electron-worker-tray  
**Date**: 2026-02-02

## Overview

Este guia permite verificar rapidamente se o aplicativo Electron Worker está funcionando corretamente após a implementação.

---

## Pré-requisitos

- [ ] Node.js 18+ instalado
- [ ] Backend rodando (local ou cloud) com endpoint WebSocket funcional
- [ ] Token de worker válido configurado no backend

---

## Setup de Desenvolvimento

### 1. Instalar dependências

```powershell
cd worker-app
npm install
```

### 2. Configurar ambiente

Crie o arquivo `.env` na raiz do `worker-app/`:

```env
# Development settings
VITE_DEV_SERVER_URL=http://localhost:5173
```

### 3. Iniciar em modo desenvolvimento

```powershell
npm run dev
```

Isso iniciará:
- Vite dev server para o Renderer (React)
- Electron com hot-reload

---

## Verificação Funcional

### 1. Primeira Execução (Configuração)

| Passo | Ação | Resultado Esperado |
|-------|------|-------------------|
| 1.1 | Inicie o app | Janela de configuração aparece |
| 1.2 | Deixe em branco e clique "Conectar" | Mensagens de erro de validação aparecem |
| 1.3 | Preencha URL, Token e Nome válidos | Botão "Salvar e Conectar" habilitado |
| 1.4 | Clique "Salvar e Conectar" | Janela minimiza, ícone aparece na bandeja |

### 2. System Tray

| Passo | Ação | Resultado Esperado |
|-------|------|-------------------|
| 2.1 | Localize o ícone na bandeja | Ícone verde (se conectado) ou vermelho (se não) |
| 2.2 | Passe o mouse sobre o ícone | Tooltip mostra "Bot-Scraper Worker - Conectado" |
| 2.3 | Clique direito no ícone | Menu com "Abrir", "Pausar", "Sair" aparece |

### 3. Mini Janela de Status

| Passo | Ação | Resultado Esperado |
|-------|------|-------------------|
| 3.1 | Clique (esquerdo) no ícone da bandeja | Mini janela aparece no canto inferior direito |
| 3.2 | Verifique o conteúdo | Mostra status de conexão e contadores |
| 3.3 | Clique fora da janela | Janela desaparece |

### 4. Estados do Ícone

| Estado | Como Testar | Ícone Esperado |
|--------|-------------|----------------|
| Conectado | App conectado ao backend | 🟢 Verde |
| Trabalhando | Dispare uma tarefa de scraping | 🔵 Azul (pulsando) |
| Desconectado | Desligue o backend | 🔴 Vermelho |
| Reconectando | Religue o backend | 🟡 Amarelo |

### 5. Single Instance

| Passo | Ação | Resultado Esperado |
|-------|------|-------------------|
| 5.1 | Com o app rodando, tente abrir outro | Segunda instância NÃO abre |
| 5.2 | (Continua) | Primeira instância ganha foco |

### 6. Fechar vs Minimizar

| Passo | Ação | Resultado Esperado |
|-------|------|-------------------|
| 6.1 | Clique no X da janela | Janela fecha, ícone permanece na bandeja |
| 6.2 | Clique "Sair" no menu da bandeja | App fecha completamente, ícone some |

---

## Build de Produção

### 1. Gerar executável

```powershell
npm run build
```

### 2. Verificar output

```powershell
ls dist/
# Deve conter: Bot-Scraper-Worker-Setup-1.0.0.exe (ou similar)
```

### 3. Testar instalador

1. Execute o instalador gerado
2. Verifique que o app foi instalado em `%LOCALAPPDATA%\Programs\`
3. Execute o atalho criado no menu Iniciar
4. Repita os testes funcionais acima

---

## Troubleshooting

| Problema | Causa Provável | Solução |
|----------|----------------|---------|
| Ícone não aparece na bandeja | Windows escondeu em "ícones ocultos" | Arraste para área visível |
| Conexão sempre vermelha | URL ou Token incorretos | Verifique configuração |
| App não inicia | Porta em uso ou crash | Verifique logs em `%APPDATA%/bot-scraper-worker/logs` |
| Erro "EPERM" ao salvar | Pasta sem permissão de escrita | Execute como administrador ou reinstale |

---

## Logs de Desenvolvimento

Para debug, os logs aparecem em:

- **Dev Mode**: Console do Electron (DevTools: `Ctrl+Shift+I`)
- **Produção**: `%APPDATA%/bot-scraper-worker/logs/main.log`

---

## Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia em modo desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run build:win` | Gera instalador Windows |
| `npm run lint` | Verifica código |
| `npm run test` | Executa testes unitários |
| `npm run test:e2e` | Executa testes E2E |

---

## Checklist Final

- [ ] App inicia e mostra tela de configuração na primeira vez
- [ ] Configuração é validada antes de salvar
- [ ] Ícone aparece na bandeja após configuração
- [ ] Ícone muda de cor conforme status
- [ ] Mini janela mostra informações corretas
- [ ] Menu de contexto funciona
- [ ] Fechar janela minimiza para tray (não fecha app)
- [ ] "Sair" no menu fecha o app completamente
- [ ] Single instance funciona
- [ ] Build de produção gera instalador funcional

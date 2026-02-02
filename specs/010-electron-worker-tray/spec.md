# Feature Specification: Electron Worker Tray Application

**Feature Branch**: `010-electron-worker-tray`  
**Created**: 2026-02-02  
**Status**: Draft  
**Input**: User description: "Transform the worker into an Electron desktop application with system tray icon and a notification-style mini window for status display"

## Clarifications

### Session 2026-02-02

- Q: O aplicativo deve suportar apenas Windows ou também macOS/Linux? → A: Apenas Windows (MVP focado)
- Q: Qual o nível de proteção para as credenciais salvas localmente? → A: Criptografia simples (chave derivada do hardware)

## Scope & Constraints

- **Plataforma Suportada**: Apenas Windows (macOS e Linux estão fora do escopo do MVP)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Start & Minimize to Tray (Priority: P1) 🎯 MVP

O cliente inicia o aplicativo Worker clicando duas vezes no arquivo `.exe`. Após o início, o aplicativo se conecta automaticamente ao backend na nuvem e aparece como um ícone na bandeja do sistema (system tray), próximo ao relógio do Windows. O cliente pode continuar usando o computador normalmente enquanto o Worker opera em segundo plano.

**Why this priority**: Esta é a funcionalidade fundamental que transforma o Worker de um script de terminal em um aplicativo de desktop profissional. Sem isso, o cliente precisa manter uma janela de terminal aberta, o que é confuso e pouco amigável.

**Independent Test**: Pode ser testado instalando o aplicativo e verificando que o ícone aparece na bandeja do sistema e que a conexão WebSocket é estabelecida com sucesso.

**Acceptance Scenarios**:

1. **Given** o aplicativo está fechado, **When** o cliente clica duas vezes no `worker.exe`, **Then** o aplicativo inicia, conecta ao backend e um ícone aparece na bandeja do sistema.
2. **Given** o aplicativo está rodando, **When** o cliente clica no botão de fechar (X) da janela principal, **Then** a janela é escondida mas o aplicativo continua rodando na bandeja do sistema.
3. **Given** o aplicativo está na bandeja, **When** o cliente clica com o botão direito no ícone, **Then** um menu de contexto aparece com opções (Abrir, Pausar, Sair).

---

### User Story 2 - Mini Janela de Status (Priority: P1) 🎯 MVP

Ao clicar no ícone da bandeja do sistema, uma pequena janela estilizada (estilo notificação do Windows) aparece no canto inferior direito da tela, exibindo o status atual do Worker: se está conectado, quantas tarefas foram processadas e se há alguma tarefa em andamento.

**Why this priority**: Esta é a interface visual que dá ao cliente a confiança de que o sistema está funcionando. Sem feedback visual, o cliente não sabe se o Worker está realmente trabalhando.

**Independent Test**: Pode ser testado clicando no ícone da bandeja e verificando que a janela de status aparece com informações corretas sobre a conexão e as tarefas.

**Acceptance Scenarios**:

1. **Given** o aplicativo está na bandeja do sistema, **When** o cliente clica uma vez no ícone, **Then** uma mini janela aparece no canto inferior direito da tela mostrando o status de conexão.
2. **Given** a mini janela está visível, **When** o cliente clica fora da janela ou no botão de fechar, **Then** a janela desaparece e o aplicativo continua rodando na bandeja.
3. **Given** uma tarefa de scraping está em andamento, **When** o cliente visualiza a mini janela, **Then** ela mostra uma indicação visual de "Trabalhando..." com animação.

---

### User Story 3 - Configuração Inicial (Priority: P2)

Na primeira execução do aplicativo, ou quando as credenciais não estão configuradas, uma janela de configuração é exibida pedindo ao cliente para inserir a URL do servidor e o Token de autenticação. Essas informações são salvas localmente para uso futuro.

**Why this priority**: Essencial para que o cliente consiga se conectar ao backend correto, mas pode ser contornada inicialmente com um arquivo `.env` pré-configurado.

**Independent Test**: Pode ser testado iniciando o aplicativo sem arquivo de configuração e verificando que a tela de configuração é exibida e funciona corretamente.

**Acceptance Scenarios**:

1. **Given** o aplicativo é iniciado pela primeira vez (sem configuração), **When** a janela principal carrega, **Then** uma tela de configuração é exibida com campos para URL do servidor e Token.
2. **Given** o cliente preencheu os campos de configuração, **When** ele clica em "Salvar e Conectar", **Then** as credenciais são salvas localmente e o aplicativo tenta conectar ao backend.
3. **Given** as credenciais salvas são inválidas, **When** a conexão falha, **Then** uma mensagem de erro amigável é exibida e o cliente pode editar as configurações.

---

### User Story 4 - Indicador Visual de Status na Bandeja (Priority: P2)

O ícone na bandeja do sistema muda de cor ou aparência para indicar visualmente o status atual do Worker: verde para "conectado e ocioso", azul pulsante para "trabalhando em tarefa", e vermelho para "desconectado ou com erro".

**Why this priority**: Permite que o cliente saiba o status do Worker com um único olhar, sem precisar abrir a mini janela.

**Independent Test**: Pode ser testado observando a mudança do ícone durante diferentes estados do Worker (conectando, trabalhando, ocioso, desconectado).

**Acceptance Scenarios**:

1. **Given** o Worker está conectado e ocioso, **When** o cliente olha para a bandeja, **Then** o ícone é exibido em cor verde.
2. **Given** o Worker está processando uma tarefa, **When** o cliente olha para a bandeja, **Then** o ícone é exibido em cor azul ou com animação.
3. **Given** o Worker perdeu a conexão com o backend, **When** o cliente olha para a bandeja, **Then** o ícone é exibido em cor vermelha.

---

### User Story 5 - Iniciar com o Windows (Priority: P3)

O cliente pode configurar o aplicativo para iniciar automaticamente quando o Windows é ligado, garantindo que o Worker sempre esteja disponível para receber tarefas sem intervenção manual.

**Why this priority**: Conveniência para clientes que querem um sistema "configure e esqueça", mas não é crítico para o funcionamento básico.

**Independent Test**: Pode ser testado ativando a opção e reiniciando o computador para verificar que o aplicativo inicia automaticamente.

**Acceptance Scenarios**:

1. **Given** a opção "Iniciar com o Windows" está desativada, **When** o cliente ativa a opção nas configurações, **Then** o aplicativo é registrado para iniciar automaticamente.
2. **Given** a opção está ativada, **When** o Windows é reiniciado, **Then** o aplicativo inicia automaticamente e aparece na bandeja do sistema.

---

### Edge Cases

- **Falha de Rede**: O que acontece quando a conexão com o backend é perdida durante uma tarefa? O Worker deve salvar o estado e tentar reconectar automaticamente.
- **Múltiplas Instâncias**: O que acontece se o cliente tentar abrir o aplicativo duas vezes? Apenas uma instância deve rodar, a segunda deve focar a existente.
- **Tela de Alta DPI**: A mini janela deve ser renderizada corretamente em monitores com escalas diferentes (100%, 125%, 150%).
- **Bloqueio de Antivírus**: O aplicativo pode ser bloqueado por antivírus; deve haver documentação clara sobre como permitir a execução.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE exibir um ícone na bandeja do sistema (system tray) do Windows enquanto estiver em execução.
- **FR-002**: O sistema DEVE manter a conexão WebSocket com o backend em segundo plano, mesmo quando a janela principal está fechada.
- **FR-003**: O sistema DEVE exibir uma mini janela de status estilizada ao clicar no ícone da bandeja.
- **FR-004**: A mini janela DEVE mostrar o status de conexão (Conectado/Desconectado).
- **FR-005**: A mini janela DEVE mostrar estatísticas básicas (tarefas completadas, tarefa atual se houver).
- **FR-006**: O sistema DEVE permitir que o cliente insira a URL do servidor e o Token de autenticação.
- **FR-007**: O sistema DEVE salvar as credenciais de configuração com criptografia simples usando chave derivada do hardware local.
- **FR-008**: O sistema DEVE mudar a aparência do ícone da bandeja para refletir o status atual do Worker.
- **FR-009**: O sistema DEVE fornecer um menu de contexto (clique direito) no ícone da bandeja com opções básicas.
- **FR-010**: O sistema DEVE impedir múltiplas instâncias do aplicativo rodando simultaneamente.
- **FR-011**: O sistema DEVE permitir a opção de iniciar automaticamente com o Windows.
- **FR-012**: O sistema DEVE reconectar automaticamente ao backend em caso de perda de conexão.

### Key Entities

- **WorkerConfig**: Configurações do Worker incluindo URL do servidor, token de autenticação, nome do worker e preferências de inicialização.
- **WorkerStatus**: Estado atual do Worker incluindo status de conexão, contadores de tarefas e informações da tarefa em andamento se houver.
- **TrayState**: Estado visual do ícone da bandeja (cor/animação) baseado no status do Worker.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O cliente consegue instalar e conectar o Worker ao backend em menos de 2 minutos.
- **SC-002**: O aplicativo consome menos de 100MB de RAM quando ocioso (excluindo memória do navegador durante scraping).
- **SC-003**: O ícone da bandeja reflete o status correto do Worker em menos de 2 segundos após uma mudança de estado.
- **SC-004**: A reconexão automática ocorre em menos de 30 segundos após perda de conexão.
- **SC-005**: O tamanho do instalador final é menor que 150MB.
- **SC-006**: 100% dos clientes conseguem identificar visualmente se o Worker está funcionando apenas olhando para o ícone na bandeja.

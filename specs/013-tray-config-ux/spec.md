# Feature Specification: System Tray Configuration UX Premium

**Feature Branch**: `013-tray-config-ux`  
**Created**: 2026-02-02  
**Status**: Draft  
**Input**: User description: "Melhorar UX da tela de configuração do worker-app, embutindo na janela do system tray com design premium big-tech"

## Clarifications

### Session 2026-02-02

- Q: O worker-app deve seguir o mesmo design do frontend dashboard ou manter identidade visual própria? → A: **Unificar** - O worker-app deve seguir exatamente o design do frontend dashboard (mesmas cores, mesmos padrões visuais)
- Q: Quando o usuário clica fora da tray window (popup), o que deve acontecer? → A: **Esconder popup ao perder foco** - Popup desaparece, worker continua ativo em background, clicar no tray reabre

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configuração Integrada na Tray Window (Priority: P1)

Quando o usuário clica no ícone do system tray, uma janela compacta e elegante aparece no canto da tela (próximo à área de notificação). Se o worker ainda não estiver configurado, esta mesma janela exibe o formulário de configuração de forma integrada, sem abrir uma janela separada no centro da tela. O design deve seguir os mesmos padrões visuais do frontend dashboard para consistência de marca.

**Why this priority**: Esta é a mudança fundamental - eliminar a janela de configuração centralizada e integrá-la na tray window. Afeta diretamente a primeira impressão do usuário e a experiência de onboarding.

**Independent Test**: Fechar o worker-app completamente, reabrir, e verificar que a configuração aparece na janela do tray (canto da tela) e não em uma janela separada centralizada.

**Acceptance Scenarios**:

1. **Given** o worker não está configurado (primeiro uso), **When** o usuário clica no ícone do tray, **Then** a tray window exibe o formulário de configuração com design consistente com o frontend dashboard
2. **Given** a tray window está aberta mostrando configuração, **When** o usuário redimensiona ou move a janela, **Then** ela permanece ancorada ao canto da tela próximo ao tray
3. **Given** o formulário de configuração está visível, **When** o usuário preenche o token e clica Conectar, **Then** a janela transiciona suavemente para a view de status

---

### User Story 2 - Design Unificado com Frontend Dashboard (Priority: P1)

A janela do tray deve ter aparência visual idêntica ao frontend dashboard, usando as mesmas cores, tipografia, componentes Fluent UI, e padrões visuais. Isso garante consistência de marca e reconhecimento imediato pelo usuário. Efeitos premium como glassmorphism, bordas arredondadas e micro-animações devem ser aplicados seguindo o mesmo padrão visual do dashboard.

**Why this priority**: A consistência visual entre worker-app e dashboard transmite profissionalismo e unidade de produto. O usuário deve reconhecer imediatamente que ambos fazem parte do mesmo ecossistema.

**Independent Test**: Capturar screenshots do worker-app e do frontend dashboard lado a lado e validar que cores, tipografia e componentes são visualmente consistentes.

**Acceptance Scenarios**:

1. **Given** a tray window está aberta, **When** o usuário a compara com o dashboard, **Then** as cores primárias, secundárias e de acento são idênticas
2. **Given** a tray window está aberta, **When** os elementos carregam ou mudam de estado, **Then** transições e animações seguem o mesmo padrão do dashboard (mínimo 60fps)
3. **Given** qualquer botão ou campo está visível, **When** o usuário passa o mouse sobre ele, **Then** feedback visual de hover é idêntico ao do dashboard

---

### User Story 3 - Navegação Fluida entre Status e Config (Priority: P2)

Quando o worker já está configurado, a janela do tray mostra o status. O usuário pode acessar as configurações através de um botão/ícone de engrenagem. A transição entre as views (Status ↔ Config) deve ser animada e fluida, sem recarregar a janela ou causar flicker.

**Why this priority**: Após a configuração inicial, esta será a interação mais comum - verificar status e ocasionalmente ajustar configurações.

**Independent Test**: Com worker configurado, clicar no ícone de settings, verificar transição suave para config, salvar e verificar retorno suave para status.

**Acceptance Scenarios**:

1. **Given** a view de status está ativa, **When** o usuário clica no ícone de configurações, **Then** a view desliza/transiciona para configurações sem recarregar
2. **Given** a view de configuração está ativa, **When** o usuário salva ou cancela, **Then** a view transiciona suavemente de volta para status
3. **Given** qualquer transição está acontecendo, **When** observada pelo usuário, **Then** não há flicker, piscar ou conteúdo parcialmente renderizado

---

### User Story 4 - Feedback Visual de Conexão (Priority: P2)

Durante a conexão com o servidor (após inserir token), o usuário vê indicadores visuais claros do progresso: spinner animado, mensagens de status em tempo real, e feedback de sucesso/erro com animações apropriadas, todos seguindo o padrão visual do dashboard.

**Why this priority**: O momento de conexão é crítico para a confiança do usuário. Feedback visual adequado reduz ansiedade e suporte.

**Independent Test**: Inserir token válido, clicar Conectar, observar sequência de feedback visual até conexão completa.

**Acceptance Scenarios**:

1. **Given** o usuário clicou Conectar, **When** a conexão está em progresso, **Then** um loader/spinner consistente com o dashboard é exibido
2. **Given** a conexão foi bem-sucedida, **When** o estado muda, **Then** uma animação de sucesso (checkmark animado, cor verde) é exibida
3. **Given** a conexão falhou, **When** o erro é detectado, **Then** feedback visual de erro (shake animation, cor vermelha) é exibido com mensagem clara

---

### Edge Cases

- O que acontece quando a janela perde o foco?
  - A popup esconde automaticamente; worker continua ativo em background; clicar no tray reabre a popup
- O que acontece se o token for inválido?
  - Exibir mensagem de erro clara na própria janela com opção de tentar novamente
- O que acontece em monitores com DPI alto (4K)?
  - Todos os elementos devem escalar corretamente mantendo proporções e legibilidade
- O que acontece se a janela for arrastada para fora da área visível?
  - Reposicionar automaticamente para área visível na próxima abertura

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A janela do tray DEVE exibir configuração integrada quando worker não está configurado
- **FR-002**: A janela do tray DEVE usar as mesmas cores e tokens visuais do frontend dashboard
- **FR-003**: A janela DEVE ter bordas arredondadas consistentes com o dashboard (8px radius padrão)
- **FR-004**: Todas as transições entre views DEVEM ser animadas com duração entre 200-300ms
- **FR-005**: O formulário de configuração DEVE ter os mesmos campos da versão atual (token, nome, auto-start, minimize-to-tray)
- **FR-006**: Hover states DEVEM ter feedback visual imediato (< 50ms)
- **FR-007**: O spinner de loading DEVE usar o componente Spinner do Fluent UI (mesmo do dashboard)
- **FR-008**: Mensagens de erro DEVEM ser exibidas inline no formulário
- **FR-009**: A janela DEVE permanecer ancorada próxima ao system tray
- **FR-010**: A transição de config → status após salvar DEVE ser animada
- **FR-014**: A popup DEVE esconder automaticamente ao perder foco (blur), mantendo worker ativo em background
- **FR-011**: Botões DEVEM usar os mesmos estilos do dashboard (Fluent UI Button)
- **FR-012**: A janela DEVE suportar temas claro e escuro do sistema (seguindo o dashboard)
- **FR-013**: A tipografia DEVE usar as mesmas fontes e tamanhos do dashboard

### Key Entities

- **TrayWindow**: Janela principal ancorada ao system tray
  - Contém StatusView e ConfigView como sub-componentes
  - Gerencia transições animadas entre views
  - Usa design system unificado com frontend dashboard
  
- **ConfigView**: Formulário de configuração integrado
  - Campos: token, workerName, autoStart, minimizeToTray
  - Estados: idle, validating, connecting, success, error

- **StatusView**: Exibição de status do worker (já existente)
  - Estatísticas, estado de conexão, controles de pause/quit

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos usuários conseguem configurar o worker na primeira tentativa sem ajuda externa
- **SC-002**: Tempo de configuração inicial não ultrapassa 30 segundos
- **SC-003**: Todas as transições completam em menos de 300ms
- **SC-004**: Nenhum frame drop visível (mínimo 60fps) durante animações
- **SC-005**: Taxa de abandono durante onboarding reduzida em 50% comparado ao design atual
- **SC-006**: Satisfação visual medida em testes com usuários atinge nota mínima 4/5
- **SC-007**: Zero tickets de suporte relacionados a "não encontro onde configurar"
- **SC-008**: 100% de consistência visual entre worker-app e dashboard (validado por comparação)

## Assumptions

- O Electron suporta CSS backdrop-filter para efeitos visuais no Windows 10/11
- A posição da janela será calculada dinamicamente baseada na posição do ícone do tray
- O usuário tem Windows 10 ou superior (necessário para efeitos visuais modernos)
- Fluent UI v9 será usado como base de componentes (mesmo framework do dashboard)
- O design system do frontend dashboard será a referência visual principal
- Cores e tokens CSS serão compartilhados ou sincronizados entre worker-app e dashboard

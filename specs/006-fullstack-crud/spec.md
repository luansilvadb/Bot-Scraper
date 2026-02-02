# Feature Specification: CRUD Completo Fullstack

**Feature Branch**: `006-fullstack-crud`  
**Created**: 2026-02-01  
**Status**: Draft  
**Input**: User description: "CRUD completo no frontend e no backend para gerenciamento de dados do sistema"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Gerenciar Bots (Priority: P1)

O usuário precisa criar, visualizar, editar e excluir bots de scraping através da interface web. Cada bot representa uma configuração de scraping que inclui URL alvo, tag de afiliado, token do Telegram e agenda de execução.

**Why this priority**: Bots são a entidade principal do sistema. Sem a capacidade de gerenciá-los completamente, o sistema não pode funcionar. Esta é a funcionalidade core que habilita todo o fluxo de trabalho.

**Independent Test**: Pode ser testado criando um bot através da interface, verificando que aparece na lista, editando seus dados e confirmando a atualização, e finalmente excluindo-o e verificando a remoção.

**Acceptance Scenarios**:

1. **Given** o usuário está na página de bots, **When** clica em "Novo Bot" e preenche todos os campos obrigatórios (nome, URL alvo, tag afiliado, token Telegram, chat ID, cron), **Then** o bot é criado e aparece na lista de bots
2. **Given** existe um bot na lista, **When** o usuário clica em "Editar" e modifica o nome, **Then** a alteração é salva e refletida na lista
3. **Given** existe um bot na lista, **When** o usuário clica em "Excluir" e confirma, **Then** o bot é removido da lista
4. **Given** o usuário está na página de bots, **When** existem múltiplos bots cadastrados, **Then** todos são exibidos em uma tabela com informações principais (nome, URL, status)

---

### User Story 2 - Gerenciar Proxies (Priority: P2)

O usuário precisa gerenciar proxies que serão utilizados pelos bots para evitar bloqueios durante o scraping. Isso inclui criar, listar, editar e excluir configurações de proxy.

**Why this priority**: Proxies são necessários para operação confiável dos bots, mas o sistema pode funcionar inicialmente sem eles. São a segunda camada de funcionalidade após os bots.

**Independent Test**: Pode ser testado criando um proxy com host, porta e protocolo, verificando que aparece na lista, editando as credenciais e excluindo o proxy.

**Acceptance Scenarios**:

1. **Given** o usuário está na página de proxies, **When** clica em "Novo Proxy" e preenche host, porta e protocolo, **Then** o proxy é criado e aparece na lista
2. **Given** existe um proxy na lista, **When** o usuário clica em "Editar" e adiciona credenciais (usuário/senha), **Then** a alteração é salva
3. **Given** existe um proxy na lista, **When** o usuário clica em "Excluir" e confirma, **Then** o proxy é removido
4. **Given** existem proxies cadastrados, **When** o usuário visualiza a lista, **Then** vê status de cada proxy (ONLINE/OFFLINE) e última verificação

---

### User Story 3 - Gerenciar Produtos Scrapeados (Priority: P3)

O usuário precisa visualizar, aprovar, rejeitar e excluir produtos que foram encontrados pelo scraping. Isso permite curadoria do conteúdo antes de ser postado no Telegram.

**Why this priority**: Esta é a funcionalidade de output do sistema. Depende dos bots estarem funcionando e é a interface de aprovação de conteúdo.

**Independent Test**: Pode ser testado visualizando a lista de produtos pendentes, aprovando alguns, rejeitando outros e excluindo produtos específicos.

**Acceptance Scenarios**:

1. **Given** existem produtos com status PENDING_APPROVAL, **When** o usuário acessa a lista de produtos, **Then** vê todos os produtos pendentes com imagem, título, preços e desconto
2. **Given** existe um produto pendente, **When** o usuário clica em "Aprovar", **Then** o status muda para APPROVED
3. **Given** existe um produto pendente, **When** o usuário clica em "Rejeitar", **Then** o status muda para REJECTED
4. **Given** existe um produto na lista, **When** o usuário clica em "Excluir" e confirma, **Then** o produto é removido permanentemente

---

### User Story 4 - Gerenciar Configurações do Sistema (Priority: P4)

O usuário precisa visualizar e editar configurações globais do sistema através de pares chave-valor.

**Why this priority**: Configurações são importantes para customização, mas o sistema pode operar com valores padrão. É funcionalidade de suporte.

**Independent Test**: Pode ser testado acessando a página de configurações, editando um valor existente e criando uma nova configuração.

**Acceptance Scenarios**:

1. **Given** o usuário acessa a página de configurações, **When** a página carrega, **Then** vê todas as configurações existentes em formato chave-valor
2. **Given** existe uma configuração, **When** o usuário edita o valor e salva, **Then** o novo valor é persistido
3. **Given** o usuário está na página de configurações, **When** clica em "Nova Configuração" e preenche chave e valor, **Then** a configuração é criada

---

### Edge Cases

- O que acontece quando o usuário tenta criar um bot com campos obrigatórios vazios?
  - Sistema exibe mensagem de validação indicando campos obrigatórios
- O que acontece quando o usuário tenta excluir um bot que tem produtos associados?
  - Sistema exibe confirmação informando que produtos órfãos serão mantidos (botId será null)
- O que acontece quando o usuário tenta criar um proxy com porta inválida (ex: texto)?
  - Sistema valida e exibe erro de formato inválido
- O que acontece quando a API retorna erro durante uma operação?
  - Interface exibe notificação de erro amigável e permite retry
- O que acontece quando o usuário tenta criar uma configuração com chave já existente?
  - Sistema informa que a chave já existe e pode atualizar o valor

## Requirements *(mandatory)*

### Functional Requirements

#### Backend (API REST)

- **FR-001**: Sistema DEVE expor endpoints CRUD para a entidade Bot (GET /bots, GET /bots/:id, POST /bots, PUT /bots/:id, DELETE /bots/:id)
- **FR-002**: Sistema DEVE expor endpoints CRUD para a entidade Proxy (GET /proxies, GET /proxies/:id, POST /proxies, PUT /proxies/:id, DELETE /proxies/:id)
- **FR-003**: Sistema DEVE expor endpoints CRUD para a entidade ScrapedProduct (GET /products, GET /products/:id, POST /products, PUT /products/:id, DELETE /products/:id)
- **FR-004**: Sistema DEVE expor endpoints CRUD para a entidade SystemSetting (GET /settings, GET /settings/:key, POST /settings, PUT /settings/:key, DELETE /settings/:key)
- **FR-005**: Endpoints DEVEM retornar respostas padronizadas com códigos HTTP apropriados (200, 201, 400, 404, 500)
- **FR-006**: Endpoints DEVEM validar dados de entrada antes de persistir
- **FR-007**: Endpoints de listagem DEVEM suportar paginação (page, limit)
- **FR-008**: Endpoints de listagem DEVEM suportar filtros básicos via query params

#### Frontend (Interface Web)

- **FR-009**: Interface DEVE ter página de listagem para cada entidade (Bots, Proxies, Produtos, Configurações)
- **FR-010**: Interface DEVE ter formulário de criação para cada entidade com validação client-side
- **FR-011**: Interface DEVE ter formulário de edição para cada entidade com dados pré-preenchidos
- **FR-012**: Interface DEVE ter confirmação antes de exclusões
- **FR-013**: Interface DEVE exibir feedback visual para operações (loading, success, error)
- **FR-014**: Interface DEVE exibir mensagens de erro amigáveis quando API falha
- **FR-015**: Tabelas de listagem DEVEM exibir informações relevantes de cada entidade
- **FR-016**: Interface DEVE ser responsiva e funcionar em dispositivos móveis

#### Integração

- **FR-017**: Frontend DEVE consumir APIs do backend usando cliente HTTP
- **FR-018**: Sistema DEVE tratar erros de rede graciosamente
- **FR-019**: Frontend DEVE atualizar interface automaticamente após operações CRUD

### Key Entities

- **Bot**: Representa uma configuração de scraping com URL alvo, credenciais Telegram, agenda cron e status. Pode ter um Proxy opcional associado e múltiplos produtos encontrados.
- **Proxy**: Representa uma configuração de proxy com host, porta, protocolo e credenciais opcionais. Pode ser usado por múltiplos bots.
- **ScrapedProduct**: Representa um produto encontrado pelo scraping com dados de preço, desconto, imagem e status de aprovação. Pertence opcionalmente a um bot.
- **SystemSetting**: Representa uma configuração do sistema em formato chave-valor simples.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Usuários conseguem criar uma nova entidade (bot, proxy, produto, configuração) em menos de 30 segundos
- **SC-002**: Operações de listagem retornam resultados em menos de 2 segundos para até 1000 registros
- **SC-003**: 100% das operações CRUD têm feedback visual (loading indicator seguido de success/error message)
- **SC-004**: Interface funciona corretamente em telas de 320px até 1920px de largura
- **SC-005**: Usuários conseguem completar fluxo completo de CRUD (criar, ler, atualizar, deletar) para qualquer entidade sem necessidade de documentação
- **SC-006**: Taxa de erro de validação reduzida - formulários previnem 95% dos erros de entrada antes de enviar ao servidor
- **SC-007**: Sistema mantém consistência de dados - após qualquer operação, a interface reflete o estado atual do banco de dados

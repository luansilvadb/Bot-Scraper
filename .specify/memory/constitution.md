<!--
SYNC IMPACT REPORT
Version: 1.0.0 -> 1.1.0
Modified Principles: 
- I. Arquitetura Modular e Tipagem (Renamed/Expanded for modularity)
- IV. Escalabilidade e Assincronia (Renamed/Expanded for horizontal scaling)
Templates Status:
- plan-template.md: ✅ (Compatible)
- spec-template.md: ✅ (Compatible)
- tasks-template.md: ✅ (Compatible)
-->
# Constituição do (Bot-Scraper)

## Princípios Fundamentais

### I. Arquitetura Modular e Tipagem
A arquitetura deve ser estritamente **modular e desacoplada**. O código deve ser organizado em Módulos NestJS coesos (por domínio), garantindo que o crescimento do sistema não comprometa a manutenção. O TypeScript deve ser usado no modo estrito (**“Sem `any`”**). DTOs e interfaces são obrigatórios para contratos claros. A lógica de negócios deve residir exclusivamente em `services`, isolada de `controllers` (entrada/saída) e `processors` (jobs).

### II. Padrões de Teste
Os testes são inegociáveis.
* **Testes unitários**: Obrigatórios para todos os serviços e utilitários (`*.spec.ts`).
* **Testes E2E**: Obrigatórios para pontos finais de API críticos usando Supertest.
* **Validação do scraper**: Os scrapers devem ter um modo “Dry Run” para verificar a integridade do seletor sem acionar fluxos de trabalho completos.

### III. Experiência do Usuário e Consistência
As respostas da API devem seguir um envelope padrão (Formato de resposta padrão). Os erros de validação devem ser fáceis de usar (usando `class-validator`). O sistema deve fornecer feedback em tempo real sobre tarefas de longa duração (scraping) por meio de pontos finais de status ou WebSockets.

### IV. Escalabilidade e Assincronia
O sistema deve ser projetado para **escalabilidade horizontal**. Os serviços da API devem ser **Stateless** para permitir múltiplas réplicas. Tarefas pesadas ou de I/O de longa duração (scraping) DEVEM ser delegadas a **BullMQ Workers** apartados, desacoplando a ingestão (API) do processamento (Workers). **Bloquear o loop de eventos é proibido.**

## Pilha de Tecnologia e Padrões

### Tecnologias Principais
* **Tempo de execução**: Node.js LTS (última versão “Iron” ou “Hydrogen”).
* **Estrutura**: NestJS (monolítica modular com filas).
* **Linguagem**: TypeScript (modo estrito).
* **Banco de dados**: PostgreSQL (via **Prisma ORM** para velocidade).
* **Sistema de filas**: Redis + BullMQ (necessário para desacoplamento de scraping/postagem).
* **Mecanismo de scraping**: Playwright (com `patchright` ou `rebrowser-patches`).

### Restrições do Ambiente Local
* **Sem Docker local**: O ambiente de desenvolvimento local (Windows) NÃO tem o Docker instalado.
* **Execução nativa**: Node.js, PostgreSQL e Redis devem estar instalados e ser executados nativamente no Windows (ou via WSL2 sem Docker).
* **Uso do Docker**: Apenas para CI/CD remoto e implantação Oracle Cloud (ARM64).

## Fluxo de Trabalho de Desenvolvimento

### Diretrizes do Scraper
* **Stealth First**: Usar versões corrigidas do navegador (`package.json`) para evitar detecção.
* **Headless Toggle**: Desenvolvimento local permite `headless: false` (via `.env`), produção força `headless: true`.

### Processo de Revisão
* Todas as alterações requerem revisão de código.
* CI Checks (Lint, Teste, Compilação) devem ser aprovados.
* **Verificação de dependências**: Novos pacotes devem ser avaliados quanto à segurança e compatibilidade ARM64.

## Governança

### Processo de Alteração
* As alterações exigem uma solicitação de pull com justificativa explícita.
* O controle de versão segue o controle de versão semântico (MAJOR para alterações na pilha, MINOR para adições de recursos/normas).

### Conformidade
* Esta constituição substitui padrões conflitantes no código antigo.
* Os revisores são os guardiões desses princípios.

**Version**: 1.1.0 | **Ratified**: 2026-02-01 | **Last Amended**: 2026-02-01

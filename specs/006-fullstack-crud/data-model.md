# Data Model: CRUD Completo Fullstack

**Feature**: 006-fullstack-crud
**Date**: 2026-02-01
**Based on**: Prisma schema + Feature spec

---

## Entity Overview

```
┌──────────────┐     1:N      ┌──────────────────┐
│     Bot      │─────────────▶│  ScrapedProduct  │
│              │              │                  │
└──────┬───────┘              └──────────────────┘
       │
       │ N:1 (optional)
       ▼
┌──────────────┐
│    Proxy     │
│              │
└──────────────┘

┌──────────────────┐
│  SystemSetting   │  (standalone key-value)
│                  │
└──────────────────┘
```

---

## 1. Bot

### Description
Representa uma configuração de scraping para buscar produtos em uma URL alvo e postar ofertas no Telegram.

### Fields

| Field | Type | Required | Default | Validation Rules |
|-------|------|----------|---------|------------------|
| id | UUID | Yes | auto-generated | Read-only |
| name | String | Yes | - | Min 2 chars, Max 100 chars |
| targetUrl | String | Yes | - | Valid URL format |
| affiliateTag | String | Yes | - | Non-empty |
| telegramToken | String | Yes | - | Non-empty (sensitive) |
| chatId | String | Yes | - | Non-empty |
| scheduleCron | String | Yes | - | Valid cron expression |
| status | Enum | Yes | ACTIVE | One of: ACTIVE, PAUSED, ERROR |
| proxyId | UUID | No | null | Must exist in Proxy table |
| createdAt | DateTime | Yes | now() | Read-only |

### Relationships
- **proxy** (N:1, optional): Um bot pode usar um proxy
- **products** (1:N): Um bot pode ter múltiplos produtos scrapeados

### State Transitions

```
   ┌──────────┐
   │  ACTIVE  │◀──────────┐
   └────┬─────┘           │
        │ pause()         │ resume()
        ▼                 │
   ┌──────────┐           │
   │  PAUSED  │───────────┘
   └────┬─────┘
        │ error()
        ▼
   ┌──────────┐
   │  ERROR   │──────────▶ resume() ──▶ ACTIVE
   └──────────┘
```

### Business Rules
- Ao criar/atualizar com status ACTIVE, agendar job no BullMQ
- Ao pausar ou remover, cancelar job agendado
- Ao excluir bot, produtos órfãos mantêm botId = null

---

## 2. Proxy

### Description
Configuração de servidor proxy para uso pelos bots durante scraping.

### Fields

| Field | Type | Required | Default | Validation Rules |
|-------|------|----------|---------|------------------|
| id | UUID | Yes | auto-generated | Read-only |
| host | String | Yes | - | Valid hostname/IP |
| port | Integer | Yes | - | Range 1-65535 |
| username | String | No | null | - |
| password | String | No | null | Sensitive |
| protocol | Enum | Yes | HTTP | One of: HTTP, HTTPS, SOCKS5 |
| status | String | Yes | ONLINE | One of: ONLINE, OFFLINE |
| lastChecked | DateTime | No | null | Read-only, updated by system |

### Relationships
- **bots** (1:N): Um proxy pode ser usado por múltiplos bots

### Business Rules
- status é atualizado automaticamente por health check periódico
- Não permitir excluir proxy que está em uso por bots (soft constraint: avisar usuário)

---

## 3. ScrapedProduct

### Description
Produto encontrado pelo scraping, aguardando aprovação ou já processado.

### Fields

| Field | Type | Required | Default | Validation Rules |
|-------|------|----------|---------|------------------|
| id | UUID | Yes | auto-generated | Read-only |
| asin | String | Yes | - | Unique, Amazon Standard ID |
| title | String | Yes | - | Non-empty |
| currentPrice | Float | Yes | - | > 0 |
| originalPrice | Float | Yes | - | >= currentPrice |
| discountPercentage | Integer | Yes | - | Range 0-100 |
| imageUrl | String | Yes | - | Valid URL |
| productUrl | String | Yes | - | Valid URL |
| status | Enum | Yes | PENDING_APPROVAL | One of: PENDING_APPROVAL, APPROVED, REJECTED, POSTED |
| botId | UUID | No | null | Must exist in Bot table |
| foundAt | DateTime | Yes | now() | Read-only |
| expiresAt | DateTime | No | null | - |

### Relationships
- **bot** (N:1, optional): Produto pode pertencer a um bot

### State Transitions

```
┌───────────────────┐
│ PENDING_APPROVAL  │
└────────┬──────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐  ┌──────────┐
│APPROVED│  │ REJECTED │
└───┬────┘  └──────────┘
    │
    ▼ post()
┌────────┐
│ POSTED │
└────────┘
```

### Business Rules
- ASIN deve ser único (duplicatas são rejeitadas)
- Apenas produtos APPROVED podem ser postados
- Produtos expirados (expiresAt < now) podem ser filtrados na listagem

---

## 4. SystemSetting

### Description
Configuração global do sistema em formato chave-valor.

### Fields

| Field | Type | Required | Default | Validation Rules |
|-------|------|----------|---------|------------------|
| key | String | Yes | - | Primary key, unique, alphanumeric + underscore |
| value | String | Yes | - | Non-empty |

### Business Rules
- Key é o identificador primário (não há ID separado)
- Upsert: se key existe, atualiza; senão, cria
- Keys reservadas do sistema não podem ser excluídas

---

## DTOs Summary

### Bot DTOs

```typescript
// Create
interface CreateBotDto {
  name: string;           // required
  targetUrl: string;      // required, URL
  affiliateTag: string;   // required
  telegramToken: string;  // required
  chatId: string;         // required
  scheduleCron: string;   // required, cron format
  status?: BotStatus;     // optional, default ACTIVE
  proxyId?: string;       // optional, UUID
}

// Update
interface UpdateBotDto {
  name?: string;
  targetUrl?: string;
  affiliateTag?: string;
  telegramToken?: string;
  chatId?: string;
  scheduleCron?: string;
  status?: BotStatus;
  proxyId?: string | null;
}

// Query
interface BotQueryDto {
  page?: number;          // default 1
  limit?: number;         // default 10, max 100
  status?: BotStatus;     // filter by status
  search?: string;        // search in name
}
```

### Proxy DTOs

```typescript
// Create
interface CreateProxyDto {
  host: string;           // required
  port: number;           // required, 1-65535
  protocol?: ProxyProtocol; // optional, default HTTP
  username?: string;
  password?: string;
}

// Update
interface UpdateProxyDto {
  host?: string;
  port?: number;
  protocol?: ProxyProtocol;
  username?: string | null;
  password?: string | null;
}

// Query
interface ProxyQueryDto {
  page?: number;
  limit?: number;
  status?: string;        // ONLINE, OFFLINE
  protocol?: ProxyProtocol;
}
```

### Product DTOs

```typescript
// Query (primary - products are created by scraper)
interface ProductQueryDto {
  page?: number;
  limit?: number;
  status?: ProductStatus;
  botId?: string;
  minDiscount?: number;
  search?: string;        // search in title
}

// Status Update
interface UpdateProductStatusDto {
  status: ProductStatus;  // required
}

// Manual Create (admin)
interface CreateProductDto {
  asin: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  discountPercentage: number;
  imageUrl: string;
  productUrl: string;
  botId?: string;
  expiresAt?: Date;
}
```

### Setting DTOs

```typescript
// Create/Update (upsert)
interface UpsertSettingDto {
  key: string;            // required
  value: string;          // required
}

// Query
interface SettingQueryDto {
  search?: string;        // search in key
}
```

---

## Response Envelope

```typescript
// Single item
interface ApiResponse<T> {
  success: true;
  data: T;
}

// Paginated list
interface PaginatedResponse<T> {
  success: true;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
}

// Error
interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>; // validation errors by field
  }
}
```

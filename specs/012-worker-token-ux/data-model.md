# Data Model: Worker Token UX Improvements

**Feature Branch**: `012-worker-token-ux`  
**Created**: 2026-02-02

## Entities

### Worker (Existing - No Changes Required)

The Worker entity already contains token information. This feature does not require schema changes.

```prisma
model Worker {
  id            String    @id @default(uuid())
  name          String
  token         String    @unique @default(uuid())  // ← This is the auth token
  status        String    @default("offline")
  lastHeartbeat DateTime?
  networkInfo   Json?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  tasks         Task[]
}
```

**Token Lifecycle**:
1. **Creation**: Generated when worker is registered (`uuid()` default)
2. **Usage**: Worker uses token to authenticate WebSocket connection
3. **Regeneration**: New UUID replaces old, old becomes invalid immediately

### Token States (Conceptual)

| State | Description |
|-------|-------------|
| **Active** | Current valid token, can authenticate connections |
| **Invalidated** | Previous token after regeneration, rejected on use |

## Field Validation Rules

| Entity | Field | Rule |
|--------|-------|------|
| Worker | token | UUID v4 format, unique, auto-generated |
| Worker | name | Required, 1-100 characters |

## State Transitions

### Worker Token Regeneration Flow

```
                   ┌─────────────────────┐
                   │  Token: ABC123      │
                   │  Status: Active     │
                   └──────────┬──────────┘
                              │
                   [User requests regeneration]
                              │
                              ▼
                   ┌─────────────────────┐
                   │  Token: XYZ789      │
                   │  Status: Active     │
                   └──────────┬──────────┘
                              │
                   [Old token ABC123 now invalid]
                              │
                              ▼
          Any connection attempt with ABC123 → AUTH_ERROR
```

## API Response Shapes

### Worker Registration Response (Existing)

```typescript
interface RegisterWorkerResponse {
  id: string;
  name: string;
  token: string;  // Shown once in TokenModal
  createdAt: string;
}
```

### Token Regeneration Response (New)

```typescript
interface RegenerateTokenResponse {
  token: string;          // New token
  regeneratedAt: string;  // ISO timestamp
}
```

### Worker List Item (Modified)

```typescript
interface WorkerListItem {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'working';
  lastHeartbeat: string | null;
  networkInfo: {
    externalIp: string | null;
    ispName: string | null;
  } | null;
  // Note: token is NOT included in list response for security
  // Token is only returned on registration or regeneration
}
```

## Security Considerations

1. **Token Storage**: Tokens are stored as plain UUIDs in database (acceptable for internal worker auth)
2. **Token Exposure**: Token only returned in:
   - Registration response (once)
   - Regeneration response (once)
   - GET `/workers/:id/token` endpoint (authorized owner only)
3. **Token Visibility**: Never included in worker list responses

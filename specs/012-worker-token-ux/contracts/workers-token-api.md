# API Contracts: Worker Token Management

**Feature Branch**: `012-worker-token-ux`  
**Version**: 1.0.0
**Base Path**: `/api/workers`

## Endpoints

### POST /workers/:id/regenerate-token

Regenerates the authentication token for an existing worker. The old token is immediately invalidated.

**Authorization**: Required (JWT Bearer token)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | Worker ID |

**Request Body**: None

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "token": "550e8400-e29b-41d4-a716-446655440000",
    "regeneratedAt": "2026-02-02T12:00:00.000Z"
  }
}
```

**Error Responses**:

| Status | Code | Description |
|--------|------|-------------|
| 401 | UNAUTHORIZED | Missing or invalid JWT |
| 403 | FORBIDDEN | Not the owner of this worker |
| 404 | NOT_FOUND | Worker ID does not exist |
| 500 | INTERNAL_ERROR | Token generation failed |

**Example Error Response (404)**:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Worker not found"
  }
}
```

---

### GET /workers/:id/token

Retrieves the current token for an existing worker. Use sparingly - prefer regeneration for lost tokens.

**Authorization**: Required (JWT Bearer token)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | Worker ID |

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "token": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Error Responses**:

| Status | Code | Description |
|--------|------|-------------|
| 401 | UNAUTHORIZED | Missing or invalid JWT |
| 403 | FORBIDDEN | Not the owner of this worker |
| 404 | NOT_FOUND | Worker ID does not exist |

---

## Existing Endpoints (Reference)

### POST /workers (Existing - No Changes)

Registers a new worker. Returns token in response.

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Home PC",
    "token": "b47ac10b-58cc-4372-a567-0e02b2c3d479",
    "createdAt": "2026-02-02T12:00:00.000Z"
  }
}
```

### GET /workers (Existing - No Changes)

Lists all workers. **Does NOT include tokens** for security.

---

## TypeScript Types

```typescript
// Request/Response DTOs

export interface RegenerateTokenResponseDto {
  token: string;
  regeneratedAt: string;  // ISO 8601
}

export interface GetTokenResponseDto {
  token: string;
}

// Standard API envelope
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

## Notes

1. **Token Format**: All tokens are UUID v4 strings
2. **Rate Limiting**: Consider adding rate limit to regeneration endpoint (e.g., 5/hour)
3. **Audit Trail**: Consider logging token regeneration events for security auditing

# Socket.IO Event Contracts

## Worker -> Backend

### `register_worker`
**Payload**:
```json
{
  "token": "string",
  "version": "string"
}
```
**Ack**: `boolean` (success/fail)

### `job_success`
**Payload**:
```json
{
  "jobId": "uuid",
  "data": { ... },
  "metadata": { "duration": number }
}
```

### `job_failure`
**Payload**:
```json
{
  "jobId": "uuid",
  "error": "Error message",
  "stack": "Stack trace (optional)"
}
```

## Backend -> Worker

### `job_request`
**Payload**:
```json
{
  "id": "uuid",
  "url": "https://example.com/product",
  "scrapers": {
    "title": "#productTitle",
    "price": ".a-price-whole"
  }
}
```

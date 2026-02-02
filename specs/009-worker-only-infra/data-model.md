# Data Model Changes - Worker-Only Infrastructure

## Removed Models
- **Proxy**: Entire model removed.
- **ProxyProtocol**: Entire enum removed.

## Modified Models

### Bot
- **Removed Fields**:
    - `proxyId`: `String?`
    - `proxy`: `Proxy?`

### ScrapingTask
- **Note**: Ensure no legacy proxy-related fields exist (none found in current schema).

## Migrations
- **remove_proxy_table**:
    - `DROP TABLE "Proxy" CASCADE;`
    - `ALTER TABLE "Bot" DROP COLUMN "proxyId";`
    - `DROP TYPE "ProxyProtocol";`

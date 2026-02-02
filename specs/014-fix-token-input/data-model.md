# Data Model: Fix Token Input

**Feature**: Fix Worker Token Input
**Status**: N/A (UI only)

No changes to the data model are required. The current `WorkerConfig` interface is sufficient.

```typescript
type WorkerConfig = {
    serverUrl: string;
    workerToken: string;
    workerName: string;
    autoStart: boolean;
    minimizeToTray: boolean;
};
```

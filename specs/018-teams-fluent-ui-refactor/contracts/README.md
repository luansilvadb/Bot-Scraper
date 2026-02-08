# API Contracts

**Feature**: Refatoração de Interface com Fluent UI para Microsoft Teams  
**Branch**: `018-teams-fluent-ui-refactor`  
**Date**: 2026-02-08

---

## Status: No API Contracts Required

This is a **frontend-only UI refactor** with no changes to backend APIs, database models, or data contracts.

### Why No Contracts?

- **No new API endpoints** - All existing backend APIs remain unchanged
- **No data model changes** - No modifications to request/response schemas
- **UI-only changes** - Component refactoring, theming, and layout restructuring
- **Backward compatible** - No breaking changes to existing functionality

### What Changed?

Only React component props and TypeScript interfaces - documented in [data-model.md](../data-model.md).

### Existing APIs (Unchanged)

The application continues to use existing API contracts for:
- User management
- Bot configuration  
- Worker management
- Settings/preferences

### Local Storage Only

New localStorage keys added (not API contracts):
- `theme-preference`: User's theme mode preference (light/dark/auto)

---

**Note**: If future phases require API changes, contracts will be documented here following OpenAPI 3.0 specification.

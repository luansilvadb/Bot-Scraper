# Data Model: Teams-Style UI Refactor

**Feature**: Refatoração de Interface com Fluent UI para Microsoft Teams  
**Branch**: `018-teams-fluent-ui-refactor`  
**Date**: 2026-02-08  
**Spec**: [spec.md](../spec.md)  
**Plan**: [plan.md](../plan.md)  
**Research**: [research.md](../research.md)

---

## Summary

This feature is a **UI-only refactor** with no changes to data models, database schema, or API contracts. The implementation focuses exclusively on:

1. Visual layer refactoring (HTML → Fluent UI components)
2. Layout restructuring (current sidebar → Teams 3-column layout)
3. Theming system enhancement (light/dark/auto modes)
4. Component standardization (native elements → Fluent UI)

---

## Data Model Impact

### No Changes Required

| Entity | Current State | Change Required |
|--------|---------------|-----------------|
| User | Existing | None - UI display only |
| Bot | Existing | None - UI display only |
| Worker | Existing | None - UI display only |
| Settings | Existing | None - UI display only |
| Theme Preference | New localStorage key | Add `theme-preference` storage |

### New State (UI-Only)

```typescript
// Theme state (client-side only)
interface ThemeState {
  mode: 'light' | 'dark' | 'auto';
  resolvedTheme: 'light' | 'dark'; // actual applied theme
}

// Stored in localStorage: 'theme-preference'
// Example: { "mode": "auto" }
```

---

## Component Props Interfaces

While there are no data model changes, new React components will have the following prop interfaces:

### AppShell Props

```typescript
interface AppShellProps {
  children: React.ReactNode;
}
```

### AppBar Props

```typescript
interface AppBarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  items: NavigationItem[];
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType;
  to: string;
  badge?: number;
  description?: string;
}
```

### ListPane Props

```typescript
interface ListPaneProps {
  title: string;
  items: ListItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
  emptyMessage?: string;
}

interface ListItem {
  id: string;
  primaryText: string;
  secondaryText?: string;
  avatarUrl?: string;
  presence?: 'available' | 'away' | 'busy' | 'offline' | 'dnd';
  timestamp?: Date;
  unreadCount?: number;
}
```

### UserPersona Props

```typescript
interface UserPersonaProps {
  name: string;
  email?: string;
  avatarUrl?: string;
  presence?: 'available' | 'away' | 'busy' | 'offline' | 'dnd';
  size?: 'small' | 'medium' | 'large';
  showPresence?: boolean;
}
```

---

## Database Schema Changes

**None.**

---

## API Changes

**None.**

This is a frontend-only refactor. All existing API contracts remain unchanged.

---

## Local Storage Keys

| Key | Type | Purpose |
|-----|------|---------|
| `theme-preference` | `{"mode": "light" \| "dark" \| "auto"}` | User's theme preference |
| `sidebar-collapsed` | `boolean` | Sidebar collapsed state (existing) |

---

## Migration Notes

### No Migration Required

Since this is a UI refactor:
- No database migrations needed
- No API version changes
- No data transformations
- Backward compatible (purely additive UI changes)

### Rollback Strategy

If needed, the refactor can be rolled back by:
1. Reverting the `AppShell.tsx` component to previous version
2. Removing new component files
3. Restoring original theme context

---

**Status**: ✅ Complete - No data model changes required  
**Impact**: Zero backend/API changes

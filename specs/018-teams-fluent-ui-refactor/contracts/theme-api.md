# Theme API Contract

**Feature**: Refatoração de Interface com Fluent UI para Microsoft Teams  
**Branch**: `018-teams-fluent-ui-refactor`  
**Date**: 2026-02-08  
**Type**: React Context API

---

## Overview

This document defines the contract for the Theme Context API used to manage light/dark theme switching in the application.

---

## Context Interface

### ThemeContextType

```typescript
interface ThemeContextType {
  // Current theme mode (user's preference)
  mode: ThemeMode;
  
  // Resolved theme (actual applied theme, resolves 'auto' to light/dark)
  resolvedTheme: 'light' | 'dark';
  
  // Set theme mode
  setMode: (mode: ThemeMode) => void;
  
  // Toggle between light and dark (ignores auto)
  toggleTheme: () => void;
}

type ThemeMode = 'light' | 'dark' | 'auto';
```

---

## Hook Interface

### useTheme Hook

```typescript
function useTheme(): ThemeContextType;
```

**Usage**:
```typescript
const { mode, resolvedTheme, setMode, toggleTheme } = useTheme();
```

---

## Provider Interface

### ThemeProvider Component

```typescript
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode; // default: 'auto'
}

function ThemeProvider({ children, defaultMode = 'auto' }: ThemeProviderProps): JSX.Element;
```

**Usage**:
```typescript
<ThemeProvider defaultMode="auto">
  <App />
</ThemeProvider>
```

---

## Storage Contract

### localStorage

**Key**: `theme-preference`

**Schema**:
```typescript
interface ThemePreference {
  mode: ThemeMode;
}
```

**Example**:
```json
{
  "mode": "dark"
}
```

---

## System Integration

### System Preference Detection

The context automatically detects system color scheme preference using:

```typescript
window.matchMedia('(prefers-color-scheme: dark)')
```

When `mode` is set to `'auto'`, the resolved theme follows the system preference.

### CSS Custom Properties

The FluentProvider applies theme tokens as CSS custom properties:

```css
:root {
  --colorNeutralBackground1: #ffffff;
  --colorBrandBackground: #6264A7;
  /* ... other tokens */
}

[data-theme="dark"] {
  --colorNeutralBackground1: #292929;
  --colorBrandBackground: #6264A7;
  /* ... dark tokens */
}
```

---

## Events

### Theme Change Event

When theme changes, the context updates and triggers re-render. No custom events are fired.

---

## Error Handling

### Invalid Theme Mode

If an invalid theme mode is passed to `setMode()`, it defaults to `'auto'`.

### Storage Errors

If localStorage is unavailable (private browsing), theme preference is maintained in memory only for the session.

---

## Example Usage

### Basic Usage

```typescript
import { useTheme } from '../context/ThemeContext';

function ThemeToggle() {
  const { mode, resolvedTheme, toggleTheme } = useTheme();
  
  return (
    <Button onClick={toggleTheme}>
      {resolvedTheme === 'dark' ? '🌙' : '☀️'} Toggle Theme
    </Button>
  );
}
```

### Mode Selector

```typescript
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { Dropdown } from '@fluentui/react-components';

function ThemeSelector() {
  const { mode, setMode } = useTheme();
  
  const options: { value: ThemeMode; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'auto', label: 'Auto (System)' },
  ];
  
  return (
    <Dropdown
      value={mode}
      onOptionSelect={(_, data) => setMode(data.optionValue as ThemeMode)}
      options={options.map(opt => ({ value: opt.value, children: opt.label }))}
    />
  );
}
```

### Conditional Rendering

```typescript
function ThemedComponent() {
  const { resolvedTheme } = useTheme();
  
  return (
    <div className={resolvedTheme === 'dark' ? 'dark-mode' : 'light-mode'}>
      Content adapts to theme
    </div>
  );
}
```

---

## Migration from Existing Theme System

### Current Implementation

The existing `ThemeContext.tsx` provides basic light/dark toggle without 'auto' mode.

### Migration Steps

1. **Add 'auto' mode support**:
   - Extend ThemeMode type to include 'auto'
   - Add system preference detection
   - Update resolvedTheme logic

2. **Update localStorage key**:
   - Current: `theme`
   - New: `theme-preference`
   - Add migration logic to read old key if new key doesn't exist

3. **Preserve backward compatibility**:
   - Keep existing `toggleTheme()` function
   - Add new `setMode()` function
   - Mark old context exports as deprecated

---

## Testing Contract

### Unit Tests

```typescript
describe('ThemeContext', () => {
  it('should default to auto mode', () => {
    // Test default mode
  });
  
  it('should persist mode to localStorage', () => {
    // Test persistence
  });
  
  it('should resolve auto mode based on system preference', () => {
    // Test system detection
  });
  
  it('should toggle between light and dark', () => {
    // Test toggle
  });
});
```

---

**Version**: 1.0.0  
**Status**: ✅ Contract Defined

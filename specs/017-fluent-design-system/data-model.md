# Data Model: Fluent Design System

**Feature**: [017-fluent-design-system](../spec.md)

## Client-Side State

### ThemeContext

Global state for managing the visual theme of the application.

| Property | Type | Description |
|----------|------|-------------|
| `theme` | `'light' \| 'dark'` | Current active theme. Default: 'light' (or system preference). |
| `toggleTheme` | `() => void` | Function to switch between light and dark modes. |

### Persistence

- **Storage**: `localStorage`
- **Key**: `theme-preference`
- **Value**: `'light' | 'dark'`

## Configuration Entities

### DesignTokens (CSS Mappings)

Mapping between abstract design concepts and the concrete CSS variables provided.

*Defined in `src/styles/theme.ts` (or similar)*

| Token Group | CSS Variable | Fluent Token Mapping (Approx) |
|-------------|--------------|-------------------------------|
| Primary | `--primary` | `colorBrandBackground` |
| Background | `--background` | `colorNeutralBackground1` |
| Foreground | `--foreground` | `colorNeutralForeground1` |
| Card | `--card` | `colorNeutralBackground2` |
| Radius | `--radius` | `borderRadiusMedium` |

*Note: The exact mapping list will be implemented in code based on the full Fluent UI token slot list.*

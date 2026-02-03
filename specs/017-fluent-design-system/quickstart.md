# Quickstart: Using the New Design System

## Overview

The application now uses a unified Design System powered by CSS Variables and synchronized with Fluent UI v9.

## Theme Architecture

1.  **CSS Variables**: Defined in `src/index.css`. These are the "Source of Truth".
2.  **Fluent Theme**: Mapped in `src/theme/mappings.ts` (or similar). This tells Fluent UI components to use the CSS variables.
3.  **Theme Context**: Handles the switching logic.

## How to Styles

### 1. Using Standard HTML/CSS

Just use the CSS variables directly:

```css
.my-custom-box {
  background-color: var(--card);
  border-radius: var(--radius);
  color: var(--foreground);
  box-shadow: var(--shadow-md);
}
```

### 2. Using Fluent UI Components

Fluent components automatically pick up the theme.

```tsx
import { Button, Card } from '@fluentui/react-components';

export const MyComponent = () => (
  <Card>
    <Button appearance="primary">I am Blue!</Button>
  </Card>
);
```

### 3. Toggling the Theme

Use the `useTheme` hook:

```tsx
import { useTheme } from './hooks/useTheme';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    
    return (
        <button onClick={toggleTheme}>
            Current: {theme}
        </button>
    );
};
```

## Adding New Tokens

1.  Add the variable into `src/index.css` inside `:root` and `.dark`.
2.  If it needs to affect Fluent components, update the mapping in the theme configuration file.

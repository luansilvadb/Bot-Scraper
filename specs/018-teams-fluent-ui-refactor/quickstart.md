# Quickstart Guide: Teams-Style UI Refactor

**Feature**: Refatoração de Interface com Fluent UI para Microsoft Teams  
**Branch**: `018-teams-fluent-ui-refactor`  
**Date**: 2026-02-08

---

## Prerequisites

- Node.js 20+ (check with `node --version`)
- npm 10+ (check with `npm --version`)
- Git (on branch `018-teams-fluent-ui-refactor`)

---

## Environment Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Verify Fluent UI Installation

Fluent UI v9 should already be installed:

```bash
npm list @fluentui/react-components
# Should show: @fluentui/react-components@^9.72.11
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## Component Architecture

### New Layout Structure

```
App.tsx
└── ThemeProvider (refactored)
    └── FluentProvider
        └── AppShell (refactored)
            ├── AppBar (NEW)
            │   ├── NavigationItem[]
            │   └── UserSection
            ├── ListPane (NEW)
            │   └── ChannelListItem[]
            └── MainStage (NEW)
                ├── Header
                └── Outlet (feature content)
```

### Key Components to Implement

| Component | Path | Status |
|-----------|------|--------|
| AppShell | `components/layout/AppShell.tsx` | Refactor |
| AppBar | `components/layout/AppBar.tsx` | New |
| ListPane | `components/layout/ListPane.tsx` | New |
| MainStage | `components/layout/MainStage.tsx` | New |
| NavigationItem | `components/layout/NavigationItem.tsx` | New |
| UserPersona | `components/ui/UserPersona.tsx` | New |
| ChannelListItem | `components/ui/ChannelListItem.tsx` | New |
| ThemeProvider | `context/ThemeContext.tsx` | Refactor |

---

## Development Workflow

### 1. Run Tests in Watch Mode

```bash
npm run test -- --watch
```

### 2. Run Linter

```bash
npm run lint
```

### 3. Fix Linting Issues

```bash
npm run lint -- --fix
```

### 4. Type Check

```bash
npx tsc --noEmit
```

---

## Common Tasks

### Adding a New Navigation Item

1. Open `AppShell.tsx`
2. Add to `navSections` array:

```typescript
{
  title: 'My Section',
  items: [
    {
      label: 'My Page',
      icon: bundleIcon(MyIconFilled, MyIconRegular),
      to: '/my-page',
      description: 'Description for tooltip',
    },
  ],
}
```

3. Add route in `App.tsx`:

```typescript
<Route path="my-page" element={<MyPage />} />
```

### Creating a New Fluent UI Component

Template for new components:

```typescript
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    // Use Fluent tokens
    padding: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground1,
  },
});

interface MyComponentProps {
  // Props here
}

export const MyComponent: React.FC<MyComponentProps> = (props) => {
  const styles = useStyles();
  
  return (
    <div className={styles.root}>
      {/* Component JSX */}
    </div>
  );
};
```

### Using the Theme Hook

```typescript
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { resolvedTheme, toggleTheme } = useTheme();
  
  return (
    <Button onClick={toggleTheme}>
      Current: {resolvedTheme}
    </Button>
  );
}
```

---

## Testing Components

### Unit Test Template

```typescript
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../context/ThemeContext';
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';
import { MyComponent } from './MyComponent';

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <ThemeProvider>
      <FluentProvider theme={teamsLightTheme}>
        {component}
      </FluentProvider>
    </ThemeProvider>
  );
};

describe('MyComponent', () => {
  it('renders correctly', () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

---

## Fluent UI Resources

### Essential Imports

```typescript
// Components
import {
  Button,
  Input,
  Avatar,
  PresenceBadge,
  makeStyles,
  tokens,
  FluentProvider,
  teamsLightTheme,
  teamsDarkTheme,
} from '@fluentui/react-components';

// Icons
import { bundleIcon } from '@fluentui/react-icons';
```

### Useful Tokens

| Token | Purpose |
|-------|---------|
| `tokens.colorBrandBackground` | Primary brand color (Teams Purple) |
| `tokens.colorNeutralBackground1` | Main background |
| `tokens.colorNeutralForeground1` | Primary text |
| `tokens.spacingHorizontalM` | Standard horizontal spacing (16px) |
| `tokens.borderRadiusMedium` | Standard border radius |

---

## Debugging

### Common Issues

**Issue**: Styles not applying  
**Solution**: Ensure component is wrapped in `FluentProvider`

**Issue**: Icons not showing  
**Solution**: Use `bundleIcon(FilledIcon, RegularIcon)` pattern

**Issue**: Theme not switching  
**Solution**: Check `ThemeProvider` is at the root, verify localStorage

---

## Build for Production

```bash
npm run build
```

Output will be in `frontend/dist/`

---

## Success Criteria Checklist

Before marking feature complete, verify:

- [ ] All UI components use Fluent UI (SC-002)
- [ ] 3-column layout matches Teams design (SC-001)
- [ ] Light/dark themes work correctly
- [ ] Keyboard navigation works (SC-003)
- [ ] Zero ESLint warnings (SC-006)
- [ ] 80%+ test coverage
- [ ] Responsive at all breakpoints (SC-007)
- [ ] Bundle size increase < 100KB

---

**Need Help?** Refer to:
- [spec.md](../spec.md) - Full requirements
- [research.md](../research.md) - Technical decisions
- [Fluent UI Docs](https://react.fluentui.dev/)

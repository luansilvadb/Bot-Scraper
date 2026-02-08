# Component API Contracts

**Date**: 2026-02-08  
**Feature**: Teams Fluent UI Interface Refactor  
**Purpose**: Public API contracts for new and refactored React components

---

## Overview

These contracts define the public interfaces (props) for all components created or modified during the Teams Fluent UI refactor. Each component follows the Fluent UI v9 patterns while providing app-specific defaults and extensions.

---

## Layout Components

### AppShell

**File**: `frontend/src/components/layout/AppShell.tsx`

**Purpose**: Main application layout container implementing the Teams 3-column structure.

```typescript
interface AppShellProps {
  /** Child content rendered in the main stage */
  children: React.ReactNode;
  
  /** Optional CSS class for styling overrides */
  className?: string;
  
  /** Data attribute for testing */
  'data-testid'?: string;
}

// Usage Example
<AppShell>
  <DashboardPage />
</AppShell>
```

**Behavior**:
- Renders 3-column layout: AppBar, ListPane, MainStage
- Handles responsive breakpoint detection
- Manages theme context integration
- Provides consistent spacing and background

---

### AppBar

**File**: `frontend/src/components/layout/AppBar.tsx`

**Purpose**: Left navigation rail with icons and labels.

```typescript
interface AppBarProps {
  /** Navigation items to display */
  items: NavigationItem[];
  
  /** Currently active item ID (for highlighting) */
  activeItemId: string;
  
  /** Called when user clicks a navigation item */
  onItemSelect: (itemId: string) => void;
  
  /** Whether sidebar is in collapsed (icons-only) mode */
  isCollapsed?: boolean;
  
  /** Current user displayed at bottom (optional) */
  currentUser?: User;
  
  /** Called when user clicks their profile */
  onProfileClick?: () => void;
  
  /** Custom CSS class */
  className?: string;
}

interface NavigationItem {
  /** Unique identifier */
  id: string;
  
  /** Display label */
  label: string;
  
  /** Icon component from @fluentui/react-icons */
  icon: React.ComponentType<{ className?: string }>;
  
  /** Icon shown when item is active (optional, defaults to icon) */
  activeIcon?: React.ComponentType<{ className?: string }>;
  
  /** React Router route path */
  to: string;
  
  /** Optional notification badge count */
  badge?: number;
  
  /** Tooltip text */
  description?: string;
  
  /** Whether item is disabled */
  disabled?: boolean;
}

// Usage Example
<AppBar
  items={[
    { id: 'dashboard', label: 'Dashboard', icon: HomeRegular, activeIcon: HomeFilled, to: '/' },
    { id: 'bots', label: 'Bots', icon: BotRegular, activeIcon: BotFilled, to: '/bots', badge: 3 },
  ]}
  activeItemId="dashboard"
  onItemSelect={handleNavigation}
  isCollapsed={isMobile}
  currentUser={currentUser}
  onProfileClick={openProfile}
/>
```

**Behavior**:
- Highlights active item with Teams Purple background
- Shows badge counts with red indicator
- Collapses to icons-only on mobile/tablet
- Displays user profile at bottom when provided

---

### ListPane

**File**: `frontend/src/components/layout/ListPane.tsx`

**Purpose**: Center column displaying channels, contacts, or list items.

```typescript
interface ListPaneProps {
  /** Title displayed at top of pane */
  title: string;
  
  /** Items to display in the list */
  items: ListItem[];
  
  /** ID of currently selected item (for highlighting) */
  selectedId?: string;
  
  /** Called when user selects an item */
  onSelect: (id: string) => void;
  
  /** Search query value */
  searchQuery?: string;
  
  /** Called when search input changes */
  onSearchChange?: (query: string) => void;
  
  /** Message shown when list is empty */
  emptyMessage?: string;
  
  /** Enable virtualization for large lists (default: true when >100 items) */
  virtualize?: boolean;
  
  /** Custom CSS class */
  className?: string;
}

interface ListItem {
  /** Unique identifier */
  id: string;
  
  /** Primary text (name/title) */
  primaryText: string;
  
  /** Secondary text (subtitle/description) */
  secondaryText?: string;
  
  /** Avatar image URL */
  avatarUrl?: string;
  
  /** User presence status */
  presence?: 'available' | 'away' | 'busy' | 'offline' | 'dnd';
  
  /** Last activity timestamp */
  timestamp?: Date;
  
  /** Unread message count */
  unreadCount?: number;
  
  /** Whether item is pinned to top */
  isPinned?: boolean;
}

// Usage Example
<ListPane
  title="Channels"
  items={channels}
  selectedId={selectedChannelId}
  onSelect={setSelectedChannel}
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  emptyMessage="No channels found"
  virtualize={channels.length > 100}
/>
```

**Behavior**:
- Renders searchable list with Persona components
- Highlights selected item
- Shows presence badges and unread counts
- Virtualizes rendering for large lists
- Sticky header with search input

---

### MainStage

**File**: `frontend/src/components/layout/MainStage.tsx`

**Purpose**: Right content area with header and scrollable content.

```typescript
interface MainStageProps {
  /** Header title */
  title?: string;
  
  /** Header subtitle or breadcrumb */
  subtitle?: string;
  
  /** Actions displayed in header (buttons, menus) */
  headerActions?: React.ReactNode;
  
  /** Main content (scrollable) */
  children: React.ReactNode;
  
  /** Loading state */
  isLoading?: boolean;
  
  /** Message shown during loading */
  loadingMessage?: string;
  
  /** Custom CSS class */
  className?: string;
}

// Usage Example
<MainStage
  title="Dashboard"
  subtitle="Overview"
  headerActions={
    <>
      <Button>Export</Button>
      <Button appearance="primary">Create</Button>
    </>
  }
  isLoading={isLoading}
  loadingMessage="Loading dashboard..."
>
  <DashboardContent />
</MainStage>
```

**Behavior**:
- Fixed header with title and actions
- Scrollable content area
- Loading state with spinner
- Responsive padding

---

## Common Components (Fluent UI Wrappers)

### FluentButton

**File**: `frontend/src/components/common/FluentButton.tsx`

**Purpose**: Wrapper around Fluent UI Button with app defaults.

```typescript
import { ButtonProps } from '@fluentui/react-components';

interface FluentButtonProps extends ButtonProps {
  /** Show loading spinner and disable button */
  isLoading?: boolean;
  
  /** Text shown during loading (default: "Loading...") */
  loadingText?: string;
  
  /** Icon name from @fluentui/react-icons */
  icon?: string;
  
  /** Icon position relative to text */
  iconPosition?: 'before' | 'after';
}

// Usage Example
<FluentButton
  appearance="primary"
  onClick={handleClick}
  icon="AddRegular"
  iconPosition="before"
>
  Create New
</FluentButton>

<FluentButton
  isLoading={isSubmitting}
  loadingText="Saving..."
  disabled={!isValid}
>
  Save
</FluentButton>
```

**Default Props**:
- `size`: 'medium'
- `appearance`: 'secondary'

---

### FluentInput

**File**: `frontend/src/components/common/FluentInput.tsx`

**Purpose**: Wrapper around Fluent UI Input with validation support.

```typescript
import { InputProps } from '@fluentui/react-components';

interface FluentInputProps extends InputProps {
  /** Validation error message */
  errorMessage?: string;
  
  /** Mark as required field */
  required?: boolean;
  
  /** Helper text displayed below input */
  helperText?: string;
  
  /** Show clear button */
  showClearButton?: boolean;
  
  /** Called when clear button clicked */
  onClear?: () => void;
}

// Usage Example
<FluentInput
  placeholder="Search..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  showClearButton
  onClear={() => setSearchQuery('')}
  helperText="Search by name or email"
/>

<FluentInput
  label="Email"
  type="email"
  value={email}
  onChange={handleEmailChange}
  required
  errorMessage={errors.email}
/>
```

---

### FluentPersona

**File**: `frontend/src/components/common/FluentPersona.tsx`

**Purpose**: User display component using Fluent UI Persona.

```typescript
import { PersonaProps } from '@fluentui/react-components';

interface FluentPersonaProps {
  /** User to display */
  user: User;
  
  /** Avatar size variant */
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'huge';
  
  /** Show presence badge */
  showPresence?: boolean;
  
  /** Override secondary text */
  secondaryText?: string;
  
  /** Override tertiary text */
  tertiaryText?: string;
  
  /** Custom CSS class */
  className?: string;
}

interface User {
  id: string;
  name: string;
  email?: string;
  role?: string;
  photoUrl?: string;
  presence?: 'available' | 'away' | 'busy' | 'offline' | 'dnd';
}

// Usage Example
<FluentPersona
  user={currentUser}
  size="medium"
  showPresence
/>

<FluentPersona
  user={contact}
  size="small"
  showPresence={false}
  secondaryText={contact.statusMessage}
/>
```

**Behavior**:
- Displays avatar with fallback to initials
- Shows presence badge when enabled
- Uses deterministic color for avatar fallback
- Formats secondary text from email or role

---

### FluentAvatar

**File**: `frontend/src/components/common/FluentAvatar.tsx`

**Purpose**: Avatar component with Teams-style fallback.

```typescript
import { AvatarProps } from '@fluentui/react-components';

interface FluentAvatarProps {
  /** User to display */
  user: User;
  
  /** Avatar size */
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'huge';
  
  /** Show presence badge */
  showPresence?: boolean;
  
  /** Custom initials (auto-generated if not provided) */
  initials?: string;
  
  /** Use deterministic color for fallback */
  useDeterministicColor?: boolean;
  
  /** Custom CSS class */
  className?: string;
}

// Usage Example
<FluentAvatar
  user={user}
  size="medium"
  showPresence
  useDeterministicColor
/>
```

**Behavior**:
- Generates initials from user.name (e.g., "John Doe" → "JD")
- Uses deterministic color based on user ID when photo unavailable
- Displays PresenceBadge when showPresence=true

---

## Theme Components

### ThemeProvider

**File**: `frontend/src/context/ThemeContext.tsx`

**Purpose**: Provides theme state and Fluent UI theme to the application.

```typescript
interface ThemeProviderProps {
  /** Child components */
  children: React.ReactNode;
  
  /** Default theme mode */
  defaultMode?: 'light' | 'dark' | 'auto';
}

interface ThemeContextValue {
  /** Current theme mode setting */
  mode: 'light' | 'dark' | 'auto';
  
  /** Whether dark theme is currently applied */
  isDark: boolean;
  
  /** Set theme mode */
  setMode: (mode: 'light' | 'dark' | 'auto') => void;
  
  /** Toggle between light/dark */
  toggleTheme: () => void;
}

// Hook Usage
const { mode, isDark, setMode, toggleTheme } = useTheme();
```

**Behavior**:
- Persists preference to localStorage
- Detects system preference in 'auto' mode
- Wraps app in FluentProvider with correct theme
- Updates theme without page reload

---

### ThemeToggle

**File**: `frontend/src/components/ThemeToggle.tsx`

**Purpose**: Button to toggle between light and dark themes.

```typescript
interface ThemeToggleProps {
  /** Button size variant */
  size?: 'small' | 'medium' | 'large';
  
  /** Show label text alongside icon */
  showLabel?: boolean;
  
  /** Custom CSS class */
  className?: string;
}

// Usage Example
<ThemeToggle size="medium" showLabel={false} />
```

**Behavior**:
- Shows sun icon in light mode, moon icon in dark mode
- Calls toggleTheme() from context
- Has aria-label for accessibility

---

## Hooks

### useResponsive

**File**: `frontend/src/hooks/useResponsive.ts`

**Purpose**: Detect current breakpoint and responsive state.

```typescript
interface ResponsiveState {
  /** Current breakpoint */
  breakpoint: 'mobile' | 'tablet' | 'desktop';
  
  /** True if viewport < 768px */
  isMobile: boolean;
  
  /** True if viewport 768px-1023px */
  isTablet: boolean;
  
  /** True if viewport ≥ 1024px */
  isDesktop: boolean;
  
  /** Current viewport width */
  width: number;
}

// Usage
const { isMobile, isDesktop, breakpoint } = useResponsive();
```

**Behavior**:
- Uses matchMedia for efficient breakpoint detection
- Debounces resize events (100ms)
- Returns current width for custom logic

---

### useTheme

**File**: `frontend/src/context/ThemeContext.tsx`

**Purpose**: Access theme state and controls.

```typescript
function useTheme(): ThemeContextValue;

// Returns
{
  mode: 'light' | 'dark' | 'auto',
  isDark: boolean,
  setMode: (mode) => void,
  toggleTheme: () => void
}
```

---

## Type Definitions

### Shared Types

```typescript
/** Theme modes */
type ThemeMode = 'light' | 'dark' | 'auto';

/** User presence states */
type PresenceState = 'available' | 'away' | 'busy' | 'offline' | 'dnd' | 'unknown';

/** Avatar sizes */
type AvatarSize = 'tiny' | 'small' | 'medium' | 'large' | 'huge';

/** Breakpoint names */
type Breakpoint = 'mobile' | 'tablet' | 'desktop';

/** Channel types */
type ChannelType = 'channel' | 'direct' | 'group';
```

---

## Testing Contracts

### Component Test Requirements

Each component MUST have tests verifying:

1. **Rendering**: Component renders without errors
2. **Props**: All props work as documented
3. **Events**: Event handlers are called correctly
4. **Accessibility**: ARIA attributes and keyboard navigation
5. **Snapshot**: Visual regression protection (optional)

### Example Test Pattern

```typescript
describe('FluentButton', () => {
  it('renders with children', () => {
    render(<FluentButton>Click me</FluentButton>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<FluentButton onClick={handleClick}>Click</FluentButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<FluentButton isLoading>Save</FluentButton>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('is accessible', () => {
    render(<FluentButton aria-label="Submit">Submit</FluentButton>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Submit');
  });
});
```

---

## Breaking Changes

### None

This refactor maintains backward compatibility:
- All new components are additive
- Existing component props remain unchanged
- URLs and routes unchanged
- No API changes

---

**Version**: 1.0.0  
**Status**: Complete  
**Last Updated**: 2026-02-08

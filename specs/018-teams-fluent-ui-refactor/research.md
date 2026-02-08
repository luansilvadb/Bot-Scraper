# Research Document: Teams-Style UI Refactor with Fluent UI v9

**Feature**: Refatoração de Interface com Fluent UI para Microsoft Teams  
**Branch**: `018-teams-fluent-ui-refactor`  
**Date**: 2026-02-08  
**Spec**: [spec.md](../spec.md)  
**Plan**: [plan.md](../plan.md)

---

## Research Summary

This document consolidates all research findings for implementing a Microsoft Teams-like interface using Fluent UI v9. All clarifications from the feature specification have been resolved.

---

## Clarifications Resolved

### Q1: Fluent UI Version Selection (Critical)

**Question**: Should we use Fluent UI v8 or v9?

**Answer**: **Fluent UI v9** exclusively

**Rationale**:
- Modern theming system with proper TypeScript support
- Built-in Teams themes (`teamsLightTheme`, `teamsDarkTheme`)
- Better tree-shaking and bundle optimization
- Newer component APIs (compound components pattern)
- Active development and support
- Already installed in project (`@fluentui/react-components@9.72.11`)

**Decision**: Use `@fluentui/react-components` v9.72.11 already present in the project.

---

### Q2: Mobile Strategy (High Impact)

**Question**: How should the 3-column layout adapt to mobile?

**Answer**: **Responsive breakpoints with collapsible navigation**

**Decision**:
| Breakpoint | Layout Behavior |
|------------|----------------|
| ≥1024px (Desktop) | Full 3-column: App Bar (68px) + List Pane (280px) + Main Content (flex) |
| 768-1023px (Tablet) | Icons-only App Bar (48px) + List Pane (240px) + Main Content |
| <768px (Mobile) | Hidden App Bar (hamburger menu) + Full-width List/Content |
| <480px (Small Mobile) | Single column, App Bar as slide-out drawer |

**Rationale**: 
- Matches Microsoft Teams mobile behavior
- Maintains usability across all screen sizes
- Fluent UI v9 provides responsive utilities

---

### Q3: Theme Support (High Impact)

**Question**: Should the app support theme switching?

**Answer**: **Yes - Light, Dark, and Auto (system preference)**

**Decision**:
- Implement three theme modes: `light`, `dark`, `auto`
- Use `teamsLightTheme` and `teamsDarkTheme` from Fluent UI
- Auto mode detects `prefers-color-scheme` media query
- Manual toggle persists preference to localStorage
- Theme switch without page reload (FluentProvider re-render)

**Rationale**:
- Teams supports both themes
- User expectation for modern apps
- Fluent UI v9 has excellent theme switching support
- Improves accessibility (some users need specific contrast)

---

### Q4: Avatar Fallback Behavior (Medium Impact)

**Question**: How to display avatars when user has no photo?

**Answer**: **Initials with deterministic colored background**

**Decision**:
- Generate initials from user's first and last name (e.g., "John Doe" → "JD")
- Use deterministic color algorithm based on name hash
- Apply background color from Fluent UI avatar color palette
- Display initials in contrasting foreground color

**Rationale**:
- Consistent with Teams behavior
- Provides visual identity without photos
- Deterministic colors ensure consistency across sessions

---

### Q5: Performance Strategy for Large Lists (Medium Impact)

**Question**: How to handle rendering performance with large contact/channel lists?

**Answer**: **Virtualized rendering at 100+ items**

**Decision**:
- Use `@tanstack/react-virtual` for list virtualization
- Only render visible items in the viewport
- Estimated performance: 60fps with 1000+ items
- Threshold: Virtualize when list exceeds 100 items

**Rationale**:
- Prevents DOM bloat with large datasets
- Maintains smooth scrolling performance
- Industry standard pattern for long lists
- Lightweight library, easy integration

---

## Technology Decisions

### Component Selection

| UI Element | Fluent UI Component | Rationale |
|------------|---------------------|-----------|
| App Bar | Custom + `TabList` | Teams uses rail pattern, Fluent doesn't have exact match |
| Navigation Items | `Tab` + `bundleIcon` | Consistent with Fluent patterns |
| User Avatar | `Avatar` + `PresenceBadge` | Native Fluent components for identity |
| User Info | `Persona` | Purpose-built for user display |
| Buttons | `Button` | Replace all native `<button>` elements |
| Inputs | `Input` | Replace all native `<input>` elements |
| Layout | `makeStyles` + CSS Grid | Flexible, performant layout system |
| Lists | Custom + `@tanstack/react-virtual` | Virtualization for large lists |
| Theme | `FluentProvider` + `teamsLight/DarkTheme` | Official Teams themes |

### Styling Approach

**Decision**: Use `makeStyles` from Fluent UI v9

**Rationale**:
- CSS-in-JS with build-time extraction (no runtime overhead)
- Full access to Fluent design tokens (`tokens.colorBrandBackground`, etc.)
- Type-safe styles with autocomplete
- Consistent with Fluent UI component styling

**Example**:
```typescript
const useStyles = makeStyles({
  appBar: {
    width: '68px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  activeItem: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
});
```

### State Management

**Decision**: React Context for theme, existing state management for features

**Rationale**:
- Theme is global app state, perfect for Context
- Existing feature state management works well
- No need for additional libraries

### Responsive Breakpoint Implementation

**Decision**: CSS media queries + React state for breakpoint detection

**Rationale**:
- CSS media queries handle styling changes
- React state tracks active breakpoint for logic decisions
- Fluent UI v9 `useMediaQuery` hook available if needed
- Follows mobile-first responsive design principles

---

## Alternatives Considered

### Alternative 1: Use Fluent UI v8

**Why Rejected**:
- Legacy theming system (theming not as robust)
- Larger bundle size
- Less TypeScript support
- Teams themes not as polished
- Migration to v9 would be needed later

### Alternative 2: Custom CSS Framework

**Why Rejected**:
- Would recreate what Fluent UI already provides
- No access to Teams design tokens
- Maintenance burden
- Accessibility would need custom implementation

### Alternative 3: Other UI Libraries (Material-UI, Ant Design)

**Why Rejected**:
- Teams visual identity requires Microsoft design language
- Fluent UI is Microsoft's official design system
- Better integration with Teams ecosystem

### Alternative 4: Native CSS Grid without Fluent Layout

**Why Rejected**:
- Would lose Fluent UI theming integration
- Manual maintenance of spacing tokens
- No access to theme-aware values

---

## Implementation Patterns

### 3-Column Layout Pattern

```
┌─────────────────────────────────────────────────────────┐
│  App Bar    │  List Pane        │  Main Stage          │
│  (68px)     │  (280px)          │  (flex: 1)           │
│             │                   │                      │
│  🏠         │  ┌──────────┐     │  ┌────────────────┐  │
│  🤖         │  │ Channel 1│     │  │                │  │
│  ⚙️         │  │ Channel 2│     │  │   Content      │  │
│             │  │ Channel 3│     │  │                │  │
│  ─────      │  └──────────┘     │  └────────────────┘  │
│  👤 User    │                   │                      │
└─────────────────────────────────────────────────────────┘
```

### Theme Provider Pattern

```typescript
// ThemeProvider wraps app with correct theme
<FluentProvider theme={currentTheme === 'dark' ? teamsDarkTheme : teamsLightTheme}>
  <App />
</FluentProvider>
```

### Component Composition Pattern

**Before** (HTML):
```tsx
<button className="custom-button" onClick={handleClick}>
  Click me
</button>
```

**After** (Fluent UI):
```tsx
<Button appearance="primary" onClick={handleClick}>
  Click me
</Button>
```

### Responsive Layout Pattern

```typescript
// Using makeStyles with media queries
const useStyles = makeStyles({
  appShell: {
    display: 'grid',
    gridTemplateColumns: '68px 280px 1fr',
    '@media (max-width: 1023px)': {
      gridTemplateColumns: '48px 240px 1fr',
    },
    '@media (max-width: 767px)': {
      gridTemplateColumns: '1fr',
    },
  },
});
```

---

## Performance Considerations

### Bundle Size Impact

- **Fluent UI v9**: ~150KB gzipped (core components)
- **Already in bundle**: No additional cost (already installed @fluentui/react-components@9.72.11)
- **New components**: Minimal impact (< 10KB expected)
- **@tanstack/react-virtual**: ~5KB gzipped (if needed for lists)

### Virtualization Strategy

For lists > 100 items:
- Use `@tanstack/react-virtual` (recommended library)
- Windowed rendering: only visible items in DOM
- Estimated performance: 60fps with 1000 items
- Threshold configuration: 100 items

### Code Splitting

- Lazy load non-critical components (modals, dialogs)
- Route-based splitting already in place with React Router
- Dynamic imports for heavy components

### Build Optimization

- Vite handles tree-shaking automatically
- Fluent UI v9 supports ES modules for better tree-shaking
- Bundle analyzer available via `npm run build:analyze` if needed

---

## Accessibility Research

### WCAG 2.1 AA Compliance Checklist

- ✅ **Keyboard Navigation**: All interactive elements reachable via Tab
- ✅ **Focus Indicators**: Visible focus states using Fluent UI tokens
- ✅ **ARIA Labels**: Proper labeling for screen readers
- ✅ **Color Contrast**: Teams themes meet 4.5:1 ratio requirements
- ✅ **Reduced Motion**: Respect `prefers-reduced-motion`

### Screen Reader Testing

- NVDA (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

### ARIA Implementation

- Use Fluent UI built-in ARIA support
- Add custom `aria-label` where needed
- Ensure focus management in modals/overlays
- Test tab order matches visual order

---

## Development Setup

### Prerequisites

- Node.js 20+ (per AGENTS.md)
- Existing frontend with React 19.2.0
- TypeScript 5.9.3 with strict mode

### Dependencies Status

| Package | Status | Action |
|---------|--------|--------|
| @fluentui/react-components | ✅ 9.72.11 | Already installed |
| @tanstack/react-virtual | ⚠️ Not installed | Install if list virtualization needed |

### Installation Commands

```bash
# If virtualization needed:
cd frontend
npm install @tanstack/react-virtual

# Development server
npm run dev
```

---

## Testing Strategy

### Unit Testing

- Framework: Vitest + React Testing Library
- Coverage target: 80%+ for all components
- Mock Fluent UI components where appropriate
- Test theme switching logic

### Integration Testing

- Component interaction tests
- Theme provider integration
- Layout responsive behavior
- Navigation state management

### E2E Testing

- Framework: Playwright
- Critical paths: Navigation, theme switching, responsive layout
- Accessibility audits via axe-core

---

## Migration Strategy

### Phase 1: Theme Infrastructure
1. Refactor ThemeContext for auto/light/dark modes
2. Create useTheme hook
3. Wrap app with FluentProvider

### Phase 2: Layout Components
1. Create AppBar, ListPane, MainStage
2. Refactor AppShell for 3-column layout
3. Add responsive breakpoints

### Phase 3: Identity Components
1. Create UserPersona with Avatar + PresenceBadge
2. Create ChannelListItem with Persona
3. Integrate into AppBar and ListPane

### Phase 4: Component Refactoring
1. Audit existing code for native HTML elements
2. Replace buttons with Fluent Button
3. Replace inputs with Fluent Input
4. Update layout divs to use Fluent Grid/Stack

---

## References

- [Fluent UI v9 Documentation](https://react.fluentui.dev/)
- [Teams Design System](https://www.microsoft.com/en-us/microsoft-teams/features)
- [Fluent UI GitHub](https://github.com/microsoft/fluentui)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [@tanstack/react-virtual](https://tanstack.com/virtual/latest)

---

## Open Questions (Post-Research)

All clarifications have been resolved. No open questions remain for implementation.

---

**Research Status**: ✅ COMPLETE  
**Next Phase**: Phase 1 - Design & Contracts

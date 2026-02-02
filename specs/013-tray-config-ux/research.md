# Research: System Tray Configuration UX Premium

**Feature**: 013-tray-config-ux  
**Date**: 2026-02-02

## Research Areas

### 1. Electron Window Blur Detection

**Decision**: Use Electron BrowserWindow `blur` event to detect when popup should hide

**Rationale**: 
- Native Electron event, no additional dependencies
- Fires when window loses focus (user clicks outside)
- Can be combined with `focus` event for toggle behavior

**Implementation**:
```typescript
// In main.ts or tray.ts
trayWindow.on('blur', () => {
    if (!isDev) { // Keep open in dev for debugging
        trayWindow.hide();
    }
});
```

**Alternatives Considered**:
- Mouse leave detection: Too aggressive, hides when moving to taskbar
- Click-outside detection: Requires additional logic, less reliable

---

### 2. View Transition Animations in React

**Decision**: Use CSS transitions with React state for view switching (Status ↔ Config)

**Rationale**:
- CSS transitions are GPU-accelerated, ensuring 60fps
- Simple implementation with opacity/transform
- No additional animation library needed

**Implementation Pattern**:
```tsx
// ViewTransition.tsx
const ViewTransition: React.FC<{
    activeView: 'status' | 'config';
    children: [React.ReactNode, React.ReactNode];
}> = ({ activeView, children }) => {
    return (
        <div className="view-container">
            <div className={`view ${activeView === 'status' ? 'active' : 'inactive'}`}>
                {children[0]}
            </div>
            <div className={`view ${activeView === 'config' ? 'active' : 'inactive'}`}>
                {children[1]}
            </div>
        </div>
    );
};
```

```css
.view {
    transition: opacity 250ms ease, transform 250ms ease;
    position: absolute;
    inset: 0;
}
.view.inactive {
    opacity: 0;
    transform: translateX(-20px);
    pointer-events: none;
}
.view.active {
    opacity: 1;
    transform: translateX(0);
}
```

**Alternatives Considered**:
- Framer Motion: Overkill for simple transitions, adds bundle size
- React Transition Group: More complex API for this use case

---

### 3. Design System Unification Strategy

**Decision**: Extract CSS custom properties from frontend and create shared `design-tokens.css`

**Rationale**:
- CSS variables are already used in frontend (`:root` declarations)
- Easy to sync without build-time complexity
- Fluent UI components inherit from these tokens

**Implementation**:
1. Create `design-tokens.css` in worker-app with same variables as frontend
2. Override worker-app's current custom colors with frontend values
3. Use Fluent UI `FluentProvider` with matching theme tokens

**Current Frontend Colors** (from `frontend/src/index.css`):
```css
:root {
    color: rgba(255, 255, 255, 0.87);
    background-color: #242424;
}
```

**Current Worker-App Colors** (to be replaced):
```css
:root {
    --color-bg-primary: #1a1a2e;      /* → #242424 */
    --color-bg-secondary: #16213e;    /* → inherit from Fluent */
    --color-accent: #3b82f6;          /* → Fluent brand color */
}
```

**Alternatives Considered**:
- Shared npm package: Overkill for 2 apps, adds complexity
- Build-time CSS import: Requires Vite config changes
- Runtime CSS fetch: Too slow, adds flicker

---

### 4. Glassmorphism in Electron

**Decision**: Use `backdrop-filter: blur()` with Electron's transparent window

**Rationale**:
- Supported in Electron 28+ on Windows 10/11
- Creates premium visual effect matching Windows 11 aesthetic
- Already partially implemented in worker-app

**Implementation**:
```typescript
// main.ts - BrowserWindow config
const trayWindow = new BrowserWindow({
    transparent: true,
    frame: false,
    backgroundColor: '#00000000',
    webPreferences: {
        // ...
    }
});
```

```css
.tray-container {
    background: rgba(36, 36, 36, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
}
```

**Known Limitations**:
- `backdrop-filter` may not work on older Windows versions
- Fallback: solid background color with slight transparency

---

### 5. Fluent UI Theme Consistency

**Decision**: Use same Fluent UI theme configuration as frontend dashboard

**Rationale**:
- Both apps use Fluent UI v9
- Theme tokens ensure visual consistency
- Reduces maintenance overhead

**Implementation**:
```tsx
// worker-app/src/main.tsx
import { FluentProvider, webDarkTheme } from '@fluentui/react-components';

// Same theme as frontend
const App = () => (
    <FluentProvider theme={webDarkTheme}>
        <TrayContainer />
    </FluentProvider>
);
```

---

## Summary of Resolved Items

| Item | Resolution |
|------|------------|
| Blur detection | Electron `blur` event |
| View transitions | CSS transitions (250ms, ease) |
| Design unification | Shared CSS variables + Fluent theme |
| Glassmorphism | `backdrop-filter: blur(20px)` |
| Theme consistency | `webDarkTheme` from Fluent UI |

All NEEDS CLARIFICATION items resolved. Ready for Phase 1.

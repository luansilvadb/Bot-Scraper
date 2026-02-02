# Quickstart: System Tray Configuration UX

**Feature**: 013-tray-config-ux  
**Date**: 2026-02-02

## Overview

This guide helps you test and validate the tray configuration UX improvements.

## Prerequisites

1. **Backend running** at `http://localhost:30001`
2. **Frontend dashboard** running (for visual comparison)
3. **Worker-app** dependencies installed

## Setup

```bash
# Terminal 1: Backend
cd backend
npm run start:dev

# Terminal 2: Worker-app
cd worker-app
npm run dev
```

## Test Scenarios

### Scenario 1: First-Time Configuration (Onboarding)

**Precondition**: Clear worker-app config to simulate first launch

```bash
# Windows: Delete config file
del %APPDATA%\bot-scraper-worker\config.json
```

**Steps**:
1. Start worker-app (`npm run dev`)
2. Click on tray icon in system tray
3. Verify popup appears near tray (not centered on screen)
4. Verify config form is visible with:
   - Token input field
   - Worker name field (optional)
   - Auto-start toggle
   - Minimize to tray toggle
5. Enter a valid token from the dashboard
6. Click "Conectar"
7. Verify loading spinner appears
8. Verify transition to status view on success

**Expected Result**: 
- Config form embedded in tray popup ✅
- Design matches frontend dashboard colors ✅
- Smooth transition to status view ✅

---

### Scenario 2: Popup Blur Behavior

**Precondition**: Worker-app running with config popup open

**Steps**:
1. Open tray popup by clicking tray icon
2. Click anywhere outside the popup (desktop, another app)
3. Verify popup hides automatically
4. Verify tray icon remains visible
5. Click tray icon again
6. Verify popup reappears

**Expected Result**:
- Popup hides on blur ✅
- Worker continues running in background ✅
- Popup can be reopened ✅

---

### Scenario 3: Status ↔ Config Navigation

**Precondition**: Worker already configured and connected

**Steps**:
1. Open tray popup (shows status view)
2. Click settings/gear icon
3. Verify smooth slide transition to config view
4. Verify current config values are pre-filled
5. Click "Cancelar" or back button
6. Verify smooth transition back to status view

**Expected Result**:
- No flicker during transitions ✅
- Animation completes in ~250ms ✅
- Form preserves current values ✅

---

### Scenario 4: Visual Consistency Check

**Precondition**: Both frontend dashboard and worker-app running

**Steps**:
1. Open frontend dashboard in browser
2. Open worker-app tray popup
3. Compare visually:
   - Background color
   - Button styles (Fluent UI Button)
   - Typography (font family, sizes)
   - Input field styles
   - Border radius
   - Color accents

**Expected Result**:
- Colors are identical ✅
- Buttons look the same ✅
- Typography is consistent ✅
- Overall "feel" matches ✅

---

### Scenario 5: Connection Error Handling

**Precondition**: Backend NOT running (simulate error)

**Steps**:
1. Stop backend server
2. Open worker-app tray popup
3. Enter any token
4. Click "Conectar"
5. Verify error feedback:
   - Shake animation on error
   - Red error message inline
   - Button returns to enabled state

**Expected Result**:
- Clear error message ✅
- Visual feedback (shake/red) ✅
- Can retry after error ✅

---

## Key Files to Verify

| File | What to Check |
|------|---------------|
| `src/App.tsx` | View routing logic |
| `src/components/TrayContainer.tsx` | Transition container |
| `src/components/ConfigWindow.tsx` | Config form |
| `src/components/StatusWindow.tsx` | Status display |
| `src/index.css` | Design tokens (colors match frontend) |
| `electron/main.ts` | Blur event handling |

## Validation Checklist

### Visual
- [ ] Popup appears near system tray (not centered)
- [ ] Colors match frontend dashboard
- [ ] Glassmorphism effect visible (blur background)
- [ ] Border radius consistent (8-12px)
- [ ] Buttons use Fluent UI styling

### Behavior
- [ ] Popup hides on blur (click outside)
- [ ] Worker continues after popup hides
- [ ] Tray icon click reopens popup
- [ ] Transitions are smooth (no flicker)
- [ ] Error states show visual feedback

### Performance
- [ ] Animations run at 60fps
- [ ] Transitions complete in <300ms
- [ ] No lag when typing in form
- [ ] Popup opens instantly on click

## Common Issues

| Issue | Solution |
|-------|----------|
| Popup appears centered | Check tray window positioning in `electron/tray.ts` |
| Colors don't match | Verify `index.css` has updated tokens |
| Blur doesn't hide | Check `blur` event listener in `main.ts` |
| Transitions flicker | Check CSS transition properties |
| Glassmorphism missing | Electron needs `transparent: true` in BrowserWindow |

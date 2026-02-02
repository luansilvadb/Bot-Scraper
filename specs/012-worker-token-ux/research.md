# Research: Worker Token UX Improvements

**Feature Branch**: `012-worker-token-ux`  
**Created**: 2026-02-02  
**Status**: Complete

## Research Topics

### 1. Clipboard API Best Practices

**Decision**: Use `navigator.clipboard.writeText()` with graceful fallback

**Rationale**: 
- Modern Clipboard API is async and Promise-based
- Works in all modern browsers (Chrome 66+, Firefox 63+, Safari 13.1+)
- Requires HTTPS or localhost (both covered)
- For older browsers, fallback to `document.execCommand('copy')` with temporary textarea

**Alternatives Considered**:
- `execCommand` only: Deprecated, inconsistent behavior
- Third-party library (clipboard.js): Unnecessary overhead for simple use case
- No fallback: Would exclude older browser users

**Implementation Pattern**:
```typescript
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}
```

---

### 2. Token Display Security Patterns

**Decision**: Auto-hide after 30 seconds with visual countdown

**Rationale**:
- Sensitive data should not remain visible indefinitely
- 30 seconds provides enough time to copy while limiting exposure
- Visual countdown (progress bar or timer) provides clear feedback
- Similar patterns used by: GitHub PAT, AWS secret keys, Stripe API keys

**Alternatives Considered**:
- Never auto-hide: Security risk if screen left unattended
- 10 seconds: Too short, users might not complete copy action
- Blur on hover-out: Unpredictable on mobile/touch devices

---

### 3. Token Regeneration Backend Approach

**Decision**: New endpoint `POST /workers/:id/regenerate-token`

**Rationale**:
- Follows REST conventions (action on resource)
- Returns new token in response
- Atomically invalidates old token
- Worker reconnection handled by Socket.IO disconnect

**Security Considerations**:
- Endpoint requires authentication (existing JWT guard)
- Only token owner can regenerate (authorization check)
- Immediate invalidation prevents token reuse

**Response Format**:
```json
{
  "success": true,
  "data": {
    "token": "new_generated_token_here",
    "regeneratedAt": "2026-02-02T12:00:00Z"
  }
}
```

---

### 4. Modal UX Patterns for Sensitive Data

**Decision**: Full-screen overlay modal with explicit confirmation before close

**Rationale**:
- Prevents accidental dismissal (no click-outside-to-close by default)
- Prominent warning text about "shown only once"
- Large copy button with visual feedback ("Copied!" state)
- Inspired by: GitHub PAT creation, Stripe key reveal

**Modal Flow**:
1. Modal opens with token + warning
2. User clicks "Copy" → Button shows "Copied!" for 2 seconds
3. User tries to close → Confirmation: "Did you save your token?"
4. User confirms → Modal closes, toast confirms action

---

### 5. Fluent UI Components for Token Display

**Decision**: Use Fluent UI Dialog, Field, Input (readonly), and Button components

**Rationale**:
- Consistent with existing dashboard design
- Dialog provides built-in overlay and focus management
- Input with `readOnly` + monospace font for token display
- Visual feedback via Button state changes

**Components Needed**:
- `Dialog` / `DialogSurface`: Modal container
- `Input`: Token display (readonly, monospace)
- `Button`: Copy action with icon swap
- `Tooltip`: Additional context on hover
- `ProgressBar` (optional): Auto-hide countdown visualization

---

## Dependencies Identified

| Dependency | Version | Purpose | Already Installed |
|------------|---------|---------|-------------------|
| @fluentui/react-components | ^9.x | UI components | ✅ Yes |
| @tanstack/react-query | ^5.x | Mutations/queries | ✅ Yes |
| uuid | ^9.x | Token generation (backend) | ✅ Yes |

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Clipboard API blocked by browser | Low | Medium | Fallback to execCommand, show manual copy instructions |
| User closes modal without copying | Medium | High | Confirmation dialog before close |
| Token regeneration during active connection | Low | Low | Worker auto-disconnects, user reconfigures with new token |

## Conclusion

All technical decisions are resolved. No blocking issues identified. Ready to proceed to Phase 1 (Design & Contracts).

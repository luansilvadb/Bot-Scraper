# Quickstart: Worker Token UX Improvements

**Feature Branch**: `012-worker-token-ux`  
**Created**: 2026-02-02

## Overview

This feature improves how users manage worker authentication tokens in the dashboard:
- **Token Modal**: Dedicated display after registration with copy button
- **Token Regeneration**: Generate new token for existing workers
- **Show Token**: Reveal token on worker cards with auto-hide

## Prerequisites

- Node.js LTS installed
- Backend running (`npm run start:dev` in `/backend`)
- Frontend running (`npm run dev` in `/frontend`)
- PostgreSQL and Redis running locally

## Quick Test

### Test 1: Token Modal After Registration

1. Open dashboard at `http://localhost:3000`
2. Click "Register Worker" button
3. Enter a worker name and submit
4. **Expected**: Token modal appears with:
   - Token displayed prominently
   - "Copy" button
   - Warning about one-time display
5. Click "Copy" → Button should show "Copied!"
6. Try to close modal → Confirmation dialog should appear

### Test 2: Token Regeneration

1. Find an existing worker card
2. Click "⋮" menu → "Regenerate Token"
3. **Expected**: Confirmation dialog warns about old token
4. Confirm regeneration
5. **Expected**: Token modal shows new token
6. (Optional) Try old token in worker app → Should fail auth

### Test 3: Show Token on Card

1. Find an existing worker card
2. Click "Show Token" button
3. **Expected**: Token revealed with "Copy" button
4. Wait 30 seconds without interaction
5. **Expected**: Token auto-hides

## Key Files

### Frontend (New Components)

| File | Purpose |
|------|---------|
| `frontend/src/features/workers/TokenModal.tsx` | Main token display modal |
| `frontend/src/features/workers/TokenDisplay.tsx` | Reusable token display with copy |
| `frontend/src/features/workers/RegenerateTokenDialog.tsx` | Confirmation before regeneration |
| `frontend/src/hooks/useClipboard.ts` | Clipboard hook with fallback |

### Frontend (Modified)

| File | Changes |
|------|---------|
| `frontend/src/features/workers/WorkerList.tsx` | Uses TokenModal instead of Toast |
| `frontend/src/features/workers/WorkerCard.tsx` | Adds "Show Token" and "Regenerate" options |
| `frontend/src/features/workers/api.ts` | New `regenerateToken` mutation |

### Backend (New Endpoint)

| File | Changes |
|------|---------|
| `backend/src/workers/workers.controller.ts` | New `POST /workers/:id/regenerate-token` |
| `backend/src/workers/workers.service.ts` | New `regenerateToken()` method |

## Validation Checklist

- [ ] Token modal displays after worker registration
- [ ] Copy button copies token and shows "Copied!" feedback
- [ ] Modal warns before closing without explicit confirmation
- [ ] Regenerate token shows confirmation dialog
- [ ] New token works, old token fails
- [ ] Show Token reveals token on card
- [ ] Token auto-hides after 30 seconds
- [ ] Clipboard fallback works (test in older browser)

## Common Issues

### Clipboard API "Permission Denied"

**Cause**: Browser blocking clipboard access (not HTTPS or not user gesture)  
**Solution**: Ensure action is triggered by user click, fallback shows selectable text

### Token Not Displaying

**Cause**: API response not including token  
**Solution**: Check backend returns token in registration response

### Old Token Still Works After Regeneration

**Cause**: Token not being updated in database  
**Solution**: Check server logs, verify Prisma update call

# Feature Specification: Worker Token UX Improvements

**Feature Branch**: `012-worker-token-ux`  
**Created**: 2026-02-02  
**Status**: Draft  
**Input**: User description: "Improve worker token management in the frontend dashboard with dedicated token modal, copy button, token regeneration, and token visibility on worker cards"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - First-Time Token Display (Priority: P1)

When a user registers a new worker, they need to copy the authentication token to configure their worker application. Currently, the token appears briefly in a toast notification that can be missed or dismissed. The user needs a dedicated modal that displays the token prominently with a clear copy button, ensuring they never lose access to their token.

**Why this priority**: This is the most critical flow. If users cannot reliably capture their token at registration time, they cannot set up their worker at all. This directly impacts user onboarding success.

**Independent Test**: Register a new worker and verify a modal appears with the token and a working copy button.

**Acceptance Scenarios**:

1. **Given** a user has just registered a new worker, **When** registration completes successfully, **Then** a modal appears showing the token prominently with a "Copy" button
2. **Given** the token modal is displayed, **When** the user clicks the "Copy" button, **Then** the token is copied to clipboard and visual feedback confirms the copy action
3. **Given** the token modal is displayed, **When** the user clicks outside the modal or presses Escape, **Then** a warning appears asking if they have saved the token before closing
4. **Given** the token modal is displayed, **When** the user confirms they have saved the token, **Then** the modal closes and the worker appears in the list

---

### User Story 2 - Token Regeneration (Priority: P1)

A user may lose their worker token (deleted notes, new machine, etc.) and needs to configure a worker with a fresh token. The user should be able to regenerate a new token for any existing worker, invalidating the old one. This allows recovery without deleting and re-registering the worker.

**Why this priority**: Without this feature, users who lose their token must delete and recreate their worker, losing all historical data and statistics. This is a critical recovery mechanism.

**Independent Test**: Click "Regenerate Token" on an existing worker card and verify a new token is generated and displayed.

**Acceptance Scenarios**:

1. **Given** a worker card is displayed, **When** the user clicks the "Regenerate Token" action, **Then** a confirmation dialog appears warning that the old token will stop working
2. **Given** the confirmation dialog is shown, **When** the user confirms regeneration, **Then** a new token is generated and displayed in the token modal
3. **Given** a new token has been generated, **When** the old token is used by a worker application, **Then** the connection is rejected with an authentication error
4. **Given** a new token has been generated, **When** the new token is used by a worker application, **Then** the connection succeeds

---

### User Story 3 - Copy Token from Worker Card (Priority: P2)

For users who need to quickly configure an additional worker with the same token, or want to verify/share their token, they should be able to see and copy the token directly from the worker card without going through regeneration.

**Why this priority**: This is a convenience feature for users managing multiple workers or reconfiguring existing setups. Less critical than initial setup but improves daily workflow.

**Independent Test**: Click "Show Token" on a worker card and verify the token can be copied.

**Acceptance Scenarios**:

1. **Given** a worker card is displayed, **When** the user clicks "Show Token", **Then** the current token is revealed with a copy button
2. **Given** the token is revealed, **When** the user clicks "Copy", **Then** the token is copied to clipboard with visual confirmation
3. **Given** the token is revealed, **When** 30 seconds pass without interaction, **Then** the token is automatically hidden for security

---

### Edge Cases

- What happens if the user closes the token modal without copying?
  - Show a confirmation warning before closing
- What happens if clipboard access is denied by the browser?
  - Show the token in a selectable text field as fallback with manual copy instructions
- What happens if token regeneration fails due to network error?
  - Show error message and allow retry, do not invalidate existing token
- What happens if the worker is currently connected when token is regenerated?
  - The connected worker should be disconnected and need to reconnect with new token

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a dedicated modal with the token after successful worker registration
- **FR-002**: Token modal MUST include a prominent "Copy to Clipboard" button
- **FR-003**: Token modal MUST show a security warning that the token will only be shown once (unless regenerated)
- **FR-004**: System MUST show visual feedback when token is successfully copied (e.g., button changes to "Copied!")
- **FR-005**: Token modal MUST warn users before closing if they haven't explicitly confirmed saving the token
- **FR-006**: System MUST allow users to regenerate a token for any existing worker
- **FR-007**: Token regeneration MUST invalidate the previous token immediately
- **FR-008**: Token regeneration MUST show a confirmation dialog before proceeding
- **FR-009**: Worker cards MUST include a "Show Token" option to reveal the current token
- **FR-010**: Revealed tokens MUST auto-hide after 30 seconds of inactivity
- **FR-011**: If clipboard API is unavailable, system MUST provide fallback with selectable text

### Key Entities

- **WorkerToken**: Authentication credential for worker-to-server communication
  - One-to-one relationship with Worker
  - Can be regenerated (new token replaces old)
  - Old token becomes invalid upon regeneration

- **Worker**: Registered scraping agent
  - Has exactly one active token at any time
  - Token required for authentication and connection

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of users can successfully copy their token after worker registration
- **SC-002**: Token copy action completes in under 1 second with visual confirmation
- **SC-003**: Zero support tickets related to "lost token" or "how do I copy my token"
- **SC-004**: Users can recover from lost tokens via regeneration without deleting workers
- **SC-005**: Token reveal action includes auto-hide security measure (30 second timeout)
- **SC-006**: All token operations provide clear user feedback (success, error, loading states)

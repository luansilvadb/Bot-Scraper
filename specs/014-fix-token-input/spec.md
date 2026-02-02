# Feature Specification: Fix Token Input Visibility

**Feature Branch**: `014-fix-token-input`
**Created**: 2026-02-02
**Status**: Draft
**Input**: User description: "input do token @[worker-app] não está aparecendo preciso que corrija"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configure Worker Token (Priority: P1)

As a worker administrator, I want to be able to input my access token in the worker app so that I can connect the worker to the panel.

**Why this priority**: Without the token input, the worker cannot be configured or connected, rendering the application unusable for new setups or re-configurations.

**Independent Test**: Can be fully tested by opening the worker app configuration screen and verifying the presence and functionality of the token input field.

**Acceptance Scenarios**:

1. **Given** the worker app is open on the configuration screen, **When** I view the form, **Then** I should see a visible input field for the access token.
2. **Given** the token input field is visible, **When** I paste a valid token and click "Conectar", **Then** the application should attempt to connect using that token.

---

### Edge Cases

- What happens when the user pastes an invalid token format? (Input should allow text; validation is separate but input must work).
- What happens if the window is resized? (Input should remain visible and responsive).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The worker configuration interface MUST display a text input field for the access token.
- **FR-002**: The token input field MUST support text entry and pasting.
- **FR-003**: The UI layout MUST accommodate the input field within the "Configurações do Worker (V2)" card.

### Key Entities *(include if feature involves data)*

- **WorkerConfig**: The configuration object that should receive the token.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Used can see the token input field immediately upon loading the configuration screen.
- **SC-002**: Users can successfully input a token string and submit the form.

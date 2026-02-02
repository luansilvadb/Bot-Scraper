# Research: Fix Token Input Visibility

**Feature**: Fix Worker Token Input
**Status**: Complete
**Date**: 2026-02-02

## Problem Analysis

The user reported that the token input field is missing in the Worker App configuration screen.
Analysis of `ConfigWindow.tsx` and `ConfigWindow.css` revealed:
1. The component uses a Fluent UI `Card` with `display: block` which might not be expanding its children correctly when `min-height` is involved in the parent container.
2. The `input` field uses inline styles with hardcoded dark colors (`#333`) which might conflict with certain themes or be invisible if the rendering context is wrong.
3. The `Card` container structure might be clipping content if the flex calculation of `.form-content` (`flex: 1`) is not supported by the parent display mode.

## Decisions

### 1. CSS Layout Fix
**Decision**: explicit `display: flex` and `flex-direction: column` to the `.config-card` class to ensure the `.form-content` child (which has `flex: 1`) expands correctly to fill the available space.

### 2. Standardized Input Component
**Decision**: Replace the HTML `input` with Fluent UI `Input` component (or properly styled `input` with class) to ensure consistent rendering across themes and reduce inline style maintenance. Currently, `Input` is imported. We will use the Fluent UI `Input` or at least apply consistent design tokens instead of hardcoded colors.

### 3. Theme Compatibility
**Decision**: Use CSS variables (`var(--color-bg-secondary)`, etc.) instead of hardcoded hex values to support potential future light mode or theme changes without breaking visibility.

## Alternatives Considered

- **Alternative**: Just change the inline color.
  - **Reason for Rejection**: Does not solve potential layout clipping issues and leaves technical debt (hardcoded colors).
  - **Outcome**: Rejected.

- **Alternative**: Remove `Card` wrapper.
  - **Reason for Rejection**: Breaks visual consistency (padding, borders) provided by the `Card`.
  - **Outcome**: Rejected.

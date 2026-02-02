# Research: Fix Amazon Scraper Invalid URL Error

**Feature**: `002-fix-amazon-scraper`
**Status**: Complete

## 1. URL Validation Strategy

### Problem
Playwright's `page.goto(url)` throws a `Protocol error` if the `url` does not include a valid protocol (e.g., `http://` or `https://`). Input data from users or external sources often lacks this (e.g., "amazon.com.br").

### Investigation
- **Context**: `AmazonScraper.scrape` receives a raw `string` URL.
- **Requirement**: "If the target URL is missing a protocol scheme... the system MUST prepend `https://`".

### Decision
Implement a private helper method or inline check in `AmazonScraper` that checks for the existence of a protocol.

**Approach**:
1. Check if string starts with `http://` or `https://`.
2. If not, prepend `https://`.
3. (Optional but recommended) Validate the final string using standard `URL` object constructor to catch other validity errors before passing to Playwright.

**Rationale**:
- **Simplicity**: Regex/Prefix check is fast and covers the specific user complaint.
- **Robustness**: Pre-validation prevents unhandled promise rejections or runner crashes.
- **No Dependencies**: Standard JS/TS string methods.

### Alternatives Considered
- **Playwright Interception**: Intercepting requests to fix them. *Rejected*: Too complex; better to fix the input before calling navigation.
- **Global Pipe/Validation**: Implementing a NestJS Pipe to validate inputs at the Controller level. *Rejected*: While good for API inputs, the Scraper service should be robust enough to handle data from any source (Queues, internal calls, etc), so validation at the Service entry point is safer for this module.

## 2. Testing Strategy

### Decision
Use Jest Unit Tests for `AmazonScraper`.

**Rationale**:
Since `AmazonScraper` is a standard class, we can instantiate it and mock `page`. However, for this specific fix, we might want to test the URL transformation logic. If the transformation is a private method, we test the public `scrape` method and verify `page.goto` is called with the *corrected* URL.

**Plan**:
1. Mock `Page` object (specifically `goto`).
2. Call `scrape(mockPage, "amazon.com.br")`.
3. Assert `mockPage.goto` was called with `"https://amazon.com.br"`.

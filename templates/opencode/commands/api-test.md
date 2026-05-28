---
description: Generate and run Playwright API tests for backend endpoints.
agent: build
model: opencode-go/qwen3.6-plus
---

Generate and run Playwright API tests using the `request` context to validate backend endpoints independently of the UI.

## Objective

Create API-level tests that:

1. Validate endpoint response status codes.
2. Validate response data shapes and contracts.
3. Verify authentication requirements on protected endpoints.
4. Verify error responses are well-structured.
5. Verify pagination, filtering, and sorting when applicable.

## Rules

1. Do **not** modify application source files.
2. Do **not** modify Playwright config unless absolutely required.
3. Only create or update files under `tests/api/`.
4. Use Playwright's `request` fixture — do **not** launch a browser.
5. Read authentication tokens from environment variables or storage state files.
6. Do **not** call destructive API endpoints (DELETE, destructive POST/PUT/PATCH operations) unless they are safe test-specific endpoints.
7. If a destructive endpoint must be tested, document it as a manual test candidate.
8. Keep tests small and focused — one endpoint behavior per test when practical.

## Suggested file naming

```text
tests/api/auth.api.spec.ts
tests/api/teams.api.spec.ts
tests/api/clusters.api.spec.ts
tests/api/alerts.api.spec.ts
```

Only create files that make sense for the application's API surface.

## Test structure

Each API test file should:

1. Define a base URL from environment configuration.
2. Use `request` fixture for API calls.
3. Authenticate when needed using stored tokens or environment variables.
4. Validate:
   - Status codes (200, 201, 400, 401, 403, 404, 422).
   - Response body shape and required fields.
   - Error response format.
   - Pagination headers or response structure.

Example:

```ts
import { test, expect } from '@playwright/test';

test.describe('Teams API', () => {
  test('GET /api/teams returns 200 with array', async ({ request }) => {
    const response = await request.get('/api/teams');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('GET /api/teams requires authentication', async ({ request }) => {
    const response = await request.get('/api/teams', {
      headers: { Authorization: '' },
    });
    expect(response.status()).toBe(401);
  });
});
```

## Execution

After creating tests, run:

```bash
npx playwright test tests/api
```

Optionally run the full suite:

```bash
npx playwright test
```

## Required report

Always create or overwrite:

```text
api-test-report.md
```

Use this structure:

```md
# API Test Report

## Summary

- Date/time:
- Command:
- Result: PASSED / FAILED / PARTIAL
- Test files created:
- Endpoints covered:

## Endpoints Tested

| Method | Endpoint | Status | Auth Required | Notes |
|--------|----------|--------|---------------|-------|

## Tests Run

| # | Test File | Test Name | Status |
|---|-----------|-----------|--------|

## Failures

If no failures:

No failures detected.

If failures exist, document each:

### Failure 1: <test name>

**Endpoint:**
**Expected behavior:**
**Actual behavior:**
**Status code:**
**Response body excerpt:**

## Destructive Endpoints Not Tested

List any endpoints that were not tested because they are destructive.

| Method | Endpoint | Reason |
|--------|----------|--------|

## Gaps and Recommendations

- Missing endpoints
- Endpoints that need better test data
- Endpoints requiring manual testing
- Recommendations for data seeding
```

## Final response

After writing the report, respond with one of:

```text
API tests PASSED. Report written to api-test-report.md.
```

```text
API tests FAILED. Report written to api-test-report.md.

Failures:
1. <short summary>
2. <short summary>
```

```text
API tests PARTIAL. Report written to api-test-report.md.

Gaps:
1. <short gap>
2. <short gap>
```
---
description: Generate and run functional Playwright tests for the Vue admin app.
agent: functional-qa
model: opencode-go/qwen3.6-plus
---

Run a functional QA pass for the Vue admin application.

The current suite may already cover smoke checks, headings, basic navigation, and simple page presence. Do not duplicate those tests.

## Objective

Create and run higher-value Playwright functional tests for real UI behavior.

Focus on:

1. Authentication behavior.
2. Protected route behavior.
3. Form validation.
4. Modal open/cancel behavior.
5. Filtering/search behavior.
6. Detail page behavior.
7. Empty/error/loading states.
8. Role/permission behavior if test users exist.
9. Non-destructive functional flows.

## Rules

1. Do not modify application source files.
2. Do not modify production code.
3. Do not modify package files.
4. Do not modify Playwright config unless absolutely required.
5. Only create or update tests under:

```text
tests/functional/
```

6. Do not delete existing tests.
7. Do not skip tests to force a pass.
8. Do not weaken assertions.
9. Do not automate destructive UI actions on real production data. Document destructive flows as manual test candidates.
10. API-based test data setup and teardown is allowed and encouraged. Use Playwright's `request` fixture to create resources before tests and delete them after.
11. Reuse the existing authenticated storage state when appropriate.
12. Use semantic locators whenever possible.
13. If stable selectors are missing, document the gap instead of creating brittle tests.
14. If you cannot determine how to set up test data, ask the user which resources can be created and deleted for testing.

## Test data management

Functional tests often need data that does not already exist in the system. Use API requests to set up and tear down test data.

### Discovering the API

Before generating test data fixtures, discover how to create and delete resources:

1. If the `SWAGGER_URL` environment variable is set, read the OpenAPI/Swagger spec from that URL to find available endpoints, request schemas, and response shapes.
2. If `SWAGGER_URL` is not set, check the project for local API documentation files:
   - `openapi.yaml` or `openapi.json` in the project root or `docs/` directory
   - `swagger.yaml` or `swagger.json` in the project root or `docs/` directory
3. If no API documentation is found, ask the user:
   - Which resources can be safely created and deleted for testing?
   - What are the API endpoint paths and payload shapes for those resources?
   - Are there any restrictions on which environments or data can be used?

### Seeding and cleaning up test data

Use Playwright's `request` fixture in `test.beforeEach` and `test.afterAll` to create and delete test resources via the API.

Example pattern:

```ts
import { test, expect } from '@playwright/test';

test.describe('Team management', () => {
  let teamId: string;

  test.beforeEach(async ({ request }) => {
    const response = await request.post('/api/teams', {
      data: { name: 'Test Team', description: 'Created by QA' },
    });
    const body = await response.json();
    teamId = body.id;
  });

  test.afterAll(async ({ request }) => {
    if (teamId) {
      await request.delete(`/api/teams/${teamId}`);
    }
  });

  test('team appears in the list after creation', async ({ page }) => {
    await page.goto('/admin/teams');
    await expect(page.getByText('Test Team')).toBeVisible();
  });
});
```

### Rules for test data

- Always clean up created resources in `test.afterAll` or `test.afterEach`.
- Use unique names or identifiers to avoid collisions with real data.
- If cleanup fails, document it in the report.
- Never create test data through the UI when an API is available.

## Suggested files

Create only the files that make sense based on the app:

```text
tests/functional/auth.functional.spec.ts
tests/functional/team.functional.spec.ts
tests/functional/clusters.functional.spec.ts
tests/functional/alerts.functional.spec.ts
tests/functional/roles.functional.spec.ts
tests/functional/profile.functional.spec.ts
```

## Execution

After creating or updating tests, run:

```bash
npx playwright test tests/functional
```

If that passes, optionally run the full suite:

```bash
npx playwright test
```

## Required report

Always create or overwrite:

```text
functional-tests.md
```

The report must clearly state:

- What functional tests were added.
- What was executed.
- Whether the functional QA pass succeeded.
- What failed, if anything.
- Which flows were not automated and why.
- What selectors or test data are missing.

Use this structure:

```md
# Functional QA Report

## Summary

- Date/time:
- Command: `/functional-test`
- Result: PASSED / FAILED / PARTIAL
- Test files created:
- Test files modified:
- Playwright command run:

## Functional Coverage

| Area | Coverage | Notes |
|------|----------|-------|

## Tests Added or Updated

| Test File | Test Name | Purpose | Status |
|----------|-----------|---------|--------|

## Tests Run

| # | Project | Test File | Test Name | Status |
|---|---------|-----------|-----------|--------|

## Failures

If no failures:

No failures detected.

If failures exist, document each separately.

### Failure 1: <test name>

**Area:**
**Expected behavior:**
**Actual behavior:**
**Likely root cause:**
**Steps to reproduce:**
**Relevant log excerpt:**

## Manual Test Candidates

Document important flows that were not automated because they are destructive, require unavailable test data, or need product confirmation.

| Area | Flow | Reason |
|------|------|--------|

## Risks and Gaps

List remaining QA gaps.

## Notes

Mention Playwright artifacts, missing selectors, missing test data, or recommendations such as adding `data-testid`.
```

## Final response

After writing `functional-tests.md`, respond with only one of:

```text
Functional QA PASSED. Report written to functional-tests.md.
```

or:

```text
Functional QA FAILED. Report written to functional-tests.md.

Failures:
1. <short summary>
2. <short summary>
```

or:

```text
Functional QA PARTIAL. Report written to functional-tests.md.

Gaps:
1. <short gap>
2. <short gap>
```

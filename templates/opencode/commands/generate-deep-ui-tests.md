---
description: Generate deeper Playwright tests for validations, modals, filters, detail pages, and error states.
agent: build
model: opencode-go/qwen3.6-plus
---

Read the existing test suite and the crawl report, then generate deeper Playwright tests for real UI behavior.

Basic smoke and navigation tests should already exist. This command adds meaningful behavior tests on top of them.

## Objective

Create deeper tests for:

1. Form validation (required fields, invalid input, error messages).
2. Modal open/cancel behavior (state unchanged after cancel).
3. Filter and search behavior (results change when filters are applied).
4. Detail pages (data matches the selected list item).
5. Empty states (reasonable UI when no data exists).
6. Loading states (spinner or skeleton shown while data loads).
7. Error states (API errors, 404, permission denied).
8. Table interactions (sort, pagination, row selection if present).

## Rules

1. Do **not** modify application source files.
2. Do **not** modify Playwright config unless absolutely required.
3. Only create or update `.spec.ts` files under `tests/`.
4. Do **not** generate shallow heading-only tests. Every test must validate meaningful behavior.
5. Prefer semantic locators:
   - `getByRole`
   - `getByLabel`
   - `getByText`
   - `getByPlaceholder`
   - `getByTestId`
6. Avoid brittle CSS selectors unless no semantic selector exists.
7. Do **not** automate destructive actions (delete, remove, approve, reject, irreversible save). Document them as manual test candidates instead.
8. Reuse the existing authenticated session if Playwright is configured for it.
9. If a test depends on test data that does not exist, skip the test and document the dependency.
10. Keep tests focused and readable — one behavior per test when practical.
11. Do **not** duplicate tests that already exist in the suite.

## Suggested file naming

```text
tests/auth-flows.spec.ts
tests/form-validation.spec.ts
tests/modal-behavior.spec.ts
tests/filter-search.spec.ts
tests/detail-pages.spec.ts
tests/table-interactions.spec.ts
tests/error-states.spec.ts
tests/empty-and-loading-states.spec.ts
```

Only create files that make sense for the application.

## Execution

After creating or updating tests, run:

```bash
npx playwright test
```

If there are failures that are clearly caused by stale locators, repair them using the same rules as `/qa`:

- Only repair locators for `STALE_LOCATOR` failures.
- Do not weaken assertions.
- Do not skip tests.
- Re-run up to 3 total times.

## Required report

Always create or overwrite:

```text
deep-ui-tests.md
```

# Deep UI Tests Report

## Summary

- Command run: `npx playwright test`
- Result: PASSED or FAILED
- Date/time:
- New test files created:
- Existing test files modified:

## Tests Added

| Test File | Test Name | Purpose |
|----------|-----------|---------|

## Areas Covered

- Authentication:
- Team:
- Clusters:
- Alerts:
- Roles:
- Profile:
- Error states:
- Network/API behavior:

## Candidate Flows Not Automated

List flows that should be tested later but were not automated.

| Area | Flow | Reason |
|-----|------|--------|

## Failures

If no failures:

No failures detected.

If failures exist, document each separately:

### Failure 1: <test name>

**Expected behavior:**

**Actual behavior:**

**Likely root cause:**

**Steps to reproduce:**

**Relevant error/log excerpt:**

## Notes

Mention any selectors that were fragile, missing test IDs, missing test data, or areas that need product confirmation.

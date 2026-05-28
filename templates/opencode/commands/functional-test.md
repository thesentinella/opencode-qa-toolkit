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
9. Do not automate destructive actions.
10. Reuse the existing authenticated storage state when appropriate.
11. Use semantic locators whenever possible.
12. If stable selectors are missing, document the gap instead of creating brittle tests.

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

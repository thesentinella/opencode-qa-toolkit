---
description: Run a fast smoke test on critical paths with no repair loop.
agent: smoke-qa
model: opencode-go/qwen3.6-plus
---

Run a fast smoke test to validate that critical application paths still work.

This command is intended for pre-merge and CI validation. It runs a subset of the most important tests, reports pass/fail, and stops. No repair, no re-runs, no deep analysis.

## Objective

Execute a quick sanity check:

1. Application loads.
2. Authentication works.
3. Main navigation renders.
4. Key pages are reachable.
5. No critical errors in console.

## Rules

1. Do **not** modify application source files.
2. Do **not** modify Playwright config.
3. Do **not** create new tests.
4. Do **not** repair locators.
5. Do **not** re-run failed tests.
6. Only run tests tagged with `@smoke` if they exist, otherwise run the test suite normally.
7. Report results as-is. If tests fail, document the failure clearly and stop.

## Execution

Run smoke tests first:

```bash
npx playwright test --grep @smoke
```

If no tests are tagged with `@smoke`, run:

```bash
npx playwright test
```

Do not re-run. Do not repair. Report results immediately.

## Required report

Always create or overwrite:

```text
smoke-test-report.md
```

Use this structure:

```md
# Smoke Test Report

## Summary

- Date/time:
- Command:
- Result: PASSED / FAILED
- Total tests run:
- Duration:

## Tests Run

| # | Test File | Test Name | Status | Duration |
|---|-----------|-----------|--------|----------|

## Failures

If no failures:

No failures detected.

If failures exist, document each:

### Failure 1: <test name>

**Test file:**
**Expected behavior:**
**Actual behavior:**
**Error message:**

## Recommendation

Write one of:

```text
SMOKE PASSED — safe to merge.
```

```text
SMOKE FAILED — do not merge. Investigate failures above.
```
```

## Final response

After writing the report, respond with one of:

```text
SMOKE PASSED. Report written to smoke-test-report.md.
```

```text
SMOKE FAILED. Report written to smoke-test-report.md.

Failures:
1. <short summary>
2. <short summary>
```
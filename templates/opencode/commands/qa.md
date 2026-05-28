---
description: Run Playwright tests on the remote Vue app, repair broken locators when safe, and document the result.
agent: build
model: opencode-go/qwen3.6-plus
---

Run the local Playwright test suite using:

```bash
npx playwright test
```

This command is responsible for:

1. Running the Playwright UI test suite.
2. Creating or overwriting `ui-tests.md`.
3. Reporting whether the suite passed or failed.
4. Repairing local Playwright locators only when the failure is clearly caused by a changed selector, text, role, label, placeholder, or DOM structure in the remote Vue app.
5. Re-running the suite after safe locator repairs.

## Rules

1. Do **not** modify application source files.
2. Do **not** modify build scripts, package files, Playwright config, environment files, or CI files.
3. Do **not** change test intent or expected business behavior.
4. Do **not** add new tests in this command.
5. Do **not** delete tests.
6. Do **not** skip tests to make the suite pass.
7. Do **not** weaken assertions just to make the suite pass.
8. You may only modify `.spec.ts` files when the failure is clearly caused by a stale locator or UI element reference.
9. Locator repairs must be minimal and specific.
10. Prefer semantic Playwright locators:
    - `getByRole`
    - `getByLabel`
    - `getByText`
    - `getByPlaceholder`
    - `getByTestId`
11. Avoid brittle CSS selectors unless there is no better option.
12. If the failure is caused by real application behavior, document it as a bug and do not modify tests.
13. If the root cause is unclear, document it as unresolved and do not modify tests.
14. Always create or overwrite `ui-tests.md`.
15. Always read `ui-tests.md` back before finishing and make sure it accurately reflects the final test result.

## Execution flow

### Step 1: Run tests

Run:

```bash
npx playwright test
```

Capture:

- Exit code
- Full Playwright output
- Failed test names
- Failed files
- Error messages
- Assertion failures
- Trace paths
- Screenshot paths
- Video paths
- HTML report path if available

### Step 2: Analyze failures

For each failure, classify it as one of:

- `PASSED`
- `STALE_LOCATOR`
- `APPLICATION_BUG`
- `TEST_DATA_ISSUE`
- `AUTH_SESSION_ISSUE`
- `ENVIRONMENT_ISSUE`
- `UNKNOWN_FAILURE`

Use this decision logic:

A failure may be classified as `STALE_LOCATOR` only if:

- The test intent is still valid.
- The app page loads successfully.
- The expected UI behavior still appears to exist.
- The failure is caused by a locator not matching the current UI.
- A better locator can be identified from the current page using Playwright output, trace, screenshots, or DOM inspection.

A failure must **not** be classified as `STALE_LOCATOR` if:

- The feature is broken.
- The app returns an error.
- The app redirects unexpectedly.
- The user flow no longer exists.
- The assertion expected behavior that the app no longer provides.
- Fixing the test would weaken coverage.
- The only way to pass is to remove or loosen an assertion.

### Step 3: Repair stale locators only

If and only if a failure is classified as `STALE_LOCATOR`:

1. Modify only the affected locator in the relevant `.spec.ts` file.
2. Keep the same test purpose.
3. Keep the same assertion intent.
4. Make the smallest possible change.
5. Document the change in `ui-tests.md`.

Examples of allowed changes:

~~~ts
page.locator('#submit')
~~~

to:

~~~ts
page.getByRole('button', { name: /submit|save|guardar/i })
~~~

or:

~~~ts
page.getByText('Get started')
~~~

to:

~~~ts
page.getByRole('link', { name: /get started/i })
~~~

Examples of forbidden changes:

~~~ts
await expect(page.getByText('User created')).toBeVisible()
~~~

to:

~~~ts
await expect(page).toHaveURL(/.*/)
~~~

or:

~~~ts
test.skip(...)
~~~

or deleting an assertion.

### Step 4: Re-run tests

After any safe locator repair, re-run:

```bash
npx playwright test
```

Repeat the analyze/repair/re-run cycle up to **3 total test runs**.

Do not loop forever.

Maximum allowed runs:

1. Initial run
2. Re-run after first locator repair
3. Final re-run after second locator repair

If the suite still fails after 3 total runs, stop and document the remaining failures.

### Step 5: Write `ui-tests.md`

Always create or overwrite `ui-tests.md`.

Use this structure:

~~~md
# UI Test Report

## Summary

- Command run: `npx playwright test`
- Final result: PASSED or FAILED
- Date/time: <current date/time>
- Total Playwright runs: <number>
- Final exit code: <exit code>

## Tests Run

| # | Project | Test File | Test Name | Status |
|---|---------|-----------|-----------|--------|

If the exact table cannot be reconstructed from the Playwright output, provide the best available summary.

## Failure Classification

| Test File | Test Name | Classification | Action Taken |
|----------|-----------|----------------|--------------|

Classification values:

- `STALE_LOCATOR`
- `APPLICATION_BUG`
- `TEST_DATA_ISSUE`
- `AUTH_SESSION_ISSUE`
- `ENVIRONMENT_ISSUE`
- `UNKNOWN_FAILURE`

## Locator Repairs Applied

If no locator repairs were applied, write:

No locator repairs applied.

If locator repairs were applied, document each one:

### Locator Repair 1

- Test file:
- Test name:
- Original locator:
- New locator:
- Reason:
- Why this did not change test intent:

## Failures

If there were no failures, write:

No failures detected.

If there were failures, create one section per failure:

### Failure 1: <test name or scenario>

**Classification:**
`APPLICATION_BUG`, `TEST_DATA_ISSUE`, `AUTH_SESSION_ISSUE`, `ENVIRONMENT_ISSUE`, or `UNKNOWN_FAILURE`

**Expected behavior:**
Describe what the test expected.

**Actual behavior:**
Describe what actually happened.

**Root cause:**
Explain the most likely root cause based on the Playwright logs, errors, screenshots, traces, failed requests, or assertions.

**Steps to reproduce:**
1. Run `npx playwright test`
2. Open the affected page or flow
3. Describe the user actions needed to reproduce the issue

**Relevant error/log excerpt:**
Include the important part of the Playwright failure output.

## Playwright Artifacts

Mention any useful generated artifacts:

- HTML report:
- Trace:
- Screenshot:
- Video:
- Test results directory:

## Final QA Decision

Write one of:

```text
QA PASSED
```

or:

```text
QA FAILED
```

If QA failed, briefly explain why.
~~~

## Final response

After writing `ui-tests.md`, read it back and respond with only one of these formats:

If passed:

```text
QA PASSED. Report written to ui-tests.md.
```

If failed:

```text
QA FAILED. Report written to ui-tests.md.

Failures:
1. <short failure summary>
2. <short failure summary>
```

Do not paste the full report in the chat unless explicitly requested.

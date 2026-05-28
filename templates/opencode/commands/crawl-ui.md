---
description: Crawl the Vue app UI and generate a structured Playwright testing inventory.
agent: crawl-qa
model: opencode-go/qwen3.6-plus
---

Explore the remote Vue application using Playwright and create a structured UI testing inventory.

Use the existing Playwright setup and run the exploration against the configured base URL.

Goal:
Discover useful routes, pages, navigation paths, forms, buttons, links, tables, dialogs, validation messages, and safe candidate flows that can later be converted into Playwright tests.

Rules:

1. Do **not** modify application source files.
2. Do **not** modify existing test files.
3. Do **not** create new Playwright test files in this command.
4. Do **not** change Playwright configuration unless it is required only to read the current setup.
5. Use the existing authenticated session if available.
6. Navigate through the app like a real user.
7. Prefer semantic selectors when documenting elements:
   - `getByRole`
   - `getByLabel`
   - `getByText`
   - `getByPlaceholder`
8. Avoid brittle CSS selectors unless no semantic selector exists.
9. Avoid destructive actions such as:
   - delete
   - remove
   - approve
   - reject
   - submit final
   - cancel subscription
   - irreversible save/update operations
10. If a destructive action is found, document it but do not execute it.
11. Capture console errors, failed requests, broken links, unexpected redirects, and visible UI errors.
12. Always create or overwrite a local file named `ui-crawl-report.md`.

The final output must be only the file `ui-crawl-report.md`.

Use this structure:

```md
# UI Crawl Report

## Summary

- Base URL:
- Date/time:
- Authenticated session used: yes/no
- Total pages/routes discovered:
- Total candidate test flows:
- Crawl result: COMPLETED / PARTIAL / FAILED

## Routes Discovered

| Route | Page title / heading | Status | Notes |
|------|----------------------|--------|-------|

## Navigation Map

Document how pages link to each other.

Example:

- `/dashboard`
  - Link: Users -> `/users`
  - Link: Settings -> `/settings`

## Pages

Create one section per discovered page.

### Page: <page name>

- Route:
- Main heading:
- Purpose:
- Important visible elements:
  - Buttons:
  - Links:
  - Forms:
  - Tables/lists:
  - Dialogs/modals:
- Required authentication: yes/no
- Empty/loading/error states observed:
- Risky/destructive actions found:

## Forms

Create one section per discovered form.

### Form: <form name>

- Route:
- Fields:
  - `<field label/name>`: text/select/checkbox/date/etc.
- Required fields:
- Submit button:
- Validation messages observed:
- Safe test cases:
  - Empty submit validation
  - Invalid input validation
  - Successful submit only if non-destructive and safe

## Candidate Test Flows

Create one section per useful candidate test.

### Flow 1: <flow name>

**Purpose:**
What this test should prove.

**Steps:**
1. Go to `<route>`
2. Click `<element>`
3. Assert `<expected result>`

**Recommended assertions:**
- URL assertion:
- Heading/text assertion:
- State assertion:

**Suggested test file:**
`tests/<name>.spec.ts`

**Risk level:**
Safe / Needs test data / Destructive - do not automate without approval

## Accessibility / Selector Notes

List stable selectors that should be preferred:

- Role selectors:
- Label selectors:
- Text selectors:
- Placeholder selectors:
- Text selectors:
- Test IDs if found:

## Issues Found During Crawl

Document broken links, console errors, failed requests, missing pages, or unexpected UI states.

### Issue 1: <summary>

**Route:**
**Observed behavior:**
**Expected behavior:**
**Evidence/log excerpt:**

## Recommended Next Tests

Prioritize the first tests that should be implemented.

1. Smoke test:
2. Authentication/session test:
3. Navigation test:
4. Form validation test:
5. Main business-flow test:

## Notes

Mention any limitations, skipped areas, authentication problems, missing test data, or routes that could not be safely explored.


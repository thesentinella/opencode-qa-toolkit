# QA Workflow

## Overview

The opencode-qa-toolkit provides a phased QA workflow for Vue/admin applications tested with Playwright.

Each phase has a dedicated OpenCode command. Phases build on each other but can also be used independently.

## Phases

### Phase 1: Crawl

Command: `/crawl-ui`

Discover the UI. Navigate through the application, document routes, pages, forms, navigation, and candidate test flows.

Output: `ui-crawl-report.md`

When to use:

- Starting QA for a new application.
- The application has changed significantly.
- New routes or modules were added.

### Phase 2: Generate initial tests

Command: `/generate-ui-tests`

Read the crawl report and produce initial Playwright tests covering smoke checks, navigation, and basic page presence.

Output: `tests/*.spec.ts`, `ui-tests.md`

When to use:

- A crawl report already exists.
- You need a first version of the test suite.
- You want to bootstrap quickly.

### Phase 3: Run QA

Command: `/qa`

Run the Playwright suite. Classify failures. Repair stale locators when safe. Re-run up to 3 times total. Write a structured report.

Output: `ui-tests.md`

When to use:

- After generating or updating tests.
- After application changes that may require locator repairs.
- As a regular CI or daily QA check.

### Phase 4: Add deeper tests

Command: `/generate-deep-ui-tests`

Add behavior-focused tests for validations, modals, filters, detail pages, empty states, loading states, and error states.

Output: `tests/*-flows.spec.ts`, `deep-ui-tests.md`

When to use:

- Basic tests already exist and pass.
- You want better coverage beyond page presence.
- You want to validate real UI behavior.

### Phase 5: Functional QA

Command: `/functional-test`

Run a functional QA pass using the `functional-qa` agent. Design and execute tests that validate real product behavior, not only UI presence.

Output: `tests/functional/*.spec.ts`, `functional-tests.md`

When to use:

- You want tests that validate real user workflows.
- You need to check authentication, permissions, forms, and data consistency.
- You want to document manual test candidates for destructive flows.

### Phase 6 (optional): Smoke test

Command: `/smoke-test`

Run a fast subset of critical-path tests. No repair loop. Quick pass/fail.

Output: `smoke-test-report.md`

When to use:

- CI pipeline needs a fast gate.
- Pre-merge validation.
- Quick sanity check before a full QA run.

### Phase 7 (optional): API test

Command: `/api-test`

Generate and run Playwright API tests using `request` context. Validate backend endpoints independently of the UI.

Output: `tests/api/*.spec.ts`, `api-test-report.md`

When to use:

- You need backend contract testing separate from UI tests.
- You want to validate API responses, status codes, and data shapes.
- You want faster feedback on backend changes.

### Phase 8 (optional): Accessibility test

Command: `/a11y-test`

Run accessibility checks using axe-core integration with Playwright.

Output: `a11y-report.md`

When to use:

- You need WCAG compliance validation.
- You want to catch a11y regressions early.
- Compliance or audit requirements exist.

### Phase 9 (optional): Visual regression

Command: `/visual-regression`

Capture and compare screenshots to detect visual regressions.

Output: `visual-regression-report.md`

When to use:

- UI styling or layout changed.
- You need to verify visual consistency across releases.
- Design system or component library validation.

## Typical sequences

New project:

```text
/crawl-ui -> /generate-ui-tests -> /qa -> /generate-deep-ui-tests -> /functional-test -> /qa
```

Daily QA:

```text
/qa
```

Pre-merge in CI:

```text
/smoke-test
```

After significant UI change:

```text
/crawl-ui -> /generate-ui-tests -> /qa
```

Expanding coverage:

```text
/generate-deep-ui-tests -> /functional-test -> /qa
```

Backend validation:

```text
/api-test
```

Accessibility audit:

```text
/a11y-test
```

Visual validation:

```text
/visual-regression
```

## Agent selection

| Command | Agent | Purpose |
|---------|-------|---------|
| `/crawl-ui` | `crawl-qa` | Discover UI structure |
| `/generate-ui-tests` | `build` | Generate initial tests |
| `/qa` | `build` | Run QA and repair locators |
| `/generate-deep-ui-tests` | `build` | Add behavior-focused tests |
| `/functional-test` | `functional-qa` | Validate real product behavior |
| `/smoke-test` | `smoke-qa` | Fast critical-path validation |
| `/api-test` | `build` | API contract testing |
| `/a11y-test` | `build` | Accessibility validation |
| `/visual-regression` | `build` | Visual screenshot comparison |
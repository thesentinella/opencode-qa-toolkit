# Reports Reference

## Overview

Each QA command produces a structured markdown report. Reports are written to the target project root directory.

## Report files

| Report | Command | Purpose |
|--------|---------|---------|
| `ui-crawl-report.md` | `/crawl-ui` | Discovered routes, pages, forms, and candidate flows |
| `ui-tests.md` | `/qa` or `/generate-ui-tests` | Test execution results, failure classification, locator repairs |
| `deep-ui-tests.md` | `/generate-deep-ui-tests` | Deep UI test coverage, areas covered, candidate flows not automated |
| `functional-tests.md` | `/functional-test` | Functional QA results, coverage, manual test candidates |
| `smoke-test-report.md` | `/smoke-test` | Quick pass/fail for critical paths |
| `api-test-report.md` | `/api-test` | API test results, endpoint coverage, response validation |
| `a11y-report.md` | `/a11y-test` | Accessibility violations, WCAG criteria, remediation notes |
| `visual-regression-report.md` | `/visual-regression` | Screenshot diff results, visual changes detected |

## Common sections

All reports include:

- Summary with date/time, command, and overall result.
- Test list or coverage overview.
- Failure classification when applicable.
- Artifacts reference (HTML report, traces, screenshots).
- Notes on gaps, missing data, or recommendations.

## Failure classification

Reports use a consistent failure taxonomy:

| Classification | Meaning |
|---------------|---------|
| `STALE_LOCATOR` | Locator no longer matches; app still works |
| `APPLICATION_BUG` | Test correctly caught a real product issue |
| `TEST_DATA_ISSUE` | Missing or incorrect test data |
| `AUTH_SESSION_ISSUE` | Login or storage state problem |
| `ENVIRONMENT_ISSUE` | App or API unavailable |
| `UNKNOWN_FAILURE` | Cannot confidently classify |

## QA verdict

Each report ends with one of:

- **QA PASSED** — all tests pass.
- **QA FAILED** — one or more tests failed with non-recoverable issues.
- **QA PARTIAL** — some areas covered, gaps remain.

## Report storage

Reports are markdown files written to the project root. They should be committed when they provide useful history, but they can also be regenerated at any time by re-running the corresponding command.

Add to `.gitignore` if you prefer not to track them. A ready-made `.gitignore` template is available at `examples/playwright/gitignore.example`:

```gitignore
ui-crawl-report.md
ui-tests.md
deep-ui-tests.md
functional-tests.md
smoke-test-report.md
api-test-report.md
a11y-report.md
visual-regression-report.md
```
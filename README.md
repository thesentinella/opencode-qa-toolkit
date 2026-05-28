# opencode-qa-toolkit

Reusable QA commands and agents for OpenCode using Playwright.

This repository started as part of the QA automation workflow for **Sentinella Hub**. It provides reusable templates for adding structured UI and functional QA workflows to application repositories.

It is designed mainly for Vue/admin applications tested with Playwright, but the same approach can be adapted to other frontend apps.

> This project is not built by, endorsed by, or affiliated with the OpenCode team. It is an independent toolkit that provides reusable OpenCode commands and agent prompts.

## Background

This toolkit was created while building and validating the QA workflow for **Sentinella Hub**.

As the application grew, simple smoke tests were no longer enough. Checking that a page loads or that a heading is visible does not prove that the product works. Sentinella Hub needed a repeatable way to validate real UI behavior: authentication, protected routes, navigation, forms, modals, tables, filters, error states, and role-based flows.

The first Playwright tests covered basic route loading, sidebar navigation, cluster detail pages, alerts, team tables, and 404 pages. That gave us a useful baseline, but it also exposed the next problem: QA needed to become more structured without turning every test update into manual work.

This repository exists to solve that problem.

`opencode-qa-toolkit` provides a reusable OpenCode workflow for progressively improving QA coverage:

1. Crawl the application and document what exists.
2. Generate initial Playwright tests from the discovered UI.
3. Run QA consistently and produce a clear report.
4. Add deeper tests for real behavior.
5. Use a functional QA agent to reason about flows, gaps, and risks.

The goal is not to replace human QA or product judgment. The goal is to make QA more systematic, repeatable, and easier to expand as Sentinella Hub and similar applications evolve.

Although this toolkit started from the needs of Sentinella Hub, it is intentionally generic enough to be reused in other Vue, React, or admin-style frontend projects that use Playwright and OpenCode.

## What this repository provides

`opencode-qa-toolkit` contains reusable templates for:

* Crawling a UI and documenting discovered routes, forms, navigation, and candidate flows.
* Generating initial Playwright tests from a crawl report.
* Running Playwright QA and writing a consistent `ui-tests.md` report.
* Generating deeper UI tests for validations, modals, filters, detail pages, and error states.
* Running functional QA through a dedicated OpenCode agent.
* Documenting test coverage, gaps, failures, and manual test candidates.

The main idea is to separate QA into clear phases:

```text
crawl -> generate tests -> run QA -> deepen coverage -> functional QA
```

## Repository layout

This repository is **not** meant to be used directly as an OpenCode project.

The reusable OpenCode files live under `templates/opencode/`. When you want to use them in an application repository, copy them into that app’s `.opencode/` directory.

Recommended structure:

```text
opencode-qa-toolkit/
  README.md
  AGENTS.md

  templates/
    opencode/
      agents/
        functional-qa.md
        smoke-qa.md
        crawl-qa.md
      commands/
        crawl-ui.md
        generate-ui-tests.md
        qa.md
        generate-deep-ui-tests.md
        functional-test.md
        smoke-test.md
        api-test.md
        a11y-test.md
        visual-regression.md

  examples/
    playwright/
      auth.setup.ts
      playwright.config.ts
      package-scripts.json
      gitignore.example
      helpers/
        auth.ts
        navigation.ts
        forms.ts
        api.ts

  docs/
    workflow.md
    reports.md
    test-strategy.md

  scripts/
    install.sh
```

## Why `templates/opencode/` instead of `.opencode/`?

Because this is a toolkit repository.

A `.opencode/` directory is project-specific configuration. If this repo had its own `.opencode/` directory, OpenCode would treat these commands and agents as active for the toolkit repo itself, which is not the goal.

The correct model is:

```text
opencode-qa-toolkit/templates/opencode/
```

gets copied into:

```text
target-app/.opencode/
```

## Installation into a target project

From inside the target application repository:

```bash
mkdir -p .opencode
cp -R ../opencode-qa-toolkit/templates/opencode/* .opencode/
```

Or use the install script which also sets up `.gitignore` entries:

```bash
./scripts/install.sh /path/to/target-app
```

Then create a `.env` file in the target project:

```bash
TEST_ENV_URL=https://hub.sentinel.la
TEST_USER=<USER>
TEST_PASSWORD=<PASSWORD>
```

The target app should have:

```text
your-app/
  .opencode/
    agents/
      functional-qa.md
      smoke-qa.md
      crawl-qa.md
    commands/
      crawl-ui.md
      generate-ui-tests.md
      qa.md
      generate-deep-ui-tests.md
      functional-test.md
      smoke-test.md
      api-test.md
      a11y-test.md
      visual-regression.md
```

## Optional install script

```text
scripts/install.sh
```

The script copies templates into `.opencode/` and appends Playwright-related entries to the target project's `.gitignore`.

Usage from inside `opencode-qa-toolkit`:

```bash
./scripts/install.sh /path/to/target-app
```

Usage from inside the target app:

```bash
/path/to/opencode-qa-toolkit/scripts/install.sh .
```

## Requirements in the target project

The target project should have:

* Node.js.
* Playwright.
* OpenCode.
* A working `playwright.config.ts`.
* A reachable local or remote app URL.
* Test credentials in a `.env` file.

Create a `.env` file in the target project root:

```bash
TEST_ENV_URL=https://hub.sentinel.la
TEST_USER=<USER>
TEST_PASSWORD=<PASSWORD>
```

Optionally, add `SWAGGER_URL` so the functional-test agent can discover API endpoints:

```bash
SWAGGER_URL=https://hub.sentinel.la/api/docs
```

If role-based tests are needed, add additional variables as needed:

```bash
TEST_ADMIN_USER=<ADMIN_USER>
TEST_ADMIN_PASSWORD=<ADMIN_PASSWORD>
```

## Recommended Playwright setup

A typical setup uses one authentication project to save browser storage state, then reuses that state in other tests.

Example `tests/auth.setup.ts`:

```ts
import { test as setup, expect } from '@playwright/test';
import { mkdirSync } from 'fs';
import { dirname } from 'path';
import { STORAGE_STATE } from '../playwright.config';

setup('authenticate', async ({ page }) => {
  const testUser = process.env.TEST_USER;
  const testPassword = process.env.TEST_PASSWORD;

  if (!testUser || !testPassword) {
    throw new Error('Missing TEST_USER or TEST_PASSWORD environment variable');
  }

  mkdirSync(dirname(STORAGE_STATE), { recursive: true });

  await page.goto('/');

  await page.fill('input[type="email"]', testUser);
  await page.fill('input[type="password"]', testPassword);
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/\/admin(\/.*)?$/);

  await page.context().storageState({ path: STORAGE_STATE });
});
```

Example `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export const STORAGE_STATE = 'playwright/.auth/user.json';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',

  use: {
    baseURL: process.env.TEST_ENV_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
    },
  ],
});
```

## Commands included

### `/crawl-ui`

Discovers the UI structure and writes a report.

Output:

```text
ui-crawl-report.md
```

Use it when:

* Starting QA for a new app.
* The app changed significantly.
* New modules or routes were added.
* You want OpenCode to inspect the app before generating tests.

This command should only observe and document. It should not create tests.

### `/generate-ui-tests`

Reads `ui-crawl-report.md` and creates initial Playwright tests.

Output:

```text
tests/*.spec.ts
ui-tests.md
```

Use it when:

* A crawl report already exists.
* You want to bootstrap smoke, navigation, and page-level tests.
* You want a fast first version of the test suite.

This command should avoid destructive actions and should not invent business rules.

### `/qa`

Runs Playwright and writes the QA result report.

Output:

```text
ui-tests.md
```

It runs:

```bash
npx playwright test
```

It can repair stale Playwright locators only when the failure is clearly caused by a changed selector, text, role, label, placeholder, or DOM structure.

It must not:

* Modify application source code.
* Skip tests to force success.
* Weaken assertions.
* Change test intent.
* Hide failures.

### `/generate-deep-ui-tests`

Generates deeper UI tests.

Output:

```text
deep-ui-tests.md
tests/*-flows.spec.ts
```

Use it when basic tests already exist and you want better coverage around:

* Forms.
* Validation.
* Modals.
* Filters.
* Tables.
* Detail pages.
* Empty states.
* Loading states.
* Error states.
* Permissions.

This command should not generate more shallow heading-only tests.

### `/functional-test`

Runs a functional QA pass using the `functional-qa` agent.

Output:

```text
functional-tests.md
tests/functional/*.spec.ts
```

Use it when you want tests that validate actual product behavior instead of simple UI presence.

Examples:

* Invalid login shows an error.
* Protected routes redirect when unauthenticated.
* Invite modal opens and validates required fields.
* Canceling a modal does not change state.
* A detail page shows data consistent with the selected item.
* Filters change the visible list.
* Restricted users cannot see privileged actions.

### `/smoke-test`

Runs a fast subset of critical-path tests with no repair loop. Quick pass/fail for CI.

Output:

```text
smoke-test-report.md
```

Use it when:

* CI pipeline needs a fast gate before merge.
* You need a quick sanity check.
* You want to verify a deployment without a full QA run.

This command does not create tests, repair locators, or re-run. It reports results immediately.

### `/api-test`

Generates and runs Playwright API tests using the `request` context.

Output:

```text
tests/api/*.spec.ts
api-test-report.md
```

Use it when:

* You need backend contract testing separate from UI tests.
* You want to validate API responses, status codes, and data shapes.
* You want faster feedback on backend changes.

### `/a11y-test`

Runs accessibility checks using axe-core integration with Playwright.

Output:

```text
tests/a11y/*.spec.ts
a11y-report.md
```

Use it when:

* You need WCAG compliance validation.
* You want to catch accessibility regressions.
* Compliance or audit requirements exist.

### `/visual-regression`

Captures and compares screenshots to detect visual regressions.

Output:

```text
tests/visual/*.spec.ts
visual-regression-report.md
```

Use it when:

* UI styling or layout changed.
* You need to verify visual consistency across releases.
* Design system or component library validation is needed.

## Recommended workflow

For a new target project:

```text
/crawl-ui
/generate-ui-tests
/qa
/generate-deep-ui-tests
/functional-test
/qa
```

For daily QA:

```text
/qa
```

For pre-merge CI:

```text
/smoke-test
```

When the UI changed significantly:

```text
/crawl-ui
/generate-ui-tests
/qa
```

When you want better coverage:

```text
/generate-deep-ui-tests
/functional-test
/qa
```

For backend validation:

```text
/api-test
```

For accessibility audit:

```text
/a11y-test
```

For visual validation:

```text
/visual-regression
```

## Command responsibilities

### Crawl phase

Command:

```text
/crawl-ui
```

Responsibilities:

* Discover routes.
* Discover navigation.
* Discover pages.
* Discover forms.
* Discover buttons, links, tables, dialogs, and visible states.
* Document candidate test flows.
* Avoid destructive actions.
* Write `ui-crawl-report.md`.

Should not:

* Create tests.
* Modify source code.
* Modify existing tests.

### Test generation phase

Command:

```text
/generate-ui-tests
```

Responsibilities:

* Read `ui-crawl-report.md`.
* Generate safe Playwright tests.
* Prefer semantic locators.
* Avoid destructive workflows.
* Run Playwright.
* Write `ui-tests.md`.

Should not:

* Invent business rules.
* Duplicate existing tests.
* Skip tests to force success.

### QA execution phase

Command:

```text
/qa
```

Responsibilities:

* Run `npx playwright test`.
* Capture output.
* Write `ui-tests.md`.
* Classify failures.
* Repair stale locators only when safe.
* Re-run up to a controlled limit.

Should not:

* Generate new tests.
* Modify app code.
* Weaken assertions.
* Hide failures.

### Deep UI phase

Command:

```text
/generate-deep-ui-tests
```

Responsibilities:

* Add meaningful behavior tests.
* Focus on validation, modals, filters, detail pages, empty states, and API/UI consistency.
* Write `deep-ui-tests.md`.

Should not:

* Generate shallow heading-only tests.
* Automate destructive flows.
* Depend on fragile CSS selectors when avoidable.

### Functional QA phase

Command:

```text
/functional-test
```

Responsibilities:

* Use the `functional-qa` agent.
* Design functional tests.
* Create or update tests under `tests/functional/`.
* Run functional tests.
* Write `functional-tests.md`.

Should not:

* Modify production code.
* Execute destructive actions.
* Skip tests to force a pass.
* Pretend partial coverage is complete.

### Smoke test phase

Command:

```text
/smoke-test
```

Responsibilities:

* Use the `smoke-qa` agent.
* Run tests tagged `@smoke` if they exist, otherwise run the full suite.
* Report pass/fail immediately.
* Write `smoke-test-report.md`.

Should not:

* Create new tests.
* Repair locators.
* Re-run failed tests.

### API test phase

Command:

```text
/api-test
```

Responsibilities:

* Create Playwright API tests using the `request` context.
* Validate status codes, response shapes, authentication requirements, and error formats.
* Run API tests.
* Write `api-test-report.md`.

Should not:

* Test destructive API endpoints.
* Modify application source files.

### Accessibility test phase

Command:

```text
/a11y-test
```

Responsibilities:

* Use axe-core to scan pages for WCAG violations.
* Check keyboard navigation, ARIA labels, color contrast.
* Document violations with remediation guidance.
* Write `a11y-report.md`.

Should not:

* Fix accessibility issues in the application — only report them.

### Visual regression phase

Command:

```text
/visual-regression
```

Responsibilities:

* Capture screenshots of key pages.
* Compare against baseline screenshots.
* Report visual differences.
* Write `visual-regression-report.md`.

Should not:

* Update baselines automatically — changes must be reviewed.

## Reports generated

### `ui-crawl-report.md`

Generated by:

```text
/crawl-ui
```

Contains:

* Routes discovered.
* Navigation map.
* Pages.
* Forms.
* Candidate test flows.
* Selector notes.
* Issues found.
* Recommended next tests.

### `ui-tests.md`

Generated by:

```text
/qa
```

Contains:

* Command run.
* Final result.
* Test list.
* Failure classification.
* Locator repairs applied.
* Playwright artifacts.
* Final QA decision.

### `deep-ui-tests.md`

Generated by:

```text
/generate-deep-ui-tests
```

Contains:

* New tests added.
* Areas covered.
* Candidate flows not automated.
* Failures.
* Notes about missing selectors or missing test data.

### `functional-tests.md`

Generated by:

```text
/functional-test
```

Contains:

* Functional coverage.
* Tests added or updated.
* Tests run.
* Failures.
* Manual test candidates.
* Risks and gaps.

### `smoke-test-report.md`

Generated by:

```text
/smoke-test
```

Contains:

* Date/time.
* Command run.
* Result: PASSED or FAILED.
* Tests run.
* Failures with error details.
* Merge recommendation.

### `api-test-report.md`

Generated by:

```text
/api-test
```

Contains:

* Endpoints tested.
* Status codes and response validation results.
* Authentication requirement verification.
* Destructive endpoints not tested.
* Gaps and recommendations.

### `a11y-report.md`

Generated by:

```text
/a11y-test
```

Contains:

* Pages scanned.
* Violations by impact level (critical, serious, moderate, minor).
* WCAG criteria violated.
* Remediation guidance.
* Manual test candidates.

### `visual-regression-report.md`

Generated by:

```text
/visual-regression
```

Contains:

* Pages captured.
* Comparison results (matched, different, new baseline).
* Visual differences with descriptions.
* Update recommendations for baselines.

## Testing philosophy

Avoid shallow tests that only verify page presence.

Weak tests:

```text
- Page title exists.
- Heading is visible.
- Button exists.
```

Better tests:

```text
- Invalid login shows a visible error.
- Protected routes redirect when unauthenticated.
- User can open a modal and cancel without changing state.
- Required fields show validation errors.
- Filters change visible data.
- Detail page data matches the selected list item.
- Empty, error, and loading states are handled correctly.
- Restricted users cannot access privileged actions.
```

## Locator strategy

Prefer semantic locators:

```ts
page.getByRole('button', { name: /save|guardar/i })
page.getByLabel(/email/i)
page.getByText(/alerts|alertas/i)
page.getByPlaceholder(/search|buscar/i)
page.getByTestId('invite-member-button')
```

Avoid brittle selectors:

```ts
page.locator('.btn-primary > div:nth-child(2)')
page.locator('#app > div > aside > ul > li:nth-child(3)')
```

## Recommended `data-testid` conventions

For stable functional tests, add explicit test IDs in the app.

Examples:

```html
<button data-testid="invite-member-button">
  Invitar miembro
</button>

<form data-testid="invite-member-form">
  ...
</form>

<table data-testid="team-members-table">
  ...
</table>

<div data-testid="cluster-card">
  ...
</div>
```

Then in Playwright:

```ts
await page.getByTestId('invite-member-button').click();
await expect(page.getByTestId('invite-member-form')).toBeVisible();
```

## Safety rules

The QA tools must not automate destructive UI actions on real production data.

Do not automate through the UI:

```text
- Delete user
- Remove cluster
- Revoke permission
- Approve final action
- Reject final action
- Cancel subscription
- Submit irreversible workflow
```

If such flows exist, document them as manual test candidates.

API-based test data setup and teardown is allowed and encouraged. Use Playwright's `request` fixture to create resources before tests and delete them after. See [Test data management](#test-data-management) below.

## `.env` and `.gitignore` setup

Create a `.env` file in the target project root with the required variables:

```bash
TEST_ENV_URL=https://hub.sentinel.la
TEST_USER=<USER>
TEST_PASSWORD=<PASSWORD>
```

Add QA reports and Playwright artifacts to `.gitignore`. A ready-made template is available at `examples/playwright/gitignore.example` or can be appended automatically by `scripts/install.sh`.

## Test data management

Functional tests often need data that does not already exist in the system. Instead of creating data through the UI (which would be destructive), use Playwright's `request` fixture to create and delete resources via the API.

### Pattern: seed via API, test via UI, clean up via API

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

### Discovering the API

The functional-test agent discovers how to create and delete resources by checking:

1. **`SWAGGER_URL` environment variable** — if set, reads the OpenAPI/Swagger spec from that URL.
2. **Local API documentation files** — checks for `openapi.yaml`, `openapi.json`, `swagger.yaml`, or `swagger.json` in the project root or `docs/` directory.
3. **Asks the user** — if no API documentation is available, asks which resources can be created and deleted for testing, and what endpoints and payloads to use.

### When to ask the user

The agent should ask the user when:

- No API documentation is available (no `SWAGGER_URL` and no local spec files).
- It cannot determine which resources are safe to create and delete.
- It needs clarification on endpoint paths or payload shapes.

Generic API helpers are available in `examples/playwright/helpers/api.ts`.

## Failure classification

Failures should be classified as:

```text
STALE_LOCATOR
APPLICATION_BUG
TEST_DATA_ISSUE
AUTH_SESSION_ISSUE
ENVIRONMENT_ISSUE
UNKNOWN_FAILURE
```

### `STALE_LOCATOR`

Use only when:

* The app still works.
* The test intent is valid.
* The UI changed.
* A locator no longer matches.
* A better semantic locator exists.

### `APPLICATION_BUG`

Use when:

* The feature is broken.
* The app shows an error.
* The expected behavior does not occur.
* The test correctly caught a product issue.

### `TEST_DATA_ISSUE`

Use when:

* Required data is missing.
* Expected records do not exist.
* The test depends on unavailable seeded data.

### `AUTH_SESSION_ISSUE`

Use when:

* Login failed.
* Storage state expired.
* The user was redirected to login unexpectedly.

### `ENVIRONMENT_ISSUE`

Use when:

* The app is unavailable.
* API/backend is down.
* Network requests fail due to environment problems.

### `UNKNOWN_FAILURE`

Use when:

* The failure cannot be confidently classified.
* More investigation is required.

## Recommended package scripts for target apps

The `examples/playwright/package-scripts.json` file contains npm scripts that should be merged into the target project's `package.json` (it is not a standalone config file).

In the target application, these scripts are useful:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:functional": "playwright test tests/functional",
    "test:e2e:api": "playwright test tests/api",
    "test:e2e:a11y": "playwright test tests/a11y",
    "test:e2e:visual": "playwright test tests/visual",
    "test:e2e:smoke": "playwright test --grep @smoke",
    "test:e2e:report": "playwright show-report"
  }
}
```

## Recommended test directory structure

```text
tests/
  auth.setup.ts                 # Authentication setup (storage state)
  smoke.spec.ts                 # Smoke tests (@smoke tag)
  navigation.spec.ts            # Navigation tests
  forms.spec.ts                 # Form validation tests
  authenticated-flows.spec.ts   # Authenticated user flows
  *-flows.spec.ts               # Deep UI test files
  functional/                   # Functional test files
    auth.functional.spec.ts
    team.functional.spec.ts
    clusters.functional.spec.ts
    alerts.functional.spec.ts
    roles.functional.spec.ts
    profile.functional.spec.ts
  api/                          # API test files
    auth.api.spec.ts
    teams.api.spec.ts
    clusters.api.spec.ts
    alerts.api.spec.ts
  a11y/                         # Accessibility test files
    pages.a11y.spec.ts
  visual/                       # Visual regression test files
    pages.visual.spec.ts
```

## Example usage

Start OpenCode from the target application repository:

```bash
opencode
```

Run the initial crawl:

```text
/crawl-ui
```

Generate basic tests:

```text
/generate-ui-tests
```

Run QA:

```text
/qa
```

Generate deeper tests:

```text
/generate-deep-ui-tests
```

Run functional QA:

```text
/functional-test
```

Run QA again:

```text
/qa
```

## Suggested command files

The toolkit should provide these files:

```text
templates/opencode/commands/crawl-ui.md
templates/opencode/commands/generate-ui-tests.md
templates/opencode/commands/qa.md
templates/opencode/commands/generate-deep-ui-tests.md
templates/opencode/commands/functional-test.md
templates/opencode/commands/smoke-test.md
templates/opencode/commands/api-test.md
templates/opencode/commands/a11y-test.md
templates/opencode/commands/visual-regression.md
```

## Suggested agent files

The toolkit should provide:

```text
templates/opencode/agents/functional-qa.md
templates/opencode/agents/smoke-qa.md
templates/opencode/agents/crawl-qa.md
```

## Versioning recommendation

Use conventional commits:

```text
feat: add functional qa agent
feat: add qa command
feat: add crawl-ui command
fix: tighten stale locator repair rules
docs: add usage workflow
```

## What this toolkit is not

This toolkit is not:

* A replacement for product requirements.
* A replacement for manual exploratory QA.
* A guarantee that generated tests are correct.
* A tool that should blindly modify tests until they pass.
* A reason to accept weak tests.

Generated tests must still be reviewed.

## Recommended review checklist

Before accepting generated tests, check:

```text
- Do the tests validate real behavior?
- Are assertions meaningful?
- Are selectors stable?
- Are destructive flows avoided?
- Are failures honestly reported?
- Are skipped/manual flows documented?
- Are test credentials handled through env vars?
- Are reports committed only when useful?
```

## License

The MIT License (MIT)

Copyright (c) Sentinelle Labs SpA

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

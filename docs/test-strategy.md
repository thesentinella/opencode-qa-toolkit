# Test Strategy

## Goals

- Make QA systematic and repeatable.
- Validate real UI behavior, not only page presence.
- Separate concerns into clear phases: crawl, generate, run, deepen, functional.
- Avoid automating destructive actions; document them as manual test candidates.
- Use semantic locators for test stability.

## Testing philosophy

### Weak tests

Avoid tests that only verify superficial presence:

- Page title exists.
- Heading is visible.
- Button exists.

### Strong tests

Prefer tests that validate real behavior:

- Invalid login shows a visible error.
- Protected routes redirect when unauthenticated.
- User can open a modal and cancel without changing state.
- Required fields show validation errors.
- Filters change visible data.
- Detail page data matches the selected list item.
- Empty, error, and loading states are handled correctly.
- Restricted users cannot access privileged actions.

## Test types

### Smoke tests

Quick validation that critical paths work. Tagged with `@smoke`.

- Application loads.
- Authentication works.
- Main navigation renders.
- Key pages are reachable.

### Navigation tests

- Sidebar links navigate to correct pages.
- Back navigation works.
- Active state reflects current page.

### Form validation tests

- Empty submit shows required field errors.
- Invalid input shows validation messages.
- Cancel does not create or modify data.
- Successful submit works for non-destructive forms.

### Modal behavior tests

- Modal opens on trigger.
- Modal closes on cancel.
- Cancel does not change underlying state.
- Required fields are validated inside the modal.

### Filter and search tests

- Applying filters changes visible data.
- Clearing filters restores original data.
- Search returns matching results.

### Detail page tests

- Detail page opens from list selection.
- Detail page data is consistent with the selected item.
- Invalid ID shows 404 or safe error.

### Role and permission tests

- Admin sees all actions.
- Viewer does not see destructive actions.
- Protected routes redirect unauthorized users.

### API tests

- Endpoints return expected status codes.
- Response shapes match contracts.
- Authentication is required for protected endpoints.
- Error responses are well-structured.

### Accessibility tests

- Pages have no critical WCAG violations.
- Interactive elements are keyboard-navigable.
- ARIA labels and roles are present.
- Color contrast meets minimum ratios.

### Visual regression tests

- Key pages match approved screenshots.
- Component layouts do not shift unexpectedly.
- Responsive breakpoints render correctly.

## Locator strategy

### Preferred

```ts
page.getByRole('button', { name: /save/i })
page.getByLabel(/email/i)
page.getByText(/alerts/i)
page.getByPlaceholder(/search/i)
page.getByTestId('invite-member-button')
```

### Avoid

```ts
page.locator('.btn-primary > div:nth-child(2)')
page.locator('#app > div > aside > ul > li:nth-child(3)')
```

### data-testid conventions

Add explicit test IDs in the app for stable functional tests:

```html
<button data-testid="invite-member-button">Invitar miembro</button>
<form data-testid="invite-member-form">...</form>
<table data-testid="team-members-table">...</table>
```

```ts
await page.getByTestId('invite-member-button').click();
await expect(page.getByTestId('invite-member-form')).toBeVisible();
```

## Safety rules

Never automate destructive actions:

- Delete user
- Remove cluster
- Revoke permission
- Approve final action
- Reject final action
- Cancel subscription
- Submit irreversible workflow

Instead, document these flows as manual test candidates.

## Authentication setup

Use Playwright's storage state pattern to avoid login in every test:

1. `auth.setup.ts` runs once and saves browser state to `playwright/.auth/user.json`.
2. Other test projects depend on the setup project and reuse the saved state.
3. Role-based variants can use separate setup files and storage states configured via additional `.env` variables.

Required environment variables (in `.env`):

- `TEST_ENV_URL` — base URL of the application (e.g. `https://staging.example.com`).
- `TEST_USER` / `TEST_PASSWORD` — standard user credentials.

Role-based testing (optional — add as needed):

- `TEST_ADMIN_USER` / `TEST_ADMIN_PASSWORD` — admin user credentials.
- `TEST_VIEWER_USER` / `TEST_VIEWER_PASSWORD` — viewer/restricted user credentials.

## Failure handling

The `/qa` command classifies failures and repairs stale locators automatically.

Repair is only allowed when:

- The app still works correctly.
- The test intent is still valid.
- A better semantic locator can be identified.

Repair is forbidden when:

- The feature is genuinely broken.
- The app returns an error.
- The only way to pass is to weaken or remove an assertion.

Maximum test runs: 3 (initial + 2 repair re-runs).

## Test file organization

```text
tests/
  auth.setup.ts                 # Authentication setup
  smoke.spec.ts                 # Smoke tests (@smoke)
  navigation.spec.ts           # Navigation tests
  forms.spec.ts                # Form validation tests
  authenticated-flows.spec.ts   # Authenticated user flows
  *-flows.spec.ts              # Deep UI test files
  functional/                  # Functional test files
    auth.functional.spec.ts
    team.functional.spec.ts
    clusters.functional.spec.ts
    alerts.functional.spec.ts
  api/                         # API test files
    auth.api.spec.ts
    teams.api.spec.ts
    clusters.api.spec.ts
```

## CI integration

Tests are executed by OpenCode agents using commands like `/smoke-test` and `/qa`, not by CI pipelines directly. Use `/smoke-test` for fast pre-merge validation and `/qa` for full QA runs.

To run Playwright directly in CI, add npm scripts to the target project and invoke them from your pipeline:

```bash
npm run test:e2e:smoke   # Fast critical-path tests
npm run test:e2e          # Full suite
```
---
description: Run Playwright accessibility tests using axe-core to check for WCAG violations.
agent: build
model: opencode-go/qwen3.6-plus
---

Run accessibility checks on key application pages using axe-core integration with Playwright.

## Objective

Validate that the application meets basic accessibility standards by:

1. Scanning key pages for WCAG violations.
2. Checking keyboard navigation on interactive elements.
3. Verifying ARIA labels, roles, and landmarks.
4. Checking color contrast ratios.
5. Documenting violations with remediation guidance.

## Rules

1. Do **not** modify application source files.
2. Do **not** modify Playwright config unless absolutely required.
3. Use `@axe-core/playwright` or equivalent axe-core integration.
4. If axe-core is not installed, install it as a dev dependency.
5. Create or update accessibility test files under `tests/a11y/`.
6. Do **not** fix accessibility issues in the application — only report them.
7. Run tests and write a clear report.

## Setup

If `@axe-core/playwright` is not already a dependency, add it:

```bash
npm install -D @axe-core/playwright
```

## Test structure

```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('login page has no critical violations', async ({ page }) => {
    await page.goto('/login');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('dashboard has no critical violations', async ({ page }) => {
    await page.goto('/admin');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
```

## Pages to scan

Scan all reachable pages identified in `ui-crawl-report.md` if it exists. At minimum, scan:

- Login page
- Main dashboard
- Each major section (teams, settings, etc.)
- Modal dialogs (open them before scanning)
- Error states
- Form pages

## Execution

After creating tests, run:

```bash
npx playwright test tests/a11y
```

Optionally run the full suite:

```bash
npx playwright test
```

## Required report

Always create or overwrite:

```text
a11y-report.md
```

Use this structure:

```md
# Accessibility Test Report

## Summary

- Date/time:
- Command:
- Result: PASSED / FAILED
- Pages scanned:
- Total violations:
- Critical violations:
- Serious violations:
- Moderate violations:
- Minor violations:

## Pages Scanned

| Page | Route | Critical | Serious | Moderate | Minor |
|------|-------|----------|---------|----------|-------|

## Violations

For each violation, document:

### Violation 1: <rule id>

**Impact:** critical / serious / moderate / minor
**WCAG criterion:**
**Description:**
**Affected elements:**
**Remediation:**

## Manual Test Candidates

List accessibility checks that cannot be automated and require manual verification:

| Check | Page | Notes |
|-------|------|-------|

## Recommendations

- Priority fixes
- Quick wins
- Long-term improvements
```

## Final response

After writing the report, respond with one of:

```text
Accessibility check PASSED. No violations found. Report written to a11y-report.md.
```

```text
Accessibility check FAILED. Violations found. Report written to a11y-report.md.

Critical violations:
1. <short summary>
2. <short summary>
```
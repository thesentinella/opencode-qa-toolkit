---
description: Capture and compare screenshots to detect visual regressions in the Vue admin app.
agent: build
model: opencode-go/qwen3.6-plus
---

Run visual regression tests by capturing screenshots of key pages and comparing them against approved baselines.

## Objective

1. Capture screenshots of key application pages.
2. Compare against existing baseline screenshots.
3. Report visual differences.
4. Update baselines when changes are intentional.

## Rules

1. Do **not** modify application source files.
2. Do **not** modify Playwright config unless absolutely required.
3. Only create or update test files under `tests/visual/`.
4. Use Playwright's built-in screenshot comparison (`toHaveScreenshot()`).
5. Configure reasonable thresholds for anti-aliasing and rendering differences.
6. Do **not** update baselines automatically — changes must be reviewed.
7. Authenticated pages should use existing storage state.

## Playwright config for visual tests

Add a `visual` project to `playwright.config.ts` if not already present:

```ts
{
  name: 'visual',
  use: {
    ...devices['Desktop Chrome'],
    storageState: STORAGE_STATE,
  },
  dependencies: ['setup'],
}
```

And add visual comparison settings:

```ts
expect: {
  toHaveScreenshot: {
    maxDiffPixelRatio: 0.01,
    threshold: 0.2,
  },
},
```

## Test structure

```ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveScreenshot('login.png');
  });

  test('dashboard', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('dashboard.png');
  });

  test('settings page', async ({ page }) => {
    await page.goto('/admin/settings');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('settings.png');
  });
});
```

## Pages to capture

Capture all key pages identified in `ui-crawl-report.md`. At minimum:

- Login page
- Main dashboard
- Each major section page
- Modal dialogs (open before capture)
- Empty states
- Error states (if triggerable without destructive actions)

## Execution

After creating or updating tests, run:

```bash
npx playwright test tests/visual
```

If baselines do not exist yet:

```bash
npx playwright test tests/visual --update-snapshots
```

Then review the generated screenshots before accepting them.

## Required report

Always create or overwrite:

```text
visual-regression-report.md
```

Use this structure:

```md
# Visual Regression Report

## Summary

- Date/time:
- Command:
- Result: MATCHED / DIFFERENCES FOUND / NEW BASELINES
- Pages captured:
- Pages with differences:
- New baselines created:

## Pages Captured

| Page | Route | Status | Diff % | Notes |
|------|-------|--------|--------|-------|

Status values:
- MATCHED — screenshot matches baseline
- DIFFERENT — visual difference detected
- NEW — no baseline existed, screenshot created
- ERROR — page failed to load or capture

## Visual Differences

For each page with differences:

### Difference 1: <page name>

**Route:**
**Baseline screenshot:**
**Current screenshot:**
**Diff image:**
**Difference description:**
**Verdict:** Intentional change / Regression / Needs review

## New Baselines

List pages where no previous baseline existed:

| Page | Route | Screenshot |
|------|-------|------------|

## Recommendations

- Which baselines to accept
- Which differences are regressions
- Which pages need better visual isolation
```

## Final response

After writing the report, respond with one of:

```text
Visual regression PASSED. No differences found. Report written to visual-regression-report.md.
```

```text
Visual regression DIFFERENCES FOUND. Report written to visual-regression-report.md.

Differences:
1. <page>: <summary>
2. <page>: <summary>
```

```text
Visual regression NEW BASELINES. Report written to visual-regression-report.md.

New baselines:
1. <page>
2. <page>
```
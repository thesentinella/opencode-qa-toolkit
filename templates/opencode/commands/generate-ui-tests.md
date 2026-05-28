---
description: Generate Playwright tests from ui-crawl-report.md and write a test result report.
agent: build
model: opencode-go/qwen3.6-plus
---

Read `ui-crawl-report.md` and generate Playwright tests from the safe candidate flows.

Rules:

1. Do **not** modify application source files.
2. Do **not** modify Playwright config unless absolutely required.
3. Only create or update files under `tests/`.
4. Prefer semantic selectors:
   - `getByRole`
   - `getByLabel`
   - `getByText`
   - `getByPlaceholder`
5. Avoid brittle CSS selectors unless no better selector exists.
6. Do not automate destructive workflows.
7. If a candidate flow requires test data that does not exist, skip it and document it.
8. Reuse the existing authenticated session if Playwright is already configured for it.
9. Keep tests small, focused, and readable.
10. Do not generate tests that only assert that a page exists unless that page is part of a smoke test.

Create tests using this naming pattern when applicable:

```text
tests/smoke.spec.ts
tests/navigation.spec.ts
tests/forms.spec.ts
tests/authenticated-flows.spec.ts


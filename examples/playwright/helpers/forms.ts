import { type Page, expect } from '@playwright/test';

export async function fillAndSubmitForm(
  page: Page,
  fields: Record<string, string>,
  submitLabel: string | RegExp = /submit|save|create|add/i,
) {
  for (const [label, value] of Object.entries(fields)) {
    const field = page.getByLabel(new RegExp(label, 'i'));
    await field.fill(value);
  }

  await page.getByRole('button', { name: submitLabel }).click();
}

export async function expectValidationError(page: Page, message: string | RegExp) {
  await expect(page.getByText(message)).toBeVisible();
}

export async function openModal(page: Page, triggerLabel: string | RegExp) {
  await page.getByRole('button', { name: triggerLabel }).click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  return dialog;
}

export async function closeModal(page: Page) {
  const dialog = page.getByRole('dialog');

  await page.getByRole('button', { name: /cancel|close/i }).click();

  await expect(dialog).not.toBeVisible();
}
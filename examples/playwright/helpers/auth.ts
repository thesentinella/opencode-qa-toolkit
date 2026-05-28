import { type Page, expect } from '@playwright/test';

export async function login(page: Page) {
  const testUser = process.env.TEST_USER;
  const testPassword = process.env.TEST_PASSWORD;

  if (!testUser || !testPassword) {
    throw new Error('Missing TEST_USER or TEST_PASSWORD environment variable');
  }

  await page.goto('/login');

  await page.fill('input[type="email"]', testUser);
  await page.fill('input[type="password"]', testPassword);
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/\/admin(\/.*)?$/);
}
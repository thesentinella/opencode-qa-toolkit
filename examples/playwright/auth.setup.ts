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
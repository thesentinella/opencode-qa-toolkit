import { type Page, expect } from '@playwright/test';

export async function navigateTo(page: Page, route: string) {
  await page.goto(route);
  await expect(page).toHaveURL(new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

export async function openSidebarLink(page: Page, linkName: string | RegExp) {
  await page.getByRole('link', { name: linkName }).click();
}

export async function expectHeading(page: Page, text: string | RegExp) {
  await expect(page.getByRole('heading', { name: text })).toBeVisible();
}

export async function expectPageReady(page: Page, options: { waitFor?: string } = {}) {
  if (options.waitFor) {
    await page.waitForSelector(options.waitFor, { state: 'visible' });
  } else {
    await page.waitForLoadState('networkidle');
  }
}
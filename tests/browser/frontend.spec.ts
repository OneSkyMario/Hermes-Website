import { test, expect, type Page } from '@playwright/test';

const products = [
  { productID: 7, name: 'Test Latte', category: 'Latte', price: '4.50', description: 'Espresso with steamed milk.', imagestr: '', volume: '250ml', caffeine: '80mg' },
  { productID: 8, name: 'Test Espresso', category: 'Espresso', price: '3.00', description: 'A small, rich coffee.', imagestr: '', volume: '30ml', caffeine: '60mg' },
];
const stores = [
  { id: 's1', name: 'Test Roastery', image: '', rating: 4.5, price: 4.5, speed: '10m', tag: 'Nearby', type: 'Zap', address: 'Test address', distance: '0.5 km' },
  { id: 's2', name: 'Second Test Store', image: '', rating: 4.6, price: 5, speed: '12m', tag: 'Nearby', type: 'Tag', address: 'Second address', distance: '0.8 km' },
];
async function mockCatalog(page: Page) {
  await page.route('**/api/coffee/', route => route.fulfill({ json: products }));
  await page.route('**/api/stores/', route => route.fulfill({ json: stores }));
}
async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

for (const width of [1920, 1440, 1024, 768, 390]) {
  test(`routes and map fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await mockCatalog(page);
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Your next delivery');
    await expect(page.getByRole('heading', { name: 'Test Latte' })).toBeVisible();
    await noOverflow(page);
    await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
    await page.getByRole('button', { name: 'Explore the map', exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'Delivery map demo' })).toBeVisible();
    await page.getByRole('button', { name: 'First floor', exact: true }).click();
    await expect(page.getByText('Bot #9221')).toBeVisible();
    const map = page.getByRole('application');
    await map.focus(); await page.keyboard.press('ArrowRight');
    await expect(page.getByLabel('Coord X')).toHaveValue('52');
    await page.getByRole('button', { name: 'Preview dispatch' }).click();
    await expect(page.getByRole('status')).toContainText('No robot has been dispatched');
    await noOverflow(page);
    await page.screenshot({ path: `test-results/map-${width}.png`, fullPage: true });
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await page.goto('/coffee/7');
    await expect(page.getByRole('heading', { name: 'Test Latte' })).toBeVisible();
    await noOverflow(page);
    await page.screenshot({ path: `test-results/coffee-${width}.png`, fullPage: true });
    await page.getByRole('button', { name: 'Choose store' }).click();
    await page.getByRole('button', { name: /Second Test Store/ }).click();
    await expect(page.getByRole('button', { name: 'Choose store' })).toContainText('Second Test Store');
    await page.getByRole('button', { name: /Oat Milk/ }).click();
    await expect(page.locator('.total-value')).toHaveText('$5.50');
    await page.getByRole('button', { name: 'Preview delivery' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await page.goto('/mainMeal/1');
    await expect(page.getByRole('heading', { name: 'Margherita Pizza' })).toBeVisible();
    await noOverflow(page);
    await page.goto('/registration');
    await expect(page.getByRole('dialog', { name: 'Create account' })).toBeVisible();
    await expect(page.getByLabel('Full name', { exact: true })).toBeVisible();
    await noOverflow(page);
    await page.screenshot({ path: `test-results/auth-${width}.png`, fullPage: true });
    await page.keyboard.press('Escape');
    await expect(page).toHaveURL('/');
    expect(errors).toEqual([]);
  });
}
test('catalog errors and empty data have useful states', async ({ page }) => {
  await page.route('**/api/coffee/', route => route.fulfill({ status: 503, json: { detail: 'Unavailable' } }));
  await page.route('**/api/stores/', route => route.fulfill({ json: [] }));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'The menu is temporarily unavailable' })).toBeVisible();
  await page.route('**/api/coffee/', route => route.fulfill({ json: [] }));
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('heading', { name: 'A fresh menu is on its way' })).toBeVisible();
  await page.goto('/coffee/999');
  await expect(page.getByRole('heading', { name: 'Coffee not found' })).toBeVisible();
});
test('coffee remains browsable when only store availability fails', async ({ page }) => {
  await page.route('**/api/coffee/', route => route.fulfill({ json: products }));
  await page.route('**/api/stores/', route => route.fulfill({ status: 503, json: { detail: 'Unavailable' } }));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Test Latte' })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Store availability');
});
test('carousel, auth and navigation preserve styling and reduced motion', async ({ page }) => {
  await mockCatalog(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Next coffee' }).click();
  await expect(page.getByRole('button', { name: 'Show Test Espresso' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Log in', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Log in', exact: true })).toBeFocused();
  await page.getByRole('link', { name: 'Choose your coffee' }).nth(1).click();
  await expect(page.getByRole('heading', { name: 'Test Espresso' })).toBeVisible();
  await page.getByRole('link', { name: 'Otto home' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('font-weight', '500');
  await noOverflow(page);
});

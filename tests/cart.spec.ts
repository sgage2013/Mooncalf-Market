import { test, expect } from '@playwright/test';
import { login, clearCart } from './utils/helpers';

test.beforeEach(async ({ page }) => {

 //Login to the site before each test
  await login(page);

  //Clear the cart before the test to ensure accuracy
  await clearCart(page);
});


test('add to cart functionality works correctly', async ({ page }) => {

  // Navigate to the first category page
  await page.locator('.category-link').first().click();

  // Wait for the items to load and click on the first item
  await page.locator('.item').first().waitFor();
  await page.locator('.item').first().click();

  //Wait for the 'Add to Cart' button to be visible and click it
  await page.getByRole('button', { name: 'Add to Cart' }).waitFor();
  await page.getByRole('button', { name: 'Add to Cart' }).click();

  // Assert that the cart count has updated to 1
  await expect(page.locator('[class*="MuiBadge-badge"]')).toHaveText('1');
});
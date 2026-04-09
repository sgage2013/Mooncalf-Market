import { test, expect } from '@playwright/test';
import { login } from './utils/helpers';

test.beforeEach(async ({ page }) => {

 //Login to the site before the test
  await login(page);
});

test('log out function works correctly', async ({ page }) => {

    //Locate the profile button and click it to open the dropdown menu
    await page.locator('.profile-button-container button').click();

    //Locate and click the log out button in the dropdown menu
    await page.getByRole('button', { name: 'Log Out' }).click();

    //Assert that the user is redirected to the login page and the demo login button is visible
    await expect(page.getByRole('button', { name: 'Demo login' })).toBeVisible();
});
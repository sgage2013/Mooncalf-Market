import { expect, Page } from "@playwright/test";

export async function login(page: Page) {
  
  // Navigate to the landing page
  await page.goto("https://mooncalf-market.onrender.com/");

  // Wait for the home page to load by checking for the door image
  await page.getByAltText("Glowing Magical Door").waitFor();

  // Locate the image and click it to get to the log in page
  await page.getByAltText("Glowing Magical Door").click();

  // Wait for the URL to change to the login page
  await page.waitForURL("https://mooncalf-market.onrender.com/login");

  // Locate and click th demo login button
  await page.getByRole("button", { name: "Demo login" }).click();

  //Assert that the hero content is visible
  await expect(page.locator(".hero-content")).toBeVisible({ timeout: 10000 });
}

export async function clearCart(page: Page) {

  // Navigate to the cart page
  await page.goto("https://mooncalf-market.onrender.com/cart");

  //Creat an itemCount variable to store the number of items in the cart
  let itemCount = await page.locator(".cart-item").count();

  // If there are items in the cart, click the "Empty Knapsack" button
  if (itemCount > 0) { 
  await page.locator(".cart-item").first().waitFor();
  
  // Click the "Empty Knapsack" button to clear the cart
  await page.getByRole("button", { name: "Empty Knapsack" }).click();
} else {

  // If there are no items in the cart, just click return
  await page.getByRole('link', {name: "Time to visit the shops" }).click();
}
}
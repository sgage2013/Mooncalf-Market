import { test, expect } from "@playwright/test";
import { login } from "./utils/helpers";

test.beforeEach(async ({ page }) => {
  //Login to the site before the test
  await login(page);
});

test("category navigation works correctly", async ({ page }) => {
    
  // Define the category tab names and their corresponding URLs
  const tabs = [
    { name: "Cauldrons and Potions", expected: "/category/1" },
    { name: "Apparel", expected: "/category/2" },
    { name: "Wands", expected: "/category/3" },
    { name: "Broomsticks", expected: "/category/4" },
    { name: "Magical Creatures and Companions", expected: "/category/5" },
    { name: "Books and Scrolls", expected: "/category/6" },
    { name: "Candy and Treats", url: "/category/7" },
  ];

  // Reload the page to ensure we are starting from the home page
  await page.reload();

  // Wait for the category links to be visible
  await page.locator(".category-link").first().waitFor();

  // Loop through each category tab
  for (const tab of tabs) {

    // Click on the category tab
    await page.locator(".category-link", { hasText: tab.name }).click();

    // Assert that the page URL contains the expected URL
     expect(page.url()).toContain(tab.expected);
}
});


import { test, expect } from "@playwright/test";

test.describe("Finding differentusing raw locators", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto ("/practice/simple-elements.html");
    });

test("Find label element by ID (CSS)", async ({page}) => {
    const elementSelector = "#id-label-element";
    const elementLocator = page.locator(elementSelector);
    const expectedMessage = "Some text for label";

    await expect(elementLocator).toBeVisible()
    await expect(elementLocator).toHaveText(expectedMessage)
    });

test("Find label element by ID (xpath)", async ({page}) => {
    const elementSelector = "//label[@id='id-label-element']";
    const elementLocator = page.locator(elementSelector);
    const expectedMessage = "Some text for label";

    await expect(elementLocator).toBeVisible()
    await expect(elementLocator).toHaveText(expectedMessage)
    });    
});
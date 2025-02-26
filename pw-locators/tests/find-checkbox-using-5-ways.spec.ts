
import { test, expect } from "@playwright/test";

test.describe("Finding checkboxes in 5 ways", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto ("/practice/simple-elements.html");
    });

    // 1. ID
test("Find checkbox element by ID (CSS)", async ({page}) => {
    const elementSelector = "#id-checkbox";
    const elementLocator = page.locator (elementSelector)

    await expect(elementLocator).toBeVisible();
    await elementLocator.click ();
    await expect (elementLocator).toBeChecked();
    
    });

    // 2. Class
test("Find checkbox element by class", async ({page}) => {
    const elementLocator = page.locator('.my-checkbox');
   
    await expect(elementLocator).toBeVisible();
    await elementLocator.click ();
    await expect (elementLocator).toBeChecked();
    
    });

     // 3. Role
test("Find checkbox element by role", async ({page}) => {
    const elementLocator = page.getByRole("checkbox");
   
    await expect(elementLocator).toBeVisible();
    await elementLocator.click ();
    await expect (elementLocator).toBeChecked();
    
    });

     // 4. data-testid
test("Find checkbox element by data testid", async ({page}) => {
    const elementLocator = page.getByTestId('dti-checkbox');
   
    await expect(elementLocator).toBeVisible();
    await elementLocator.click ();
    await expect (elementLocator).toBeChecked();
    
    });

     // 5. CKBX
test("Find checkbox element by ckbx", async ({page}) => {
    

    const elementLocatorByCustomAttribute = page.locator("[ckbx='val1']");
   
   
    await expect (elementLocatorByCustomAttribute).toBeVisible();
    await elementLocatorByCustomAttribute.click ();
    await expect (elementLocatorByCustomAttribute).toBeChecked();
    
    });



test("Find by custom attribute", async ({page}) => {
    
    // Find by custom attribute
    const elementLocatorByCustomAttribute = page.locator("[ckbx='val1']");

    // Assert:
    // Check if the element found by each locator is visible
  
    await expect.soft(elementLocatorByCustomAttribute).toBeVisible();
  
    });   

test 

});    
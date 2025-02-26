import { test, expect } from "@playwright/test";

test.describe("Finding different elements with getBy methods", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto ("/practice/simple-elements.html");
    });

    test("Find button element by getByRole methods", async ({ page }) => {
        const elementLocator = page.getByRole("button", { name: "Click me"});

        await expect(elementLocator).toBeVisible()
    }); 

    test("Find button element by getByText and getByTestId methods", async ({ 
        page, 
    }) => {
        const resultId = "dti-results";
        const expectedMessage = "You clicked the button!"

        //1. get button by text
        const elementLocator = page.getByText ("Click me")

        await expect(elementLocator).toBeVisible()
        //2.Click the button
        await elementLocator.click();

        //3. verify result
        const resultElementLocator = page.getByTestId(resultId)
        await expect (resultElementLocator).toHaveText(expectedMessage)
    })
});


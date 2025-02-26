import { test, expect } from "@playwright/test";

test.describe("Multiple checkboxes", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/practice/simple-multiple-elements-no-ids.html");
  });

  test("All checkboxes on page", async ({ page }) => {
    const elementRole = 'checkbox';
    const numberOfElements = 5;
    const checkboxLocator = page.getByRole(elementRole);
    
    
    console.log(await checkboxLocator.count())
    await expect(checkboxLocator).toHaveCount(numberOfElements)
 

  });

  test("Action on all checkboxes", async ({ page }) => {

    const elementRole = "checkbox"
    const checkboxLocator = page.getByRole(elementRole)

    const Result = "dti-results"
    const resultsLocator = page.getByTestId(Result)
    

    await checkboxLocator.first().check()
    await expect(resultsLocator).toHaveText("Checkbox is checked! (Opt 1!)") 
    console.log (await resultsLocator.textContent() )

    await checkboxLocator.nth(1).check()
    await expect(resultsLocator).toHaveText("Checkbox is checked! (Opt 2!)") 
    console.log (await resultsLocator.textContent() )

    await checkboxLocator.nth(2).check()
    await expect(resultsLocator).toHaveText("Checkbox is checked! (Opt 3!)") 
    console.log (await resultsLocator.textContent() )

    await checkboxLocator.nth(3).check()
    await expect(resultsLocator).toHaveText("Checkbox is checked! (Opt 4!)") 
    console.log (await resultsLocator.textContent() )

    await checkboxLocator.nth(4).check()
    await expect(resultsLocator).toHaveText("Checkbox is checked! (Opt 5!)") 
    console.log (await resultsLocator.textContent() )

    // 1) <input type="checkbox" value="checkbox" onclick="checkBoxOnClick('(Opt 1!)', this)"/> aka getByRole('checkbox').first()
    // 2) <input type="checkbox" value="checkbox" onclick="checkBoxOnClick('(Opt 2!)', this)"/> aka getByRole('checkbox').nth(1)
    // 3) <input type="checkbox" value="checkbox" onclick="checkBoxOnClick('(Opt 3!)', this)"/> aka getByRole('checkbox').nth(2)
    // 4) <input type="checkbox" value="checkbox" onclick="checkBoxOnClick('(Opt 4!)', this)"/> aka getByRole('checkbox').nth(3)
    // 5) <input type="checkbox" value="checkbox" onclick="checkBoxOnClick('(Opt 5!)', this)"/> aka getByRole('checkbox').nth(4)
    
  });

  test("Action on all checkboxes w pętli for", async ({ page }) => {
    const elementRole = "checkbox"
    const checkboxLocator = page.getByRole(elementRole)

    const Result = "dti-results"
    const resultsLocator = page.getByTestId(Result)
    
    const numberOfElements= await checkboxLocator.count()
    for (let index = 0; index < numberOfElements; index++) {
        await checkboxLocator.nth(index).check();
        await expect.soft(resultsLocator).toHaveText(`Checkbox is checked! (Opt ${index+1}!)`); 
        console.log(await resultsLocator.textContent());
    }
    
    // await checkboxLocator.first().check()
    // console.log (await resultsLocator.textContent() )

    // await checkboxLocator.nth(1).check()
    // console.log (await resultsLocator.textContent() )

    // await checkboxLocator.nth(2).check()
    // console.log (await resultsLocator.textContent() )

    // await checkboxLocator.nth(3).check()
    // console.log (await resultsLocator.textContent() )

    // await checkboxLocator.nth(4).check()
    // console.log (await resultsLocator.textContent() )

    // // 1) <input type="checkbox" value="checkbox" onclick="checkBoxOnClick('(Opt 1!)', this)"/> aka getByRole('checkbox').first()
    // 2) <input type="checkbox" value="checkbox" onclick="checkBoxOnClick('(Opt 2!)', this)"/> aka getByRole('checkbox').nth(1)
    // 3) <input type="checkbox" value="checkbox" onclick="checkBoxOnClick('(Opt 3!)', this)"/> aka getByRole('checkbox').nth(2)
    // 4) <input type="checkbox" value="checkbox" onclick="checkBoxOnClick('(Opt 4!)', this)"/> aka getByRole('checkbox').nth(3)
    // 5) <input type="checkbox" value="checkbox" onclick="checkBoxOnClick('(Opt 5!)', this)"/> aka getByRole('checkbox').nth(4)
    
  
  });
});
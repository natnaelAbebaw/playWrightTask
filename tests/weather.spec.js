const { chromium } = require("playwright");
const { test, expect } = require("@playwright/test");

test("Weather.com search test", async ({ page }) => {
  // Navigate to the website
  await page.goto("https://weather.com/");

  // Search for weather in a specific city
  await page.fill(
    'input[placeholder="Search City or Zip Code"]',
    "New York City, NY"
  );
  await page.press('input[placeholder="Search City or Zip Code"]', "Enter");

  await page.waitForSelector(".CurrentConditions--location--1XEyg");

  // Verify the Results Using Assertions
  const location = await page.$eval(
    ".CurrentConditions--location--1YWj_",
    (el) => el.textContent
  );
  expect(location).toContain("New York City, NY");

  const temperatureElement = await page.$(
    ".CurrentConditions--tempValue--MHmYY"
  );
  expect(temperatureElement).not.toBeNull();
  expect(await temperatureElement.isVisible()).toBe(true);
});

(async () => {
  //Navigate to the Website
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://weather.com/");

  // Handle Multiple Browser Contexts
  const context2 = await browser.newContext();
  const page2 = await context2.newPage();
  await page2.goto("https://weather.com/");
  await page2.fill(
    'input[placeholder="Search City or Zip Code"]',
    "Los Angeles"
  );
  await page2.press('input[placeholder="Search City or Zip Code"]', "Enter");

  // Interact with Elements (Click, Type)
  await page.click(".CurrentConditions--overlayBox--3z3Ha");

  //Take a Screenshot of the Results
  await page.screenshot({ path: "weather.png" });

  //Generate a PDF Report
  await page.pdf({ path: "weather.pdf", format: "A4" });

  //Mock API Responses (For Controlled Testing)
  await page.route("**/weather/today/l/*", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ temperature: "72°F", condition: "Sunny" }),
    });
  });

  // Extract Weather Information from the Site
  const temperature = await page.$eval(
    ".CurrentConditions--tempValue--MHmYY",
    (el) => el.textContent
  );
  const condition = await page.$eval(
    ".CurrentConditions--phraseValue--mZC_p",
    (el) => el.textContent
  );

  console.log(`Temperature: ${temperature}, Condition: ${condition}`);

  // Handle Dynamic Content and Pagination
  await page.goto("https://weather.com/news");

  let hasNextPage = true;

  while (hasNextPage) {
    const weatherNews = await page.evaluate(() => {
      const data = [];
      document.querySelectorAll(".ListItem--listItem--25ojW").forEach((row) => {
        const description = row.querySelector(
          ".Ellipsis--ellipsis--3ADai"
        ).innerText;
        const time = row.querySelector(
          ".CollectionMediaList--date--3d7ib"
        ).innerText;
        data.push({ description, time });
      });
      return data;
    });

    console.log("Weather news:", weatherNews);

    const nextButton = await page.$("Pagination--nextButton--3L5q9");
    if (nextButton) {
      await nextButton.click();
      // Implement Waiting Strategies and Handle Timeouts
      await page.waitForTimeout(2000);
    } else {
      hasNextPage = false;
    }
  }
})();

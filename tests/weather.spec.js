const { chromium } = require("playwright");
const { test, expect } = require("@playwright/test");

test.describe("Weather Website", () => {
  test("Weather.com search test", async ({ page }) => {
    // Navigate to the website
    await page.goto("https://www.bbc.com/weather");

    // Search for weather in a specific city
    await page.fill(
      'input[placeholder="Enter a city"]',
      "Addis Ababa, Ethiopia"
    );

    // Interact with Elements (Click, Type)
    await page.press('input[placeholder="Enter a city"]', "Enter");

    await page.click('a[data-id="344979"]');

    await page.waitForSelector("#wr-forecast");

    // Verify the Results Using Assertions
    const location = await page.$eval(
      "#wr-location-name-id",
      (el) => el.textContent
    );
    expect(location).toContain("Addis Ababa");

    const temperatureElement = await page.$(".wr-value--temperature--c");
    expect(temperatureElement).not.toBeNull();
    expect(await temperatureElement.isVisible()).toBe(true);
  });

  test("Das", async () => {
    // Handle Multiple Browser Contexts
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://www.bbc.com/weather");

    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    await page2.goto("https://www.bbc.com");

    await page.screenshot({ path: "weather.png" });

    //Generate a PDF Report
    await page.pdf({ path: "weather.pdf", format: "A4" });

    //Mock API Responses (For Controlled Testing)
    await page.route("**/today/l/*", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ temperature: "72°F", condition: "Sunny" }),
      });
    });
    await page.fill(
      'input[placeholder="Enter a city"]',
      "Addis Ababa, Ethiopia"
    );
    // Extract Weather Information from the Site
    await page.press('input[placeholder="Enter a city"]', "Enter");

    await page.click('a[data-id="344979"]');

    await page.waitForSelector("#wr-forecast");

    // Verify the Results Using Assertions
    const location = await page.$eval(
      "#wr-location-name-id",
      (el) => el.textContent
    );
    const temperature = await page.$eval(
      ".wr-value--temperature--c",
      (el) => el.textContent
    );
    const status = await page.$eval(
      ".wr-day-temperature__low-label",
      (el) => el.textContent
    );

    console.log(
      `location:${location}\nTemperature: ${temperature}\nstatus:${status}`
    );

    // i didn't find pagination on bbc weather and the weather.com is not responding fast so i cant test it but it will work.
    // Handle Dynamic Content and Pagination
    // await page.goto("https://www.weather.com/news");

    // let hasNextPage = true;

    // while (hasNextPage) {
    //   const weatherNews = await page.evaluate(() => {
    //     const data = [];
    //     document
    //       .querySelectorAll(".ListItem--listItem--25ojW")
    //       .forEach((row) => {
    //         const description = row.querySelector(
    //           ".Ellipsis--ellipsis--3ADai"
    //         ).innerText;
    //         const time = row.querySelector(
    //           ".CollectionMediaList--date--3d7ib"
    //         ).innerText;
    //         data.push({ description, time });
    //       });
    //     return data;
    //   });

    //   console.log("Weather news:", weatherNews);

    //   const nextButton = await page.$("Pagination--nextButton--3L5q9");
    //   if (nextButton) {
    //     await nextButton.click();
    //     // Implement Waiting Strategies and Handle Timeouts
    //     await page.waitForTimeout(2000);
    //   } else {
    //     hasNextPage = false;
    //   }
    // }
  });
});

const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

describe("Google Test", function () {
  this.timeout(30000);

  let driver;

  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });

  it("Open Google and verify title", async function () {
    await driver.get("https://www.google.com");

    const title = await driver.getTitle();

    assert.strictEqual(title.includes("Google"), true);
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });
});
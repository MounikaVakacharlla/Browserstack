const { Builder } = require("selenium-webdriver");
const assert = require("assert");

describe("Google Test", function () {

  this.timeout(120000);

  let driver;

  before(async function () {
    driver = await new Builder()
      .forBrowser("chrome")
      .build();
  });

  it("Open Google and verify title", async function () {

    await driver.get("https://www.google.com");

    const title = await driver.getTitle();

    console.log(title);

    assert(title.includes("Google"));
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });
});
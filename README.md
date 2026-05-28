# Browserstack
# Cloud Testing CI/CD Pipeline using BrowserStack and GitHub Actions

## Project Overview

This project demonstrates a cloud-based cross-browser and mobile device testing pipeline integrated with GitHub Actions and BrowserStack.

The pipeline automatically executes Selenium tests across multiple browsers and mobile devices whenever code is pushed to the repository or a pull request is created.

The workflow includes:

* Cross-browser cloud testing
* Mobile device simulation
* Automated CI/CD execution
* Artifact upload for reports
* Deployment blocking on failures

---

# Technologies Used

* Node.js
* Selenium WebDriver
* Mocha
* Mochawesome
* BrowserStack
* GitHub Actions

---

# Project Structure

```text
Browserstack/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── tests/
│   └── loginTest.js
│
├── reports/
│
├── browserstack.yml
├── package.json
├── README.md
```

---

# Step 1 — Create BrowserStack Account

1. Create an account in BrowserStack.
2. Navigate to:

```text
Profile → Settings → Access Keys
```

3. Copy:

   * BrowserStack Username
   * BrowserStack Access Key

---

# Step 2 — Initialize Node Project

Run the following commands:

```bash
npm init -y
```

Install required dependencies:

```bash
npm install selenium-webdriver mocha mochawesome mochawesome-report-generator --save-dev
```

Install BrowserStack SDK:

```bash
npm install browserstack-node-sdk --save-dev
```

---

# Step 3 — Configure BrowserStack

Create a file named:

```text
browserstack.yml
```

Add the following configuration:

```yaml
userName: ${BROWSERSTACK_USERNAME}
accessKey: ${BROWSERSTACK_ACCESS_KEY}

framework: mocha

platforms:
  - os: Windows
    osVersion: 11
    browserName: Chrome
    browserVersion: latest

  - os: Windows
    osVersion: 11
    browserName: Firefox
    browserVersion: latest

  - os: Windows
    osVersion: 11
    browserName: Edge
    browserVersion: latest

  - os: OS X
    osVersion: Ventura
    browserName: Safari
    browserVersion: latest

  - deviceName: Samsung Galaxy S22
    osVersion: 12.0
    browserName: chrome

  - deviceName: iPhone 13
    osVersion: 15
    browserName: safari

parallelsPerPlatform: 1

buildName: github-actions-build
projectName: cloud-testing-project

testObservability: true

debug: true
networkLogs: true
consoleLogs: info
```

---

# Step 4 — Create Selenium Test

Create the file:

```text
tests/loginTest.js
```

Add the following code:

```javascript
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
```

---

# Step 5 — Configure package.json

Update scripts section:

```json
"scripts": {
  "test": "browserstack-node-sdk mocha tests/loginTest.js --reporter mochawesome --reporter-options reportDir=reports,reportFilename=report,html=true,json=true"
}
```

---

# Step 6 — Run Tests Locally

Set BrowserStack credentials:

## PowerShell

```powershell
$env:BROWSERSTACK_USERNAME="YOUR_USERNAME"
$env:BROWSERSTACK_ACCESS_KEY="YOUR_ACCESS_KEY"
```

Run tests:

```bash
npm test
```

---

# Step 7 — Verify BrowserStack Dashboard

After successful execution:

* Open BrowserStack dashboard
* Verify test execution on:

  * Chrome
  * Firefox
  * Edge
  * Safari
  * Samsung Galaxy S22
  * iPhone 13

---

# Step 8 — Configure GitHub Secrets

Navigate to:

```text
GitHub Repository → Settings → Secrets and variables → Actions
```

Add the following secrets:

| Secret Name             | Description             |
| ----------------------- | ----------------------- |
| BROWSERSTACK_USERNAME   | BrowserStack username   |
| BROWSERSTACK_ACCESS_KEY | BrowserStack access key |

---

# Step 9 — Configure GitHub Actions Workflow

Create the file:

```text
.github/workflows/ci.yml
```

Add the following workflow:

```yaml
name: Cloud Testing Pipeline

on:
  push:
  pull_request:

jobs:

  cloud-testing:
    runs-on: ubuntu-latest

    steps:

      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install Dependencies
        run: npm install

      - name: Run BrowserStack Tests
        env:
          BROWSERSTACK_USERNAME: ${{ secrets.BROWSERSTACK_USERNAME }}
          BROWSERSTACK_ACCESS_KEY: ${{ secrets.BROWSERSTACK_ACCESS_KEY }}
        run: npm test

      - name: Upload Test Reports
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: browserstack-reports
          path: reports/
          retention-days: 7

  deployment:
    needs: cloud-testing
    runs-on: ubuntu-latest

    steps:
      - name: Deployment Simulation
        run: echo "Deployment Successful"
```

---

# Step 10 — Push Code to GitHub

Run the following commands:

```bash
git add .
git commit -m "Added cloud testing pipeline"
git push
```

---

# Step 11 — Verify GitHub Actions

Navigate to:

```text
GitHub Repository → Actions
```

Verify:

* cloud-testing job executes successfully
* deployment job executes successfully
* BrowserStack tests run automatically

---

# Step 12 — Verify Artifact Upload

Inside workflow run:

* Open latest successful run
* Scroll to Artifacts section
* Verify:

```text
browserstack-reports
```

Artifacts are retained for 7 days.

---

# Step 13 — Verify Failure Handling

Modify test intentionally:

```javascript
assert(title.includes("Facebook"));
```

Push changes again.

Expected Result:

* cloud-testing job fails
* deployment job is skipped

This verifies deployment blocking functionality.

Revert back to:

```javascript
assert(title.includes("Google"));
```

---

# Acceptance Criteria Achieved

* Cross-browser testing implemented
* Mobile device testing implemented
* BrowserStack integrated with CI/CD
* Automated tests executed on push/PR
* Reports uploaded as GitHub artifacts
* Deployment blocked on failures
* Documentation completed

---

# Browsers Tested

* Google Chrome
* Mozilla Firefox
* Microsoft Edge
* Safari

---

# Mobile Devices Simulated

* Samsung Galaxy S22
* iPhone 13

---

# CI/CD Workflow

```text
Developer Push
      ↓
GitHub Actions
      ↓
BrowserStack Cloud Testing
      ↓
Cross-Browser Execution
      ↓
Mobile Device Testing
      ↓
Generate Reports
      ↓
Upload Artifacts
      ↓
Deployment Gate
```

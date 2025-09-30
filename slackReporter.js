// const axios = require('axios');
// const { execSync } = require('child_process');
// require('dotenv').config();

// const webhook = process.env.SLACK_WEBHOOK_URL;
// if (!webhook) {
//   console.error(" ERROR: SLACK_WEBHOOK_URL not set in .env");
//   process.exit(1);
// }

// async function post(message) {
//   try {
//     await axios.post(webhook, { text: message });
//     console.log(" Slack message sent");
//   } catch (err) {
//     console.error(" Failed to send Slack message:", err.message);
//   }
// }

// (async () => {
//   try {
//     console.log(" Running Cypress tests...");
//     execSync("npx cypress run --headless", { stdio: "inherit" });
//     await post(`Cypress test run PASSED at ${new Date().toLocaleString()}`);
//     process.exit(0);
//   } catch (err) {
//     await post(`Cypress test run FAILED at ${new Date().toLocaleString()}`);
//     process.exit(1);
//   }
// })();
const axios = require('axios');
const { execSync } = require('child_process');
const fs = require('fs');
require('dotenv').config();

const webhook = process.env.SLACK_WEBHOOK_URL;
if (!webhook) {
  console.error(" \u274C ERROR: SLACK_WEBHOOK_URL not set in .env");
  process.exit(1);
}

async function post(message) {
  try {
    await axios.post(webhook, { text: message });
    console.log("\u2705 Slack message sent");
  } catch (err) {
    console.error(" Failed to send Slack message:", err.message);
  }
}

(async () => {
  try {
    console.log(" Running Cypress tests...");

    // Run Cypress with JSON reporter
    execSync("npx cypress run --headless --reporter json > cypress-report.json", {
      stdio: "inherit",
      shell: true
    });

    // Read JSON report
    const report = JSON.parse(fs.readFileSync("cypress/reports/json/mochawesome.json", "utf8"));

    // Extract summary
    const stats = report.stats;
    const total = stats.tests;
    const passes = stats.passes;
    const failures = stats.failures;
    const duration = (stats.duration / 1000).toFixed(2);

    // Build message
    let message = `\u1F4C *Cypress Test Report* \n
    \u2705 Passed: ${passes}  
    \u274C Failed: ${failures}  
    📝 Total: ${total}  
    ⏱ Duration: ${duration}s\n`;

    // Add failed test titles
    if (failures > 0) {
      message += `\n\u274C *Failed Tests:*\n`;
      report.results.forEach(suite => {
        suite.suites.forEach(innerSuite => {
          innerSuite.tests.forEach(test => {
            if (test.state === "failed") {
              message += `- ${test.fullTitle}\n`;
            }
          });
        });
      });
    }

    await post(message);
    process.exit(0);

  } catch (err) {
    await post(`\u274C Cypress run crashed at ${new Date().toLocaleString()}`);
    console.error(err);
    process.exit(1);
  }
})();

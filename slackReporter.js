const axios = require('axios');
const { execSync } = require('child_process');
require('dotenv').config();

const webhook = process.env.SLACK_WEBHOOK_URL;
if (!webhook) {
  console.error(" ERROR: SLACK_WEBHOOK_URL not set in .env");
  process.exit(1);
}

async function post(message) {
  try {
    await axios.post(webhook, { text: message });
    console.log(" Slack message sent");
  } catch (err) {
    console.error(" Failed to send Slack message:", err.message);
  }
}

(async () => {
  try {
    console.log(" Running Cypress tests...");
    execSync("npx cypress run --headless", { stdio: "inherit" });
    await post(`Cypress test run PASSED at ${new Date().toLocaleString()}`);
    process.exit(0);
  } catch (err) {
    await post(`Cypress test run FAILED at ${new Date().toLocaleString()}`);
    process.exit(1);
  }
})();

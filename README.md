# Cypress Slack Integration — Google Search Box Smoke Test

This project runs a simple Cypress test that verifies the Google search box exists and posts a test summary to a Slack channel.

Summary
- Test framework: Cypress v15.3.0
- Reporter: mochawesome (configured in `cypress.config.js`)
- Slack integration: `slackReporter.js` posts a mochawesome JSON summary to a Slack Incoming Webhook
- Recommended Node: 18.x (works with Node 16+; tested with Node 18 on macOS)
- Works on macOS (terminal)  

Prerequisites (mac)
- Homebrew (optional)
- Node.js 18.x or 16.x (use nvm recommended)
- npm (bundled with Node)
- IntelliJ (open folder as project) — optional for editing

Install Node (nvm recommended)
```bash
# install nvm (if not installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
# restart shell, then install Node 18
nvm install 18
nvm use 18
node -v   # expect v18.x.x
npm -v
```

Clone repository
```bash
git clone <repo-url> cypress-slack-integ
cd cypress-slack-integ
```

Install dependencies
```
npm install
```

Set up Slack Incoming Webhook
1. Create a Slack App in your workspace, enable "Incoming Webhooks" and add a webhook for the channel you want to post test results to.
2. Copy the webhook URL (looks like `https://hooks.slack.com/services/XXX/YYY/ZZZ`).

Provide webhook to the project
- Option A — .env file (recommended for local dev)
  - Create `.env` at project root:
    ```
    SLACK_WEBHOOK_URL=https://hooks.slack.com/services/XXX/YYY/ZZZ
    ```
- Option B — environment variable (mac terminal)
  ```bash
  export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/XXX/YYY/ZZZ"
  ```

Run tests locally
- Headless run (CI style):
  ```bash
  npm test
  # this runs: npx cypress run --headless
  ```
  - The mochawesome JSON report is configured to be saved in:
    `cypress/reports/json/mochawesome.json`

- Interactive (open Cypress GUI):
  ```bash
  npm run cypress:open
  ```

Post results to Slack
- Option 1 — Run slackReporter (reads mochawesome JSON and posts summary):
  ```bash
  # ensure SLACK_WEBHOOK_URL is set (via .env or env var)
  node slackReporter.js
  ```
  - `slackReporter.js` expects the mochawesome report at `cypress/reports/json/mochawesome.json`.
  - It will send a formatted summary (passed/failed, total, duration) to the webhook channel.



Automating in CI (Buildkite)
- Example Buildkite step (add SLACK_WEBHOOK as a secure pipeline env var):
```yaml
steps:
  - label: "Run Cypress tests"
    command:
      - npm ci
      - npm test
      - node slackReporter.js
    env:
      SLACK_WEBHOOK_URL: "${SLACK_WEBHOOK_URL}"
```

-Load Yml file content to pipeline
```  
steps:
  - label: ":pipeline: Upload Pipeline"
    command: buildkite-agent pipeline upload .buildkite/pipeline.yml

```
- Scheduling:
  - In Buildkite pipeline settings → Schedules → Add schedule (cron) to run pipeline on a schedule.
  - Or use Buildkite API to create scheduled builds.

Files of interest
- `cypress/e2e/google.cy.js` — the test (visits google.com, asserts `textarea[title="search"]` exists)
- `cypress.config.js` — Cypress configuration (mochawesome reporter, report dir)
- `cypress/reports/mochawesome.json` — generated mochawesome JSON report
- `slackReporter.js` — script that parses mochawesome JSON and posts to Slack
- `package.json` — scripts:
  - `npm test` → runs `npx cypress run --headless`
  - `npm run cypress:open` → opens Cypress GUI
  - `npm run test:slack:report` → runs `node slackReporter.js` (alias)

Notes & versions
- Node: tested with Node 18.x (nvm recommended)
- npm: comes with Node (npm 8/9)
- Cypress: ^15.3.0 (see package.json)
- mochawesome: ^7.x (reporter)
- axios & dotenv used by slackReporter.js






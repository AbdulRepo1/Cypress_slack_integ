const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: false,
    defaultCommandTimeout: 8000,
    reporter: "mochawesome",
    reporterOptions: {
      reportDir: "cypress/reports", // <-- Fixed: Directory, not file path
      overwrite: true,
      html: false, // Disable HTML if not needed (saves time/space)
      json: true, // Enable JSON output (creates mochawesome.json)
      reportFilename: "mochawesome", // Optional: Explicit name for the JSON file (default is 'mochawesome')
    },
  },
  video: false,
  screenshotsFolder: "cypress/screenshots",
});

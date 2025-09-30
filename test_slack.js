// test_slack.js
require('dotenv').config();
const axios = require('axios');
axios.post(process.env.SLACK_WEBHOOK_URL, { text: "Test message from Node.js" })
  .then(() => console.log("Success"))
  .catch(e => console.error(e.message));
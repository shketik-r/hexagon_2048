const path = require('path');

module.exports = {
  launch: {
    headless: true,
  },
  server: {
    command: `${path.join('node_modules', '.bin', 'serve')} -s build -l 3000`,
  },
  browsers: "chromium",
  browserContext: "default",
}

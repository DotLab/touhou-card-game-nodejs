const fs = require('fs');
const webdriver = require('selenium-webdriver');
require('chromedriver');

exports.createWebdriver = function() {
  const chromeCapabilities = webdriver.Capabilities.chrome();
  chromeCapabilities.set('chromeOptions', {args: ['--headless']});

  return new webdriver.Builder()
      .forBrowser('chrome')
      .withCapabilities(chromeCapabilities)
      .build();
};

exports.saveScreenshot = async function(driver, path) {
  const base64png = await driver.takeScreenshot();
  fs.writeFileSync(path, new Buffer(base64png, 'base64'));
};

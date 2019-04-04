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

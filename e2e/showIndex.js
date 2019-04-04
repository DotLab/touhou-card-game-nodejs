// const assert = require('chai').assert;
const fs = require('fs');

const {createWebdriver} = require('./utils');

describe('showIndex', () => {
  let driver;

  before(() => {
    driver = createWebdriver();
  });

  after(() => {
    driver.quit();
  });

  it('open index page', async () => {
    await driver.get('https://www.google.com/');
  });

  it('take screen shot', async () => {
    const base64png = await driver.takeScreenshot();
    fs.writeFileSync('screenshot.png', new Buffer(base64png, 'base64'));
  });
});

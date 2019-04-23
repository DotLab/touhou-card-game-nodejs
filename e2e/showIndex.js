const assert = require('chai').assert;

const {createWebdriver, E2E_INDEX} = require('./utils');
const {By} = require('selenium-webdriver');

describe('showIndex', () => {
  // start a web
  const driver = createWebdriver();

  after(() => {
    // close the web
    driver.quit();
  });

  it('open index page', async () => {
    // go to the game page
    await driver.get(E2E_INDEX);
  });

  it('display title', async () => {
    const h1 = await driver.findElement(By.css('h1'));
    const h1Text = await h1.getText();
    assert.equal(h1Text, 'Touhou Card Game');
  });
});

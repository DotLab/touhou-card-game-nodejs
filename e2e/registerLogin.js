const assert = require('chai').assert;

const {createWebdriver, E2E_INDEX} = require('./utils');
const {By, until} = require('selenium-webdriver');

describe('registerLogin', () => {
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
  it('register', async () => {
    // find the register name field
    const registerName = await driver.findElement(By.name('registerName'));
    // find the register password field
    const registerPassword = await driver.findElement(By.name('registerPassword'));
    // fill the register name field
    await registerName.sendKeys('testName');
    // fill the register password field
    await registerPassword.sendKeys('testPassword');
    await registerName.submit();

    await driver.wait(until.elementLocated(By.css('.alert')));
    const alert = await driver.findElement(By.css('.alert'));
    assert.match(await alert.getText(), /Registered!/);
  });

  it('login', async () => {
    // find the login name field
    const loginName = await driver.findElement(By.name('loginName'));
    // find the login password field
    const loginPassword = await driver.findElement(By.name('loginPassword'));
    // fill the login name field
    await loginName.sendKeys('testName');
    // fill the login password field
    await loginPassword.sendKeys('testPassword');
    await loginName.submit();

    await driver.wait(until.elementLocated(By.css('.alert')));
    const alert = await driver.findElement(By.css('.alert'));
    assert.match(await alert.getText(), /Welcome testName!/);
  });
});

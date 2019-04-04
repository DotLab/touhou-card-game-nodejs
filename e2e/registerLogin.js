const assert = require('chai').assert;

const {createWebdriver, E2E_INDEX} = require('./utils');
const {By, until} = require('selenium-webdriver');

describe('registerLogin', () => {
  const driver = createWebdriver();

  after(() => {
    driver.quit();
  });

  it('open index page', async () => {
    await driver.get(E2E_INDEX);
  });

  it('register', async () => {
    const registerName = await driver.findElement(By.name('registerName'));
    const registerPassword = await driver.findElement(By.name('registerPassword'));

    await registerName.sendKeys('testName');
    await registerPassword.sendKeys('testPassword');
    await registerName.submit();

    await driver.wait(until.elementLocated(By.css('.alert')));
    const alert = await driver.findElement(By.css('.alert'));
    assert.match(await alert.getText(), /Registered!/);
  });

  it('login', async () => {
    const loginName = await driver.findElement(By.name('loginName'));
    const loginPassword = await driver.findElement(By.name('loginPassword'));

    await loginName.sendKeys('testName');
    await loginPassword.sendKeys('testPassword');
    await loginName.submit();

    await driver.wait(until.elementLocated(By.css('.alert')));
    const alert = await driver.findElement(By.css('.alert'));
    assert.match(await alert.getText(), /Welcome testName!/);
  });
});

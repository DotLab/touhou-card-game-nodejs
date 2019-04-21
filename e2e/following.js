const assert = require('chai').assert;

const {createWebdriver, E2E_INDEX} = require('./utils');

const {By, until} = require('selenium-webdriver');

describe('followingAndFollower', () => {
  const driver = createWebdriver();

  after(() => {
    driver.quit();
  });

  it('open index page', async () => {
    await driver.get(E2E_INDEX);
    // const createNewTab = await Key.chord(Key.CONTROL, Key.);
    driver.executeScript(`window.open('${E2E_INDEX}');`);
    // Key.chord
    await driver.get(E2E_INDEX);
    const tabHandles = await driver.getAllWindowHandles();
    await driver.switchTo().window(tabHandles[0]);
    // console.log(driver.getAllWindowHandles().length);
  });

  async function register(regName, regPassword) {
    const registerName = await driver.findElement(By.name('registerName'));
    const registerPassword = await driver.findElement(By.name('registerPassword'));

    await registerName.clear();
    await registerPassword.clear();

    await registerName.sendKeys(regName);
    await registerPassword.sendKeys(regPassword);

    registerName.submit();

    await driver.wait(until.elementLocated(By.css('.alert')));
    const alert = await driver.findElement(By.css('.alert'));
    assert.match(await alert.getText(), /Registered!/);
  }


  it('register1', async () => {
    await register('testName1', 'testPassword1');
  });

  it('register2', async () => {
    await register('testName2', 'testPassword2');
  });

  it('login1', async () => {
    const loginName = await driver.findElement(By.name('loginName'));
    const loginPassword = await driver.findElement(By.name('loginPassword'));

    await loginName.clear();
    await loginPassword.clear();
    await loginName.sendKeys('testName1');
    await loginPassword.sendKeys('testPassword1');
    await loginName.submit();

    await driver.wait(until.elementLocated(By.css('.alert')));
    const alert = await driver.findElement(By.css('.alert'));
    assert.match(await alert.getText(), /Welcome testName1!/);
  });

  it('following', async () => {
    const playerListButton = await driver.findElement(By.name('togglePlayer'));
    await playerListButton.click();

    const followButton = await driver.findElement(By.name('testName2'));
    await followButton.click();

    const toggleStat = await driver.findElement(By.name('toggleStats'));
    await toggleStat.click();

    const following = await driver.findElement(By.name('followingList'));
    assert.equal(await following.getText(), 'testName2');
  });

  it('login2', async () => {
    // const switchTab = await Key.chord(Key.CONTROL, Key.TAB);
    const tabHandles =await driver.getAllWindowHandles();
    await driver.switchTo().window(tabHandles[1]);

    const loginName = await driver.findElement(By.name('loginName'));
    const loginPassword = await driver.findElement(By.name('loginPassword'));
    loginName.clear();
    loginPassword.clear();
    await loginName.sendKeys('testName2');
    await loginPassword.sendKeys('testPassword2');
    await loginName.submit();

    await driver.wait(until.elementLocated(By.css('.alert')));
    const alert = await driver.findElement(By.css('.alert'));
    assert.match(await alert.getText(), /Welcome testName2!/);
  });

  it('follower', async () => {
    const toggleStat = await driver.findElement(By.name('toggleStats'));
    await toggleStat.click();

    const following = await driver.findElement(By.name('followerList'));
    assert.equal(await following.getText(), 'testName1');
  });
});

const assert = require('chai').assert;

const {createWebdriver, E2E_INDEX} = require('./utils');

const {By, until} = require('selenium-webdriver');

describe('followingAndFollower', () => {
  // start a web
  const driver = createWebdriver();

  after(() => {
    // close the web
    driver.quit();
  });

  it('open index page', async () => {
    // go to the game page
    await driver.get(E2E_INDEX);
    // open a new tab
    await driver.executeScript(`window.open('${E2E_INDEX}');`);
    // go to the game page
    await driver.get(E2E_INDEX);
    // list all the tabs
    const tabHandles =await driver.getAllWindowHandles();
    // switch to one of the tab
    await driver.switchTo().window(tabHandles[0]);
  });

  async function register(regName, regPassword) {
    // find the register name field
    const registerName = await driver.findElement(By.name('registerName'));
    // find the register password field
    const registerPassword = await driver.findElement(By.name('registerPassword'));
    // clear both field
    await registerName.clear();
    await registerPassword.clear();
    // fill both field
    await registerName.sendKeys(regName);
    await registerPassword.sendKeys(regPassword);

    registerName.submit();

    await driver.wait(until.elementLocated(By.css('.alert')));
    const alert = await driver.findElement(By.css('.alert'));
    assert.match(await alert.getText(), /Registered!/);
  }


  it('register1', async () => {
    // register the user1
    await register('following1', 'followingPassword1');
  });

  it('register2', async () => {
    // register the user2
    await register('following2', 'followingPassword2');
  });

  it('login1', async () => {
    // find the login name and password field
    const loginName = await driver.findElement(By.name('loginName'));
    const loginPassword = await driver.findElement(By.name('loginPassword'));
    // clear both field
    await loginName.clear();
    await loginPassword.clear();
    // fill both field
    await loginName.sendKeys('following1');
    await loginPassword.sendKeys('followingPassword1');
    await loginName.submit();

    await driver.wait(until.elementLocated(By.css('.alert')));
    const alert = await driver.findElement(By.css('.alert'));
    assert.match(await alert.getText(), /Welcome following1!/);
  });

  it('following', async () => {
    // toggle playerlist
    const playerListButton = await driver.findElement(By.name('togglePlayer'));
    await playerListButton.click();
    // follow the other player
    const followButton = await driver.findElement(By.name('following2'));
    await followButton.click();
    // toggle stats
    const toggleStat = await driver.findElement(By.name('toggleStats'));
    await toggleStat.click();
    // check whehther the other player is added to the following list
    const following = await driver.findElement(By.name('followingList'));
    assert.equal(await following.getText(), 'following2');
  });

  it('login2', async () => {
    // switch to another tab
    const tabHandles =await driver.getAllWindowHandles();
    await driver.switchTo().window(tabHandles[1]);
    // log in to the other player
    const loginName = await driver.findElement(By.name('loginName'));
    const loginPassword = await driver.findElement(By.name('loginPassword'));
    loginName.clear();
    loginPassword.clear();
    await loginName.sendKeys('following2');
    await loginPassword.sendKeys('followingPassword2');
    await loginName.submit();

    await driver.wait(until.elementLocated(By.css('.alert')));
    const alert = await driver.findElement(By.css('.alert'));
    assert.match(await alert.getText(), /Welcome following2!/);
  });

  it('follower', async () => {
    // toggle stat and check if user1 is in the follower list
    const toggleStat = await driver.findElement(By.name('toggleStats'));
    await toggleStat.click();

    const following = await driver.findElement(By.name('followerList'));
    assert.equal(await following.getText(), 'following1');
  });
});

const assert = require('chai').assert;

const {createWebdriver, E2E_INDEX} = require('./utils');

const {By, until} = require('selenium-webdriver');

describe('gameStart', () => {
  const driver = createWebdriver();

  after(() => {
    driver.quit();
  });

  it('open index page', async () => {
    await driver.get(E2E_INDEX);
    // const createNewTab = await Key.chord(Key.CONTROL, Key.);
    await driver.executeScript(`window.open('${E2E_INDEX}');`);
    // Key.chord
    await driver.get(E2E_INDEX);
    const tabHandles =await driver.getAllWindowHandles();
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
    await register('gameStart3', 'gameStartPassword3');
  });

  it('register2', async () => {
    await register('gameStart4', 'gameStartPassword4');
  });

  it('login1', async () => {
    const loginName = await driver.findElement(By.name('loginName'));
    const loginPassword = await driver.findElement(By.name('loginPassword'));

    await loginName.clear();
    await loginPassword.clear();
    await loginName.sendKeys('gameStart3');
    await loginPassword.sendKeys('gameStartPassword3');
    await loginName.submit();

    await driver.wait(until.elementLocated(By.css('.alert')));
    const alert = await driver.findElement(By.css('.alert'));
    assert.match(await alert.getText(), /Welcome gameStart3!/);
  });

  it('createRoom', async () => {
    const findRoom = await driver.findElement(By.name('roomNameInput'));

    await findRoom.clear();
    await findRoom.sendKeys('room1');
    await findRoom.submit();

    const roomCreated = await driver.findElement(By.xpath('//*[contains(text(), \'Joined room:\')]'));

    assert.equal(await roomCreated.getText(), 'Joined room: room1 (owned by gameStart3)  Leave Room');
  });

  it('login2', async () => {
    const tabHandles =await driver.getAllWindowHandles();
    await driver.switchTo().window(tabHandles[1]);

    // find and fill the login fields
    const loginName = await driver.findElement(By.name('loginName'));
    const loginPassword = await driver.findElement(By.name('loginPassword'));
    loginName.clear();
    loginPassword.clear();
    await loginName.sendKeys('gameStart4');
    await loginPassword.sendKeys('gameStartPassword4');
    await loginName.submit();

    await driver.wait(until.elementLocated(By.css('.alert')));
    const alert = await driver.findElement(By.css('.alert'));
    assert.match(await alert.getText(), /Welcome gameStart4!/);
  });

  it('joinRoom', async () => {
    const joinRoom = await driver.findElement(By.xpath('//*[contains(text(), \'Join\')]'));
    await joinRoom.click();

    const roomJoined = await driver.findElement(By.xpath('//*[contains(text(), \'Joined room:\')]'));
    assert.equal(await roomJoined.getText(), 'Joined room: room1 (owned by gameStart3) 1 members: gameStart4, Leave Room');
  });

  it('proposeStart', async () => {
    const tabHandles =await driver.getAllWindowHandles();
    await driver.switchTo().window(tabHandles[0]);

    const proposeStart = await driver.findElement(By.xpath('//*[contains(text(), \'Propose to Start a Game\')]'));
    await proposeStart.click();

    const waitingState = await driver.findElement(By.xpath('//*[@id="lobby"]/div/div[2]/div/div/ul/li'));
    assert.equal(await waitingState.getText(), 'gameStart4 Waiting for agreement');
  });

  it('AgreeToStart', async () => {
    const tabHandles =await driver.getAllWindowHandles();
    await driver.switchTo().window(tabHandles[1]);

    const agreeStart = await driver.findElement(By.xpath('//*[contains(text(), \'Agree to Start the Game\')]'));
    await agreeStart.click();

    const agreedState = await driver.findElement(By.xpath('//*[@id="lobby"]/div/div[2]/div/div/ul/li'));
    assert.equal(await agreedState.getText(), 'gameStart4 Agreed to start');
  });

  it('startGame', async () => {
    const tabHandles =await driver.getAllWindowHandles();
    await driver.switchTo().window(tabHandles[0]);

    const agreeStart = await driver.findElement(By.xpath('//*[contains(text(), \'Start the Game\')]'));
    await agreeStart.click();

    const startState = await driver.findElement(By.xpath('//*[@id="lobby"]/div/div[2]'));
    assert.equal(await startState.getText(), 'Enjoy the game!');
  });
});

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
    await register('gameStart3', 'gameStartPassword3');
  });

  it('register2', async () => {
    // register the user1
    await register('gameStart4', 'gameStartPassword4');
  });

  it('login1', async () => {
    // find the login name and password field
    const loginName = await driver.findElement(By.name('loginName'));
    const loginPassword = await driver.findElement(By.name('loginPassword'));
    // clear both field
    await loginName.clear();
    await loginPassword.clear();
    // fill both field
    await loginName.sendKeys('gameStart3');
    await loginPassword.sendKeys('gameStartPassword3');
    await loginName.submit();

    await driver.wait(until.elementLocated(By.css('.alert')));
    const alert = await driver.findElement(By.css('.alert'));
    assert.match(await alert.getText(), /Welcome gameStart3!/);
  });

  it('createRoom', async () => {
    // find the roomName field
    const findRoom = await driver.findElement(By.name('roomNameInput'));
    // clear the field
    await findRoom.clear();
    // fill the field
    await findRoom.sendKeys('room1');
    await findRoom.submit();
    // check if the room is successfully created
    const roomCreated = await driver.findElement(By.xpath('//*[contains(text(), \'Joined room:\')]'));

    assert.equal(await roomCreated.getText(), 'Joined room: room1 (owned by gameStart3)  Leave Room');
  });

  it('login2', async () => {
    // switch to another tab
    const tabHandles =await driver.getAllWindowHandles();
    await driver.switchTo().window(tabHandles[1]);

    // login to another user
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
    // find join room button and click it
    const joinRoom = await driver.findElement(By.xpath('//*[contains(text(), \'Join\')]'));
    await joinRoom.click();
    // make sure if the user has successfully joined the room
    const roomJoined = await driver.findElement(By.xpath('//*[contains(text(), \'Joined room:\')]'));
    assert.equal(await roomJoined.getText(), 'Joined room: room1 (owned by gameStart3) 1 members: gameStart4, Leave Room');
  });

  it('proposeStart', async () => {
    // switch back to the first tab
    const tabHandles =await driver.getAllWindowHandles();
    await driver.switchTo().window(tabHandles[0]);
    // propose start of the game
    const proposeStart = await driver.findElement(By.xpath('//*[contains(text(), \'Propose to Start a Game\')]'));
    await proposeStart.click();

    const waitingState = await driver.findElement(By.xpath('//*[@id="lobby"]/div/div[2]/div/div/ul/li'));
    assert.equal(await waitingState.getText(), 'gameStart4 Waiting for agreement');
  });

  it('AgreeToStart', async () => {
    // switch to the second tab
    const tabHandles =await driver.getAllWindowHandles();
    await driver.switchTo().window(tabHandles[1]);
    // agree to start the game
    const agreeStart = await driver.findElement(By.xpath('//*[contains(text(), \'Agree to Start the Game\')]'));
    await agreeStart.click();

    const agreedState = await driver.findElement(By.xpath('//*[@id="lobby"]/div/div[2]/div/div/ul/li'));
    assert.equal(await agreedState.getText(), 'gameStart4 Agreed to start');
  });

  it('startGame', async () => {
    // switch to the first tab
    const tabHandles =await driver.getAllWindowHandles();
    await driver.switchTo().window(tabHandles[0]);
    // the room owner start the game
    const agreeStart = await driver.findElement(By.xpath('//*[contains(text(), \'Start the Game\')]'));
    await agreeStart.click();

    const startState = await driver.findElement(By.xpath('//*[@id="lobby"]/div/div[2]'));
    assert.equal(await startState.getText(), 'Enjoy the game!');
  });
});

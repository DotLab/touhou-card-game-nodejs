const assert = require('chai').assert;

const MonsterCard = require('../../src/gameplay/cards/MonsterCard');
const KaibamanCard = require('../../src/gameplay/cards/KaibamanCard');
const BlueEyesWhiteDragonCard = require('../../src/gameplay/cards/BlueEyesWhiteDragonCard');
const DarkMagicianCard = require('../../src/gameplay/cards/DarkMagicianCard');
const DarkMagicianGirlCard = require('../../src/gameplay/cards/DarkMagicianGirlCard');
const Card = require('../../src/gameplay/cards/Card');
const Game = require('../../src/gameplay/Game');

function assertGameSuccess(res) {
  assert.isObject(res, 'game response is not an object');
  assert.equal(res.success, true, `game response ${JSON.stringify(res)} is not a success`);
}

function assertGameError(res, msg) {
  assert.isObject(res, 'game response is not an object');
  assert.equal(res.error, true, 'game response is not an error');
  if (typeof msg === 'string') assert.equal(res.msg, msg);
}

function assertGameSuspend(res, phase) {
  assert.isObject(res, 'game response is not an object');
  assert.equal(res.suspend, true, 'game response is not a suspend');
  if (typeof phase === 'string') assert.equal(res.phase, phase);
}

describe('Game', () => {
  function createMockDeck() {
    const res = [];
    for (let i = 0; i < 10; i += 1) {
      res.push(new KaibamanCard());
      res.push(new BlueEyesWhiteDragonCard());
    }
    return res;
  }

  let mockUsers;

  beforeEach(() => {
    mockUsers = [
      {id: 'abc', name: 'F', deck: createMockDeck()},
      {id: 'def', name: 'K', deck: createMockDeck()},
    ];
  });

  it('#constructor', () => {
    const game = new Game(mockUsers);
    assert.lengthOf(game.players, 2);
  });

  it('#summon', () => {
    const game = new Game(mockUsers);
    assertGameError(game.summon(5, 0, Card.REVEALED, Card.ATTACK));
    assertGameError(game.summon(game.players[game.turn].hand[0].id, game.players[game.turn].field.getMonsterSlotId(1), Card.HIDDEN, Card.ATTACK));
    assertGameError(game.summon(0, 9, Card.REVEALED, Card.ATTACK));
  });

  it('#attack', () => {
    const game = new Game(mockUsers);
    game.summon(game.players[game.turn].hand[0].id, game.players[game.turn].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK);
    game.endTurn();
    game.summon(game.players[game.turn].hand[0].id, game.players[game.turn].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK);
    game.endTurn();
    assertGameError(game.attack(1, 0, 0));
    assertGameError(game.attack(0, 2, 0));
    assertGameError(game.attack(0, 0, 1));
  });

  it('#attack1', ()=> {
    const mockUsers1 = [
      {id: 'abc', name: 'F', deck: createMockDeck1()},
      {id: 'def', name: 'K', deck: createMockDeck2()},
    ];

    function createMockDeck1() {
      const res = [];
      for (let i = 0; i < 10; i += 1) {
        res.push(new BlueEyesWhiteDragonCard());
      }
      return res;
    }
    function createMockDeck2() {
      const res = [];
      // res.push(new DarkMagicianCard());
      for (let i = 0; i < 10; i += 1) {
        // res.push(new DarkMagicianCard());
        res.push(new DarkMagicianGirlCard());
      }
      res.push(new DarkMagicianCard());
      return res;
    }

    const game = new Game(mockUsers1);
    // console.log(game.players[0].hand);
    // console.log(game.players[1].hand);
    // const blackGirl = game.players[1].deck[1];
    game.summon(game.players[game.turn].hand[0].id, game.players[game.turn].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK);
    game.endTurn();
    game.summon(game.players[game.turn].hand[0].id, game.players[game.turn].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK);
    // console.log(game.players[0].field.monsterSlots[0]);
    // console.log(game.players[1].field.monsterSlots[0]);
    game.endTurn();
    const loserCard = game.players[1].field.monsterSlots[0];
    assertGameSuccess(game.attack(game.players[game.turn].field.monsterSlots[0].id, game.players[1].field.monsterSlots[0].id));
    assert.equal(game.players[1].field.monsterSlots[0], null);
    assert.equal(game.players[1].field.graveyard[0], loserCard);
    game.endTurn();
    assert.equal(game.turn, 1);
    game.summon(game.players[game.turn].hand[1].id, game.players[game.turn].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK);

    assert.equal(game.players[1].field.monsterSlots[0].name, DarkMagicianGirlCard.Name);
    assert.equal(game.players[1].field.monsterSlots[0].canInvoke(game, game.players[1], []), true);
    const beforeAtk = game.players[1].field.monsterSlots[0].atk;
    game.players[1].field.monsterSlots[0].invoke(game, game.players[1], []);
    // console.log(game.players[1].field.graveyard);
    // game.invokeMonsterEffect(0, []);
    const afterAtk = game.players[1].field.monsterSlots[0].atk;
    assert.equal(afterAtk, beforeAtk + DarkMagicianGirlCard.AtkIncrease );
    assert.isTrue(game.players[1].field.monsterSlots[0].hasInvoked);
  });

  it('#changeDisplay', () => {
    const game = new Game(mockUsers);
    assertGameError(game.changeDisplay(0, Card.REVEALED));
    assertGameSuccess(game.summon(game.players[game.turn].hand[0].id, game.players[game.turn].field.getMonsterSlotId(0), Card.HIDDEN, Card.DEFENSE));
    assertGameSuccess(game.changeDisplay(game.players[game.turn].field.monsterSlots[0].id, Card.REVEALED));
  });

  it('#takeSnapshot', () => {
    const game = new Game(mockUsers);
    assertGameError(game.changeDisplay(0, Card.REVEALED));
    assertGameSuccess(game.summon(game.players[game.turn].hand[0].id, game.players[game.turn].field.getMonsterSlotId(0), Card.HIDDEN, Card.DEFENSE));
    assertGameSuccess(game.changeDisplay(game.players[game.turn].field.monsterSlots[0].id, Card.REVEALED));
    game.takeSnapshot();
  });

  it('#changePose', () => {
    const game = new Game(mockUsers);
    assertGameError(game.changePose(0, Card.ATTACK));
    assertGameSuccess(game.summon(game.players[game.turn].hand[0].id, game.players[game.turn].field.getMonsterSlotId(0), Card.REVEALED, Card.DEFENSE));
    assertGameSuccess(game.changePose(game.players[game.turn].field.monsterSlots[0].id, Card.ATTACK));
  });

  it('#summon 1 tribute success', () => {
    let card1;
    // create a game with one player
    const game = new Game([
      {id: 'abc', name: 'F', deck: [card1 = new MonsterCard('', '', '', 5, 100, 100)]},
    ]);
    // record hand count
    const handCount = game.players[game.turn].hand.length;
    // add and record a lv 5 monster card to the field
    const card2 = game.players[game.turn].field.monsterSlots[0] = new MonsterCard('', '', '', 5, 100, 100);
    // tribute summon 1 card from hand using 1 monster should succeed
    assertGameSuccess(game.summon(game.players[game.turn].hand[0].id, game.players[game.turn].field.getMonsterSlotId(1), Card.REVEALED, Card.DEFENSE, [card2.id]));
    // hand has 1 card less
    assert.equal(game.players[game.turn].hand.length, handCount - 1);
    // the card is summoned
    assert.equal(game.players[game.turn].field.monsterSlots[1].id, card1.id);
  });

  it('#summon 1 tribute error', () => {
    const game = new Game([
      {id: 'abc', name: 'F', deck: [new MonsterCard('', '', '', 5, 100, 100)]},
    ]);
    const handCount = game.players[game.turn].hand.length;
    assertGameError(game.summon(game.players[game.turn].hand[0].id, game.players[game.turn].field.getMonsterSlotId(1), Card.REVEALED, Card.DEFENSE, ['not exist']));
    assert.equal(game.players[game.turn].hand.length, handCount);
    assert.isNull(game.players[game.turn].field.monsterSlots[1]);
  });

  it('#summon 2 tribute success', () => {
    let card1;
    const game = new Game([
      {id: 'abc', name: 'F', deck: [card1 = new MonsterCard('', '', '', 7, 100, 100)]},
    ]);
    const handCount = game.players[game.turn].hand.length;
    const card2 = game.players[game.turn].field.monsterSlots[0] = new MonsterCard('', '', '', 5, 100, 100);
    const card3 = game.players[game.turn].field.monsterSlots[1] = new MonsterCard('', '', '', 5, 100, 100);
    assertGameSuccess(game.summon(game.players[game.turn].hand[0].id, game.players[game.turn].field.getMonsterSlotId(2), Card.REVEALED, Card.DEFENSE, [card2.id, card3.id]));
    assert.equal(game.players[game.turn].hand.length, handCount - 1);
    assert.equal(game.players[game.turn].field.monsterSlots[2].id, card1.id);
  });

  it('#summon 2 tribute fail', () => {
    const game = new Game([
      {id: 'abc', name: 'F', deck: [new MonsterCard('', '', '', 7, 100, 100)]},
    ]);
    const handCount = game.players[game.turn].hand.length;
    const card2 = game.players[game.turn].field.monsterSlots[0] = new MonsterCard('', '', '', 5, 100, 100);
    assertGameError(game.summon(game.players[game.turn].hand[0].id, game.players[game.turn].field.getMonsterSlotId(2), Card.REVEALED, Card.DEFENSE, [card2.id, 'not exist']));
    assert.equal(game.players[game.turn].hand.length, handCount);
    assert.isNull(game.players[game.turn].field.monsterSlots[1]);
  });

  it('#summon 2 tribute fail 2', () => {
    const game = new Game([
      {id: 'abc', name: 'F', deck: [new MonsterCard('', '', '', 7, 100, 100)]},
    ]);
    const handCount = game.players[game.turn].hand.length;
    assertGameError(game.summon(game.players[game.turn].hand[0].id, game.players[game.turn].field.getMonsterSlotId(2), Card.REVEALED, Card.DEFENSE, ['not exist', 'not exist']));
    assert.equal(game.players[game.turn].hand.length, handCount);
    assert.isNull(game.players[game.turn].field.monsterSlots[1]);
  });

  it('#checkGameEnd', () => {
    const game = new Game(mockUsers);
    assert.isFalse(game.hasEnded);
    assert.isFalse(game.checkGameEnd());
    assert.isFalse(game.hasEnded);
    game.players[0].life = 0;
    assert.isTrue(game.checkGameEnd());
    assert.isTrue(game.hasEnded);
  });

  it('U010: The Gamer is dealt 5 random cards at the beginning of the Game', () => {
    const game = new Game(mockUsers);
    game.players.forEach((player) => {
      assert.lengthOf(player.hand, 5);
      player.hand.forEach((card) => assert.isObject(card));
    });
  });

  it('U011: The Gamer has 5000 Life initially', () => {
    const game = new Game(mockUsers);
    game.players.forEach((player) => {
      assert.equal(player.life, 5000);
    });
  });

  it('U012: The Gamer can see other Players in the Game with their Name and icons indicating their cards in hands', () => {
    const game = new Game(mockUsers);
    game.players.forEach((player, i) => { // check id and name
      assert.equal(player.userId, mockUsers[i].id);
      assert.equal(player.userName, mockUsers[i].name);
    });
  });

  it('U013: The Gamer can play in his/her turn every round and the order of turns is based on how early the Gamer originally joined the Room', () => {
    const game = new Game(mockUsers);
    assert.isTrue(game.isMyTurn(mockUsers[0].id));
    assert.isFalse(game.isMyTurn(mockUsers[1].id));
    assertGameSuccess(game.endTurn());

    assert.isFalse(game.isMyTurn(mockUsers[0].id));
    assert.isTrue(game.isMyTurn(mockUsers[1].id));
    assertGameSuccess(game.endTurn());

    assert.isTrue(game.isMyTurn(mockUsers[0].id));
    assert.isFalse(game.isMyTurn(mockUsers[1].id));
  });

  it('U014: The Gamer is dealt 1 random card in Phase 1 every round', () => {
    const game = new Game(mockUsers);
    assertGameSuccess(game.draw());
    assertGameError(game.draw()); // cannot draw more than one
    assert.lengthOf(game.players[0].hand, 6); // one more card

    assertGameSuccess(game.endTurn());
    assertGameSuccess(game.endTurn());

    assertGameSuccess(game.draw());
    assertGameError(game.draw()); // cannot draw more than one
    assert.lengthOf(game.players[0].hand, 7); // one more card
  });

  it('U015: The Gamer can Summon a Marionette using a Character Card in hand in Phase 2 every round. ', () => {
    const game = new Game(mockUsers);
    assertGameSuccess(game.draw());
    const card1 = game.players[0].hand[0];
    assertGameSuccess(game.summon(game.players[game.turn].hand[0].id, game.players[game.turn].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK));
    assert.notEqual(card1, game.players[0].hand[0]);
    assert.equal(card1, game.players[0].field.monsterSlots[0]);
    assertGameError(game.summon(game.players[game.turn].hand[0].id, game.players[game.turn].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK)); // cannot summon twice

    assertGameSuccess(game.endTurn());
    assertGameSuccess(game.endTurn());

    const card2 = game.players[0].hand[0];
    assertGameError(game.summon(game.players[game.turn].hand[0].id, game.players[game.turn].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK)); // cannot overlay
    assertGameSuccess(game.summon(game.players[game.turn].hand[0].id, game.players[game.turn].field.getMonsterSlotId(1), Card.REVEALED, Card.ATTACK));
    assert.notEqual(card2, game.players[0].hand[0]);
    assert.equal(card2, game.players[0].field.monsterSlots[1]);
  });

  it('U016: The Gamer can order the Marionettes to Attack other Gamers\' Marionettes and, when there is no Marionette on Ground, other Gamers themselves in Phase 2 every round', () => {
    const game = new Game(mockUsers);
    assertGameSuccess(game.draw());
    const card1 = game.players[0].hand[0];
    assertGameSuccess(game.summon(game.players[game.turn].hand[0].id, game.players[game.turn].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK));
    const life = game.players[1].life;
    assertGameSuccess(game.directAttack(game.players[game.turn].field.monsterSlots[0].id, game.players[1].userId));
    assert.equal(game.players[1].life, life - card1.atk);
    assertGameError(game.directAttack(game.players[game.turn].field.monsterSlots[0].id, game.players[1].userId)); // cannot attack twice

    assertGameSuccess(game.endTurn());
    assertGameSuccess(game.endTurn());

    assertGameSuccess(game.draw());
    const card2 = game.players[0].hand[0];
    assertGameSuccess(game.summon(game.players[game.turn].hand[0].id, game.players[game.turn].field.getMonsterSlotId(1), Card.REVEALED, Card.ATTACK));
    assertGameSuccess(game.directAttack(game.players[game.turn].field.monsterSlots[0].id, game.players[1].userId));
    assert.equal(game.players[1].life, life - card1.atk - card1.atk);
    assertGameSuccess(game.directAttack(game.players[game.turn].field.monsterSlots[1].id, game.players[1].userId));
    assert.equal(game.players[1].life, life - card1.atk - card1.atk - card2.atk);
    assertGameError(game.directAttack(game.players[game.turn].field.monsterSlots[0].id, game.players[1].userId)); // cannot attack twice
    assertGameError(game.directAttack(game.players[game.turn].field.monsterSlots[1].id, game.players[1].userId)); // cannot attack twice
  });

  it('U016: The Gamer can order the Marionettes to Attack other Gamers\' Marionettes (300 ATK -> 300 ATK)', () => {
    const game = new Game([
      {id: 'abc', name: 'F', deck: [new MonsterCard('', '', '', 1, 300, 300)]},
      {id: 'def', name: 'K', deck: [new MonsterCard('', '', '', 1, 300, 300)]},
    ]);
    game.summon(game.players[game.turn].hand[0].id, game.players[game.turn].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK);
    game.endTurn();
    game.summon(game.players[game.turn].hand[0].id, game.players[game.turn].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK);
    game.endTurn();

    const life = game.players[0].life;
    assert.isObject(game.players[0].field.monsterSlots[0]);
    assert.isObject(game.players[1].field.monsterSlots[0]);

    assertGameSuccess(game.attack(game.players[game.turn].field.monsterSlots[0].id, game.players[1].field.monsterSlots[0].id));

    assert.equal(game.players[0].life, life);
    assert.equal(game.players[1].life, life);
    assert.isNull(game.players[0].field.monsterSlots[0]);
    assert.isNull(game.players[1].field.monsterSlots[0]);
  });

  it('U016: The Gamer can order the Marionettes to Attack other Gamers\' Marionettes (200 ATK -> 300 ATK)', () => {
    const game = new Game([
      {id: 'abc', name: 'F', deck: [new MonsterCard('', '', '', 1, 200, 300)]},
      {id: 'def', name: 'K', deck: [new MonsterCard('', '', '', 1, 300, 300)]},
    ]);
    game.summon(game.players[game.turn].hand[0].id, game.players[game.turn].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK);
    game.endTurn();
    game.summon(game.players[game.turn].hand[0].id, game.players[game.turn].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK);
    game.endTurn();

    const life = game.players[0].life;
    assert.isObject(game.players[0].field.monsterSlots[0]);
    assert.isObject(game.players[1].field.monsterSlots[0]);

    assertGameSuccess(game.attack(game.players[game.turn].field.monsterSlots[0].id, game.players[1].field.monsterSlots[0].id));

    assert.equal(game.players[0].life, life - 100);
    assert.equal(game.players[1].life, life);
    assert.isNull(game.players[0].field.monsterSlots[0]);
    assert.isObject(game.players[1].field.monsterSlots[0]);
  });

  it('U016: The Gamer can order the Marionettes to Attack other Gamers\' Marionettes (300 ATK -> 200 ATK)', () => {
    const game = new Game([
      {id: 'abc', name: 'F', deck: [new MonsterCard('', '', '', 1, 300, 300)]},
      {id: 'def', name: 'K', deck: [new MonsterCard('', '', '', 1, 200, 300)]},
    ]);
    game.summon(game.players[0].hand[0].id, game.players[0].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK);
    game.endTurn();
    game.summon(game.players[1].hand[0].id, game.players[1].field.getMonsterSlotId(0), Card.REVEALED, Card.ATTACK);
    game.endTurn();

    const life = game.players[0].life;
    assert.isObject(game.players[0].field.monsterSlots[0]);
    assert.isObject(game.players[1].field.monsterSlots[0]);

    assertGameSuccess(game.attack(game.players[game.turn].field.monsterSlots[0].id, game.players[1].field.monsterSlots[0].id));

    assert.equal(game.players[0].life, life);
    assert.equal(game.players[1].life, life - 100);
    assert.isObject(game.players[0].field.monsterSlots[0]);
    assert.isNull(game.players[1].field.monsterSlots[0]);
  });
});

exports.assertGameSuccess = assertGameSuccess;
exports.assertGameError = assertGameError;
exports.assertGameSuspend = assertGameSuspend;

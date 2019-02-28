const assert = require('chai').assert;

const Game = require('../../../src/gameplay/Game');
const Card = require('../../../src/gameplay/cards/Card');
const KaibamanCard = require('../../../src/gameplay/cards/KaibamanCard');
const FloodgateTrapHoleCard = require('../../../src/gameplay/cards/FloodgateTrapHoleCard');

const {assertGameSuccess, assertGameSuspend, assertGameError} = require('../Game');

describe('FloodgateTrapHoleCard', () => {
  function buildDeck() {
    return [new KaibamanCard(), new FloodgateTrapHoleCard()];
  }

  it('#activate', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}, {id: 'def', deck: buildDeck()}]);
    const card = game.players[0].hand[0];
    assert.isFalse(game.players[0].hand[0].canInvoke());
    assertGameSuccess(game.place(0, 0, Card.HIDDEN));
    assertGameSuccess(game.endTurn());
    assert.equal(game.turn, 1);
    assertGameSuspend(game.summon(1, 0, Card.REVEALED, Card.ATTACK), Game.AFTER);
    assertGameSuccess(game.activateTrap(game.players[0].userId, game.players[0].field.spellSlots[0].id, []));
    assert.equal(game.players[0].field.spellSlots[0], null);
    assert.equal(game.players[0].field.graveyard[0], card); // in graveyard
    assert.equal(game.players[1].field.monsterSlots[0].display, Card.HIDDEN);
    assert.equal(game.players[1].field.monsterSlots[0].pose, Card.DEFENSE);
    assert.isFalse(game.players[1].field.monsterSlots[0].canChangeDisplay(Card.REVEALED));
    assert.isFalse(game.players[1].field.monsterSlots[0].canChangePose(Card.ATTACK));
    assertGameSuccess(game.resume());
    assertGameSuccess(game.endTurn());
    assert.equal(game.turn, 0);
    assertGameSuccess(game.endTurn());
    assert.equal(game.turn, 1);
    assertGameError(game.changeDisplay(0, Card.REVEALED));
    assertGameError(game.changePose(0, Card.ATTACK));
    assert.equal(game.players[1].field.monsterSlots[0].display, Card.HIDDEN);
    assert.equal(game.players[1].field.monsterSlots[0].pose, Card.DEFENSE);
  });

  it('#activate zhenglun', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}, {id: 'def', deck: buildDeck()}]);
    assertGameSuccess(game.place(0, 0, Card.HIDDEN));
    assertGameSuccess(game.endTurn());
    // end of player[0]'s turn, not it is player[1]'s turn
    assert.equal(game.turn, 1);
    // player[1] summons KaibaMan, monsterIdx = 0
    assertGameSuspend(game.summon(1, 0, Card.REVEALED, Card.ATTACK), Game.AFTER);
    // player[0] activates trap
    assertGameSuccess(game.activateTrap(game.players[0].userId, game.players[0].field.spellSlots[0].id, []));
    assertGameSuccess(game.resume());
    // assert KaibaMan, belongs to player[1] and monsterIdx = 0, has pose = Card.HIDDEN
    assert.equal(game.players[1].field.monsterSlots[0].pose, Card.DEFENSE);
    // assert KaibaMan, belongs to player[1] and monsterIdx = 0, has display = Card.HIDDEN
    assert.equal(game.players[1].field.monsterSlots[0].display, Card.HIDDEN);
    // player[1]'s KaibaMan cannot change it battle position
    assertGameError(game.changePose(0, Card.ATTACK));
    assertGameError(game.changeDisplay(0, Card.REVEALED));
    assertGameSuccess(game.endTurn());
    // player[0]'s turn
    assert.equal(game.turn, 0);
    assertGameSuccess(game.endTurn());
    // player[1]'s turn
    assert.equal(game.turn, 1);
    // player[1]'s KaibaMan cannot change it battle position
    assertGameError(game.changePose(0, Card.ATTACK));
    assertGameError(game.changeDisplay(0, Card.REVEALED));
    // assert KaibaMan, belongs to player[1] and monsterIdx = 0, has pose = Card.HIDDEN
    assert.equal(game.players[1].field.monsterSlots[0].pose, Card.DEFENSE);
    // assert KaibaMan, belongs to player[1] and monsterIdx = 0, has display = Card.HIDDEN
    assert.equal(game.players[1].field.monsterSlots[0].display, Card.HIDDEN);
    assertGameSuccess(game.endTurn());
    assert.equal(game.turn, 0);
  });

  it('#canActivate', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}, {id: 'def', deck: buildDeck()}]);
    assertGameSuccess(game.place(0, 0, Card.REVEALED));
    assertGameSuccess(game.endTurn());
    // end of player[0]'s turn, now it is player[1]'s turn
    assert.equal(game.turn, 1);
    // error since can't activate trap (no monster summoned)
    assertGameError(game.activateTrap(game.players[0].userId, game.players[0].field.spellSlots[0].id, []));
    // success since can activate (monster summoned)
    assertGameSuspend(game.summon(1, 0, Card.REVEALED, Card.ATTACK), Game.AFTER);
    assertGameSuccess(game.activateTrap(game.players[0].userId, game.players[0].field.spellSlots[0].id, []));
  });
});

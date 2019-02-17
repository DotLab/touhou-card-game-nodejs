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
    assertGameSuccess(game.place(0, 0, Card.REVEALED));
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
});

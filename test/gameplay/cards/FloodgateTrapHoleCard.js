const assert = require('chai').assert;

const Game = require('../../../src/gameplay/Game');
const Card = require('../../../src/gameplay/cards/Card');
const KaibamanCard = require('../../../src/gameplay/cards/KaibamanCard');
const FloodgateTrapHoleCard = require('../../../src/gameplay/cards/FloodgateTrapHoleCard');

const {assertGameSuccess, assertGameSuspend} = require('../Game');

describe('FloodgateTrapHoleCard', () => {
  function buildDeck() {
    return [new KaibamanCard(), new FloodgateTrapHoleCard()];
  }

  it('#activate', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}, {id: 'def', deck: buildDeck()}]);
    assertGameSuccess(game.place(0, 0, Card.REVEALED));
    assertGameSuccess(game.endTurn());
    assert.equal(game.turn, 1);
    assertGameSuspend(game.summon(1, 0, Card.REVEALED, Card.ATTACK), Game.AFTER);
    assertGameSuccess(game.activateTrap(game.players[0].userId, game.players[0].field.spellSlots[0].id, []));
    assertGameSuccess(game.resume());
    assertGameSuccess(game.endTurn());
    assert.equal(game.turn, 0);
  });
});

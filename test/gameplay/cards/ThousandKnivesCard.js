const assert = require('chai').assert;

const Game = require('../../../src/gameplay/Game');
const Card = require('../../../src/gameplay/cards/Card');
const DarkMagicianCard = require('../../../src/gameplay/cards/DarkMagicianCard');
const ThousandKnivesCard = require('../../../src/gameplay/cards/ThousandKnivesCard');

const {assertGameSuccess} = require('../Game');

describe('ThousandKnives', () => {
  function buildDeck() {
    return [new DarkMagicianCard(), new DarkMagicianCard(), new DarkMagicianCard(), new ThousandKnivesCard(), new DarkMagicianCard()];
  }

  it('#activate', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}, {id: 'def', deck: buildDeck()}]);
    // summon dark magician
    assertGameSuccess(game.summon(0, 0, Card.REVEALED, Card.ATTACK));
    assertGameSuccess(game.endTurn());
    // end of player[0]'s turn, not it is player[1]'s turn
    assert.equal(game.turn, 1);
    // player[1] place cards on field
    assertGameSuccess(game.summon(0, 0, Card.REVEALED, Card.ATTACK));
    assertGameSuccess(game.endTurn());
    // end of player[1]'s turn, not it is player[0]'s turn
    assert.equal(game.turn, 0);
    // Dark Magic Attack can invoke!
    assert.isTrue(game.players[0].hand[0].canInvoke(game, game.players[0], ['def', 0]));
    // Invoke!
    assertGameSuccess(game.place(0, 0, Card.REVEALED));
    // player[0] invokes, player[1] takes the effect
    assertGameSuccess(game.invokeSpell(0, ['def', 0]));
    // All trap and spell card of players[1] destroyed
    assert.equal(game.players[1].field.monsterSlots[0], null);
    // DMA goes into graveyard
    assert.equal(game.players[1].field.graveyard.length, 1);
    assert.equal(game.players[1].field.graveyard.length, 1);
  });
});

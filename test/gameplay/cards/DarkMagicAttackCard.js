const assert = require('chai').assert;

const Game = require('../../../src/gameplay/Game');
const Card = require('../../../src/gameplay/cards/Card');
const DarkMagicianCard = require('../../../src/gameplay/cards/DarkMagicianCard');
const DarkMagicAttackCard = require('../../../src/gameplay/cards/DarkMagicAttackCard');
const FloodgateTrapHoleCard = require('../../../src/gameplay/cards/FloodgateTrapHoleCard');

const {assertGameSuccess} = require('../Game');

describe('DarkMagicAttackCard', () => {
  function buildDeck() {
    return [new DarkMagicianCard(), new DarkMagicianCard(), new FloodgateTrapHoleCard(), new DarkMagicAttackCard(), new DarkMagicAttackCard()];
  }

  it('#activate', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}, {id: 'def', deck: buildDeck()}]);
    // summon dark magician
    assertGameSuccess(game.summon(3, 0, Card.REVEALED, Card.ATTACK));
    assertGameSuccess(game.endTurn());
    // end of player[0]'s turn, not it is player[1]'s turn
    assert.equal(game.turn, 1);
    // player[1] place cards on field
    assertGameSuccess(game.place(0, 0, Card.HIDDEN));
    assertGameSuccess(game.place(0, 1, Card.HIDDEN));
    assertGameSuccess(game.place(0, 2, Card.HIDDEN));
    assertGameSuccess(game.endTurn());
    // end of player[1]'s turn, not it is player[0]'s turn
    assert.equal(game.turn, 0);
    // Dark Magic Attack can invoke!
    assert.isTrue(game.players[0].hand[0].canInvoke(game.players[0]));
    // Invoke!
    assertGameSuccess(game.place(0, 0, Card.REVEALED));
    // player[0] invokes, player[1] takes the effect
    assertGameSuccess(game.invokeSpell(0, [game.players[0], 'def']));
    // All trap and spell card of players[1] destroyed
    assert.equal(game.players[1].field.spellSlots[0], null);
    assert.equal(game.players[1].field.spellSlots[1], null);
    assert.equal(game.players[1].field.spellSlots[2], null);
    assert.equal(game.players[1].field.graveyard.length, 3);
    // DMA goes into graveyard
    assert.equal(game.players[0].field.spellSlots[0], null);
    assert.equal(game.players[0].field.graveyard.length, 1);
  });
  it('#cannot activate', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}, {id: 'def', deck: buildDeck()}]);
    assert.isFalse(game.players[0].hand[0].canInvoke(game.players[0]));
  });
});

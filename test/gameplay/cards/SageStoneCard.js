const assert = require('chai').assert;

const Game = require('../../../src/gameplay/Game');
const Card = require('../../../src/gameplay/cards/Card');
const DarkMagicianCard = require('../../../src/gameplay/cards/DarkMagicianCard');
const DarkMagicianGirlCard = require('../../../src/gameplay/cards/DarkMagicianGirlCard');
const SageStoneCard = require('../../../src/gameplay/cards/SageStoneCard');

const {assertGameSuccess} = require('../Game');

describe('SageStone', () => {
  function buildDeck() {
    return [new DarkMagicianGirlCard(), new DarkMagicianCard(), new DarkMagicianGirlCard(), new SageStoneCard(), new DarkMagicianGirlCard()];
  }

  it('#activate', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}, {id: 'def', deck: buildDeck()}]);
    // summon dark magiciangirl
    assertGameSuccess(game.summon(0, 0, Card.REVEALED, Card.ATTACK));
    assert.isTrue(game.players[0].hand[0].canInvoke(game, game.players[0], [1]));
    assertGameSuccess(game.place(0, 0, Card.REVEALED));
    assertGameSuccess(game.invokeSpell(0, [1]));
    assert.equal(game.players[0].field.monsterSlots[1].name, DarkMagicianCard.Name );
    assert.equal(game.players[0].field.graveyard.length, 1);
  });
});

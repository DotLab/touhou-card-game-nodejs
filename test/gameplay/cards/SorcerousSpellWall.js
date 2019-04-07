const assert = require('chai').assert;

const Game = require('../../../src/gameplay/Game');
const Card = require('../../../src/gameplay/cards/Card');
const DarkMagicianCard = require('../../../src/gameplay/cards/DarkMagicianCard');
const SorcerousSpellWallCard = require('../../../src/gameplay/cards/SorcerousSpellWallCard');

const {assertGameSuccess} = require('../Game');

describe('DarkMagicVeilCard', () => {
  function buildDeck() {
    return [new DarkMagicianCard(), new DarkMagicianCard(), new DarkMagicianCard(), new DarkMagicianCard(), new SorcerousSpellWallCard()];
  }

  it('#invoke', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    assertGameSuccess(game.placeEnv(0));
    assertGameSuccess(game.summon(1, 0, Card.REVEALED, Card.ATTACK));
    assert.equal(game.players[0].field.monsterSlots[0].atk, 2800);
  });
});

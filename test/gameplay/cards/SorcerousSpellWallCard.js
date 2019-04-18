const assert = require('chai').assert;

const Game = require('../../../src/gameplay/Game');
const Card = require('../../../src/gameplay/cards/Card');
const DarkMagicianCard = require('../../../src/gameplay/cards/DarkMagicianCard');
const SorcerousSpellWallCard = require('../../../src/gameplay/cards/SorcerousSpellWallCard');

const {assertGameSuccess} = require('../Game');

describe('SorcerousSpellWallCard', () => {
  function buildDeck() {
    return [new DarkMagicianCard(), new DarkMagicianCard(), new DarkMagicianCard(), new DarkMagicianCard(), new SorcerousSpellWallCard()];
  }

  it('#invoke', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    assertGameSuccess(game.applyEnvironment(game.players[game.turn].hand[0].id));
    assertGameSuccess(game.summon(game.players[0].hand[0].id, game.players[0].field.getMonsterSlotId(1), Card.REVEALED, Card.ATTACK));
    assert.equal(game.players[0].field.monsterSlots[1].atk, DarkMagicianCard.Atk + SorcerousSpellWallCard.Atk);
    assert.equal(game.players[0].field.monsterSlots[1].dfs, DarkMagicianCard.Dfs + SorcerousSpellWallCard.Dfs);
    assert.isObject(game.takeSnapshot());
    // assert.equal(game.players[0].field.monsterSlots[1].atk, 2800);
  });
});

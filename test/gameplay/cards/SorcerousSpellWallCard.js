const assert = require('chai').assert;

const Game = require('../../../src/gameplay/Game');
const Card = require('../../../src/gameplay/cards/Card');
const DarkMagicianCard = require('../../../src/gameplay/cards/DarkMagicianCard');
const SorcerousSpellWallCard = require('../../../src/gameplay/cards/SorcerousSpellWallCard');

const {assertGameSuccess} = require('../Game');

describe('SorcerousSpellWallCard', () => {
  // initialize a deck with four monster cards, and the environment card SorcerousSpellWallCard
  function buildDeck() {
    return [new DarkMagicianCard(), new DarkMagicianCard(), new DarkMagicianCard(), new DarkMagicianCard(), new SorcerousSpellWallCard()];
  }

  it('#invoke', () => {
    // build the game, create one user
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    // player 0 should deploy the environment card Sorcerous Spell Wall
    assertGameSuccess(game.applyEnvironment(game.players[game.turn].hand[0].id));
    // then player 0 should summon the tested monster card
    assertGameSuccess(game.summon(game.players[0].hand[0].id, game.players[0].field.getMonsterSlotId(1), Card.REVEALED, Card.ATTACK));
    // environment card should apply effects on the monster card, i.e attack and defense should increase
    assert.equal(game.players[0].field.monsterSlots[1].atk, DarkMagicianCard.Atk + SorcerousSpellWallCard.Atk);
    assert.equal(game.players[0].field.monsterSlots[1].dfs, DarkMagicianCard.Dfs + SorcerousSpellWallCard.Dfs);
    assert.isObject(game.takeSnapshot());
  });
});

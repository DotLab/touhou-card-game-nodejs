const assert = require('chai').assert;

const Game = require('../../../src/gameplay/Game');
const Card = require('../../../src/gameplay/cards/Card');
const DarkMagicianCard = require('../../../src/gameplay/cards/DarkMagicianCard');
const DarkMagicVeilCard = require('../../../src/gameplay/cards/DarkMagicVeilCard');

const {assertGameSuccess} = require('../Game');

describe('DarkMagicVeilCard', () => {
  function buildDeck() {
    return [new DarkMagicianCard(), new DarkMagicianCard(), new DarkMagicVeilCard(), new DarkMagicVeilCard(), new DarkMagicVeilCard()];
  }

  function buildDeck2() {
    return [new DarkMagicVeilCard(), new DarkMagicVeilCard(), new DarkMagicVeilCard(), new DarkMagicVeilCard(), new DarkMagicVeilCard()];
  }

  it('#invoke', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    // Dark Magic Attack can invoke!
    assert.isTrue(game.players[0].hand[0].canInvoke(game, game.players[0], [game.players[game.turn].field.getMonsterSlotId(0)]));
    game.players[0].life = 500;
    assert.isFalse(game.players[0].hand[0].canInvoke(game, game.players[0], [game.players[game.turn].field.getMonsterSlotId(0)]));
    game.players[0].life = 3000;
    assert.isTrue(game.players[0].hand[0].canInvoke(game, game.players[0], [game.players[game.turn].field.getMonsterSlotId(0)]));
    // Invoke!
    const prelife = game.players[0].life;
    assertGameSuccess(game.place(game.players[game.turn].hand[0].id, game.players[game.turn].field.getSpellSlotId(0), Card.REVEALED));
    assertGameSuccess(game.invokeSpell(game.players[0].field.spellSlots[0].id, [game.players[game.turn].field.getMonsterSlotId(0)]));
    assert.equal(game.players[0].life, prelife - DarkMagicVeilCard.LifeInvoke);
    assert.isFalse(game.players[0].hand[1].canInvoke(game, game.players[0], [game.players[game.turn].field.getMonsterSlotId(0)]));
    assert.equal(game.players[0].field.spellSlots[0], null);
    assert.equal(game.players[0].field.graveyard.length, 1);
    game.takeSnapshot();
  });

  it('#cannotInvoke', () => {
    const game = new Game([{id: 'abc', deck: buildDeck2()}]);
    // Dark Magic Attack can invoke!
    assert.isFalse(game.players[0].hand[0].canInvoke(game, game.players[0], [game.players[game.turn].field.getMonsterSlotId(0)]));
  });
});

const assert = require('chai').assert;

const Game = require('../../../src/gameplay/Game');
const Card = require('../../../src/gameplay/cards/Card');
const SpellbookOfSecretsCard = require('../../../src/gameplay/cards/SpellbookOfSecretsCard');
const SpellbookOfEternityCard = require('../../../src/gameplay/cards/SpellbookOfEternityCard');
const {assertGameSuccess} = require('../Game');

describe('SpellbookOfEternityCard', () => {
  function buildDeck() {
    return [new SpellbookOfEternityCard(), new SpellbookOfSecretsCard(), new SpellbookOfEternityCard(), new SpellbookOfEternityCard(), new SpellbookOfSecretsCard(), new SpellbookOfEternityCard(), new SpellbookOfEternityCard()];
  }

  it('#canInvoke', () => {
    // Check the invoke condition of Spellbook of Eternity
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    game.players[0].field.oblivion.push(new SpellbookOfSecretsCard());
    assert.isTrue(game.players[0].hand[0].canInvoke(game, game.players[0], [0]));
  });

  it('#sameName', () => {
    // Can't invoke for the card with same name
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    game.players[0].field.oblivion.push(new SpellbookOfEternityCard());
    assert.isFalse(game.players[0].hand[0].canInvoke(game, game.players[0], [0]));
  });

  it('#activate', () => {
    // Activate Spellbook of Eternity
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    game.players[0].field.oblivion.push(new SpellbookOfEternityCard());
    game.players[0].field.oblivion.push(new SpellbookOfSecretsCard());
    // Invoke
    assert.isTrue(game.players[0].hand[0].canInvoke(game, game.players[0], [1]));
    assertGameSuccess(game.place(game.players[game.turn].hand[0].id, game.players[game.turn].field.getSpellSlotId(0), Card.HIDDEN));
    assertGameSuccess(game.invokeSpell(game.players[0].field.spellSlots[0].id, [1]));
    // Get Spellbook of Secrets to hand from oblivion
    assert.isTrue(game.players[0].hand[game.players[0].hand.length-1].name === SpellbookOfSecretsCard.Name);
    assert.isTrue(game.players[0].field.oblivion.length === 1);
    game.takeSnapshot();
  });

  it('#cannotReactivate', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    game.players[0].field.oblivion.push(new SpellbookOfEternityCard());
    game.players[0].field.oblivion.push(new SpellbookOfSecretsCard());
    game.players[0].field.oblivion.push(new SpellbookOfSecretsCard());
    // Invoke
    assert.isTrue(game.players[0].hand[0].canInvoke(game, game.players[0], [1]));
    assertGameSuccess(game.place(game.players[game.turn].hand[0].id, game.players[game.turn].field.getSpellSlotId(0), Card.HIDDEN));
    assertGameSuccess(game.invokeSpell(game.players[0].field.spellSlots[0].id, [1]));
    // Get Spellbook of Secrets to hand from oblivion
    assert.isTrue(game.players[0].hand[game.players[0].hand.length-1].name === SpellbookOfSecretsCard.Name);
    assert.isTrue(game.players[0].field.oblivion.length === 2);
    // Cannot Reactivate again
    assert.isFalse(game.players[0].hand[0].canInvoke(game, game.players[0], [1]));
  });
});

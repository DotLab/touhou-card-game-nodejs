const assert = require('chai').assert;

const Game = require('../../../src/gameplay/Game');
const Card = require('../../../src/gameplay/cards/Card');
const SpellbookOfSecretsCard = require('../../../src/gameplay/cards/SpellbookOfSecretsCard');
const SpellbookOfEternityCard = require('../../../src/gameplay/cards/SpellbookOfEternityCard');
const BlueEyesWhiteDragonCard = require('../../../src/gameplay/cards/BlueEyesWhiteDragonCard');
const {assertGameSuccess} = require('../Game');

describe('SpellbookOfSecretsCard', () => {
  function buildDeck() {
    return [new BlueEyesWhiteDragonCard(), new SpellbookOfEternityCard(), new SpellbookOfSecretsCard(), new SpellbookOfEternityCard(), new BlueEyesWhiteDragonCard(), new SpellbookOfEternityCard(), new SpellbookOfEternityCard(), new SpellbookOfSecretsCard(), new SpellbookOfSecretsCard()];
  }

  it('#canInvoke', () => {
    // Test Invoke Condition
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    const targetName = SpellbookOfEternityCard.Name;
    assert.isTrue(game.players[0].hand[0].canInvoke(game, game.players[0], [targetName]));
  });

  it('#incorrectName', () => {
    // Cannot invoke if name does not have spellbook
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    const targetName = BlueEyesWhiteDragonCard.name;
    assert.isFalse(game.players[0].hand[0].canInvoke(game, game.players[0], [targetName]));
  });

  it('#sameName', () => {
    // Cannot invoke for card with same name
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    const targetName = SpellbookOfSecretsCard.name;
    assert.isFalse(game.players[0].hand[0].canInvoke(game, game.players[0], [targetName]));
  });

  it('#noCardFound', () => {
    // No spellbook card found
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    const targetName = 'Kaibaman';
    assert.isFalse(game.players[0].hand[0].canInvoke(game, game.players[0], [targetName]));
  });

  it('#activate', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    const targetName = SpellbookOfEternityCard.Name;
    // Activate Spellbook Of Secrets
    assert.isTrue(game.players[0].hand[0].canInvoke(game, game.players[0], [targetName]));
    assertGameSuccess(game.place(game.players[game.turn].hand[0].id, game.players[game.turn].field.getSpellSlotId(0), Card.HIDDEN));
    assertGameSuccess(game.invokeSpell(game.players[0].field.spellSlots[0].id, [targetName]));
    // Added Spellbook Of EternityCard into hand
    assert.isTrue(game.players[0].hand[game.players[0].hand.length-1].name === SpellbookOfEternityCard.Name);
    game.takeSnapshot();
  });

  it('#cannotReactivate', () => {
    // Cannot activate twice in a row
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    const targetName = SpellbookOfEternityCard.Name;
    assert.isTrue(game.players[0].hand[0].canInvoke(game, game.players[0], [targetName]));
    assertGameSuccess(game.place(game.players[game.turn].hand[0].id, game.players[game.turn].field.getSpellSlotId(0), Card.HIDDEN));
    assertGameSuccess(game.invokeSpell(game.players[0].field.spellSlots[0].id, [targetName]));
    assert.isTrue(game.players[0].hand[game.players[0].hand.length-1].name === SpellbookOfEternityCard.Name);
    assert.isFalse(game.players[0].hand[0].canInvoke(game, game.players[0], [targetName]));
  });
});

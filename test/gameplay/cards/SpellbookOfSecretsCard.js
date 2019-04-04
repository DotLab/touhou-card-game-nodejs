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
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    const targetName = SpellbookOfEternityCard.Name;
    assert.isTrue(game.players[0].hand[0].canInvoke(game, game.players[0], [targetName]));
  });

  it('#incorrectName', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    const targetName = BlueEyesWhiteDragonCard.name;
    assert.isFalse(game.players[0].hand[0].canInvoke(game, game.players[0], [targetName]));
  });

  it('#sameName', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    const targetName = SpellbookOfSecretsCard.name;
    assert.isFalse(game.players[0].hand[0].canInvoke(game, game.players[0], [targetName]));
  });

  it('#noCardFound', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    const targetName = 'Kaibaman';
    assert.isFalse(game.players[0].hand[0].canInvoke(game, game.players[0], [targetName]));
  });

  it('#activate', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    const targetName = SpellbookOfEternityCard.Name;
    assert.isTrue(game.players[0].hand[0].canInvoke(game, game.players[0], [targetName]));
    assertGameSuccess(game.place(0, 0, Card.HIDDEN));
    assertGameSuccess(game.invokeSpell(0, [targetName]));
    assert.isTrue(game.players[0].hand[game.players[0].hand.length-1].name === SpellbookOfEternityCard.Name);
  });

  it('#cannotReactivate', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    const targetName = SpellbookOfEternityCard.Name;
    assert.isTrue(game.players[0].hand[0].canInvoke(game, game.players[0], [targetName]));
    assertGameSuccess(game.place(0, 0, Card.HIDDEN));
    assertGameSuccess(game.invokeSpell(0, [targetName]));
    assert.isTrue(game.players[0].hand[game.players[0].hand.length-1].name === SpellbookOfEternityCard.Name);
    assert.isFalse(game.players[0].hand[0].canInvoke(game, game.players[0], [targetName]));
  });
});

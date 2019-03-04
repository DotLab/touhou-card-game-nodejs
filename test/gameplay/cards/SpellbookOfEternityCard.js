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
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    game.players[0].field.oblivion.push(new SpellbookOfSecretsCard());
    assert.isTrue(game.players[0].hand[0].canInvoke(game, game.players[0], [0]));
  });

  it('#sameName', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    game.players[0].field.oblivion.push(new SpellbookOfEternityCard());
    assert.isFalse(game.players[0].hand[0].canInvoke(game, game.players[0], [0]));
  });

  it('#activate', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    game.players[0].field.oblivion.push(new SpellbookOfEternityCard());
    game.players[0].field.oblivion.push(new SpellbookOfSecretsCard());
    assert.isTrue(game.players[0].hand[0].canInvoke(game, game.players[0], [1]));
    assertGameSuccess(game.place(0, 0, Card.HIDDEN));
    assertGameSuccess(game.invokeSpell(0, [1]));
    assert.isTrue(game.players[0].hand[game.players[0].hand.length-1].name === SpellbookOfSecretsCard.Name);
    assert.isTrue(game.players[0].field.oblivion.length === 1);
  });

  it('#cannotReactivate', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    game.players[0].field.oblivion.push(new SpellbookOfEternityCard());
    game.players[0].field.oblivion.push(new SpellbookOfSecretsCard());
    game.players[0].field.oblivion.push(new SpellbookOfSecretsCard());
    assert.isTrue(game.players[0].hand[0].canInvoke(game, game.players[0], [1]));
    assertGameSuccess(game.place(0, 0, Card.HIDDEN));
    assertGameSuccess(game.invokeSpell(0, [1]));
    assert.isTrue(game.players[0].hand[game.players[0].hand.length-1].name === SpellbookOfSecretsCard.Name);
    assert.isTrue(game.players[0].field.oblivion.length === 2);
    assert.isFalse(game.players[0].hand[0].canInvoke(game, game.players[0], [1]));
  });
});

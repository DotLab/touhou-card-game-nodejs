const assert = require('chai').assert;

const Game = require('../../../src/gameplay/Game');
const Card = require('../../../src/gameplay/cards/Card');
const KaibamanCard = require('../../../src/gameplay/cards/KaibamanCard');
const PotOfGreedCard = require('../../../src/gameplay/cards/PotOfGreedCard');

const {assertGameSuccess} = require('../Game');

describe('PotOfGreedCard', () => {
  function buildDeck() {
    return [new KaibamanCard(), new KaibamanCard(), new KaibamanCard(), new KaibamanCard(), new KaibamanCard(), new KaibamanCard(), new PotOfGreedCard()];
  }

  it('#activate', () => {
    const game = new Game([{id: 'abc', deck: buildDeck()}]);
    const card = game.players[0].hand[0];
    // Check if Pot of greed can be used
    assert.isTrue(game.players[0].hand[0].canInvoke());
    assertGameSuccess(game.place(game.players[game.turn].hand[0].id, game.players[game.turn].field.getSpellSlotId(0), Card.HIDDEN));
    // Keep track of the number of hand before using pot of greed
    const preInvokeHand = game.players[0].hand.length;
    // Use Pot of greed
    assertGameSuccess(game.invokeSpell(game.players[0].field.spellSlots[0].id, []));
    assert.equal(game.players[0].field.spellSlots[0], null);
    assert.equal(game.players[0].field.graveyard[0], card);
    // Added two cards into hands successfully
    assert.equal(game.players[0].hand.length, preInvokeHand + PotOfGreedCard.CardsDraw);
    game.takeSnapshot();
  });
});

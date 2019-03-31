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
    assert.isTrue(game.players[0].hand[0].canInvoke());
    assertGameSuccess(game.place(0, 0, Card.HIDDEN));
    const preInvokeHand = game.players[0].hand.length;
    assertGameSuccess(game.invokeSpell(0, []));
    assert.equal(game.players[0].field.spellSlots[0], null);
    assert.equal(game.players[0].field.graveyard[0], card);
    assert.equal(game.players[0].hand.length, preInvokeHand + PotOfGreedCard.CardsDraw);
  });
});

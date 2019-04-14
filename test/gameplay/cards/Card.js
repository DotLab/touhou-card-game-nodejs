const assert = require('chai').assert;

const Card = require('../../../src/gameplay/cards/Card');

describe('Card', () => {
  it('#default', () => {
    const card = new Card('', '', '');
    assert.isFalse(card.canInvoke());
    assert.isFalse(card.canPlace());
    assert.isFalse(card.canSummon());
    assert.isUndefined(card.invoke());
    assert.isUndefined(card.place());
    assert.isUndefined(card.summon());
  });
});

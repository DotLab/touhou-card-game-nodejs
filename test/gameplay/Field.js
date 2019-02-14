const assert = require('chai').assert;

const Field = require('../../src/gameplay/Field');

describe('Field', () => {
  it('.constructor', () => {
    const field = new Field();
    assert.lengthOf(field.monsterSlots, 4);
    assert.lengthOf(field.spellSlots, 4);
    assert.lengthOf(field.graveyard, 0);
  });
});

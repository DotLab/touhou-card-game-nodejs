const assert = require('chai').assert;

const Field = require('../../src/gameplay/Field');
const Card = require('../../src/gameplay/cards/Card');
const KaibamanCard = require('../../src/gameplay/cards/KaibamanCard');

describe('Field', () => {
  it('.constructor', () => {
    const field = new Field();
    assert.lengthOf(field.monsterSlots, 4);
    assert.lengthOf(field.spellSlots, 4);
    assert.lengthOf(field.graveyard, 0);
  });

  it('#endTurn', () => {
    const field = new Field();
    field.endTurn();
    field.environmentSlot = new Card();
    field.monsterSlots[0] = new KaibamanCard();
    field.monsterSlots[1] = new KaibamanCard();
    field.monsterSlots[2] = new KaibamanCard();
    field.monsterSlots[3] = new KaibamanCard();
    field.spellSlots[0] = new Card();
    field.spellSlots[1] = new Card();
    field.spellSlots[2] = new Card();
    field.spellSlots[3] = new Card();
    field.endTurn();
  });

  it('#hasMonster', () => {
    const field = new Field();
    assert.isFalse(field.hasMonster());
    field.monsterSlots[0] = new KaibamanCard();
    assert.isTrue(field.hasMonster());
  });
});

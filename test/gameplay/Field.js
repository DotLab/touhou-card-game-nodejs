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

  it('#hasMonsterSlot', () => {
    const field = new Field();
    assert.isFalse(field.hasMonsterSlot('abc'));
  });

  it('#hasSpellSlot', () => {
    const field = new Field();
    assert.isFalse(field.hasSpellSlot('abc'));
  });

  it('#setSlot', () => {
    const field = new Field();
    field.setSlot(field.slotIds[0], new Card('0', '', ''));
    field.setSlot(field.slotIds[1], new Card('1', '', ''));
    field.setSlot(field.slotIds[2], new Card('2', '', ''));
    field.setSlot(field.slotIds[3], new Card('3', '', ''));
    field.setSlot(field.slotIds[4], new Card('4', '', ''));
    field.setSlot(field.slotIds[5], new Card('5', '', ''));
    field.setSlot(field.slotIds[6], new Card('6', '', ''));
    field.setSlot(field.slotIds[7], new Card('7', '', ''));
    field.setSlot(field.slotIds[8], new Card('8', '', ''));
    field.setSlot('abc', new Card('', '', ''));

    assert.equal(field.monsterSlots[0].name, '0');
    assert.equal(field.monsterSlots[1].name, '1');
    assert.equal(field.monsterSlots[2].name, '2');
    assert.equal(field.monsterSlots[3].name, '3');
    assert.equal(field.spellSlots[0].name, '4');
    assert.equal(field.spellSlots[1].name, '5');
    assert.equal(field.spellSlots[2].name, '6');
    assert.equal(field.spellSlots[3].name, '7');

    assert.equal(field.getSlot(field.slotIds[0]).name, '0');
    assert.equal(field.getSlot(field.slotIds[1]).name, '1');
    assert.equal(field.getSlot(field.slotIds[2]).name, '2');
    assert.equal(field.getSlot(field.slotIds[3]).name, '3');
    assert.equal(field.getSlot(field.slotIds[4]).name, '4');
    assert.equal(field.getSlot(field.slotIds[5]).name, '5');
    assert.equal(field.getSlot(field.slotIds[6]).name, '6');
    assert.equal(field.getSlot(field.slotIds[7]).name, '7');
    assert.equal(field.getSlot(field.slotIds[8]).name, '8');
    assert.isNull(field.getSlot('abc'));
  });

  it('#byId', () => {
    const field = new Field();
    let c0; let c1; let c2; let c3; let c4; let c5; let c6; let c7; let c8;
    field.setSlot(field.slotIds[0], c0 = new Card('0', '', ''));
    field.setSlot(field.slotIds[1], c1 = new Card('1', '', ''));
    field.setSlot(field.slotIds[2], c2 = new Card('2', '', ''));
    field.setSlot(field.slotIds[3], c3 = new Card('3', '', ''));
    field.setSlot(field.slotIds[4], c4 = new Card('4', '', ''));
    field.setSlot(field.slotIds[5], c5 = new Card('5', '', ''));
    field.setSlot(field.slotIds[6], c6 = new Card('6', '', ''));
    field.setSlot(field.slotIds[7], c7 = new Card('7', '', ''));
    field.setSlot(field.slotIds[8], c8 = new Card('8', '', ''));

    assert.equal(field.findCardById(c0.id).name, '0');
    assert.equal(field.findCardById(c1.id).name, '1');
    assert.equal(field.findCardById(c2.id).name, '2');
    assert.equal(field.findCardById(c3.id).name, '3');
    assert.equal(field.findCardById(c4.id).name, '4');
    assert.equal(field.findCardById(c5.id).name, '5');
    assert.equal(field.findCardById(c6.id).name, '6');
    assert.equal(field.findCardById(c7.id).name, '7');
    assert.equal(field.findCardById(c8.id).name, '8');


    assert.isNull(field.removeCardById(c0.id));
    assert.isNull(field.removeCardById(c1.id));
    assert.isNull(field.removeCardById(c2.id));
    assert.isNull(field.removeCardById(c3.id));
    assert.isNull(field.removeCardById(c4.id));
    assert.isNull(field.removeCardById(c5.id));
    assert.isNull(field.removeCardById(c6.id));
    assert.isNull(field.removeCardById(c7.id));
    assert.isNull(field.removeCardById(c8.id));
  });
});

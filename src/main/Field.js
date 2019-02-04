const MonsterCard = require('./Cards/MonsterCard');
const SpellCard = require('./Cards/SpellCard');

/**
 * Field class
 */
class Field {
  /**
       * @constructor
       */
  constructor() {
    this.environmentSlot = null;
    this.monsterSlots = new MonsterCard(4);
    this.spellSlots = new SpellCard(4);
    this.Graveyard = [];
  }
  /**
    * initialize the field;
    */
  initialize() {
    for (let i = 0; i < 4; i++) {
      this.monsterSlots[i] = null;
    }
    for (let i = 0; i < 4; i++) {
      this.spellSlots[i] = null;
    }
  }
}

module.exports = Field;

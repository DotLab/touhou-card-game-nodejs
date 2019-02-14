/**
 * The field
 */
class Field {
  /**
   * @constructor
   */
  constructor() {
    this.environmentSlot = null;
    this.monsterSlots = [null, null, null, null];
    this.spellSlots = [null, null, null, null];
    this.graveyard = [];
  }
}

module.exports = Field;

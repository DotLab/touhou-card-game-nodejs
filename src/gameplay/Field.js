/**
 * The field
 */
class Field {
  /**
   * @constructor
   */
  constructor() {
    /** @type {Card} */
    this.environmentSlot = null;
    /** @type {MonsterCard[]} */
    this.monsterSlots = [null, null, null, null];
    /** @type {Card[]} */
    this.spellSlots = [null, null, null, null];
    /** @type {Card[]} */
    this.graveyard = [];
    /** @type {Card[]} */
    this.oblivion = [];
  }

  /**
  * Remove a card from oblivion field
  * @param {Number} index card index in oblivion field
  * @return {Card} card
  */
  removeCardFromOblivion(index) {
    const removed = this.oblivion.splice(index, 1);
    return removed[0];
  }

  endTurn() {
    if (this.environmentSlot) this.environmentSlot.endTurn();
    if (this.monsterSlots[0]) this.monsterSlots[0].endTurn();
    if (this.monsterSlots[1]) this.monsterSlots[1].endTurn();
    if (this.monsterSlots[2]) this.monsterSlots[2].endTurn();
    if (this.monsterSlots[3]) this.monsterSlots[3].endTurn();
    if (this.spellSlots[0]) this.spellSlots[0].endTurn();
    if (this.spellSlots[1]) this.spellSlots[1].endTurn();
    if (this.spellSlots[2]) this.spellSlots[2].endTurn();
    if (this.spellSlots[3]) this.spellSlots[3].endTurn();
  }

  hasMonster() {
    for (let i = 0; i < this.monsterSlots.length; i += 1) {
      if (this.monsterSlots[i] !== null) return true;
    }
    return false;
  }

  canActivate(game, owner, actor, action, actionParams, phase) {
    for (let i = 0; i < this.spellSlots.length; i += 1) {
      if (this.spellSlots[i] !== null && this.spellSlots[i].canActivate(game, owner, actor, action, actionParams, phase)) {
        return true;
      }
    }
    return false;
  }

  findSpellById(id) {
    for (let i = 0; i < this.spellSlots.length; i += 1) {
      if (this.spellSlots[i] !== null && this.spellSlots[i].id === id) return this.spellSlots[i];
    }
    return null;
  }
}

module.exports = Field;

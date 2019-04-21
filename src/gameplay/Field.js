const Card = require('../gameplay/cards/Card');

// /** @typedef {import('../gameplay/cards/Card')} Card */
/** @typedef {import('../gameplay/cards/MonsterCard')} MonsterCard */
/** @typedef {import('../gameplay/cards/SpellCard')} SpellCard */
/** @typedef {import('../gameplay/cards/EnvironmentCard')} EnvironmentCard */

/**
 * Field
 */
class Field {
  /**
   * @constructor
   */
  constructor() {
    /** @type {MonsterCard[]} */
    this.monsterSlots = [null, null, null, null];
    /** @type {SpellCard[]} */
    this.spellSlots = [null, null, null, null];
    /** @type {EnvironmentCard} */
    this.environmentSlot = null;
    /** @type {Card[]} */
    this.graveyard = [];
    /** @type {Card[]} */
    this.oblivion = [];

    /** @type {Array<String>} */
    this.slotIds = [
      Card.generateId(16), Card.generateId(16), Card.generateId(16), Card.generateId(16),
      Card.generateId(16), Card.generateId(16), Card.generateId(16), Card.generateId(16),
      Card.generateId(16),
    ];
  }

  /**
   * Check if has monster slot with id
   * @param {String} id
   * @return {Boolean}
   */
  hasMonsterSlot(id) {
    for (let i = 0; i < 4; i += 1) {
      if (this.slotIds[i] === id) return true;
    }
    return false;
  }

  /**
   * Check if has spell slot with id
   * @param {String} id
   * @return {Boolean}
   */
  hasSpellSlot(id) {
    for (let i = 4; i < 8; i += 1) {
      if (this.slotIds[i] === id) return true;
    }
    return false;
  }

  /**
   * Check if slot empty
   * @param {String} id
   * @return {Boolean}
   */
  isSlotEmpty(id) {
    return !this.getSlot(id);
  }

  /**
   * Set the slot
   * @param {String} id
   * @param {Card} card
   * @return {Card}
   */
  setSlot(id, card) {
    if (id === this.slotIds[0]) return this.monsterSlots[0] = card;
    if (id === this.slotIds[1]) return this.monsterSlots[1] = card;
    if (id === this.slotIds[2]) return this.monsterSlots[2] = card;
    if (id === this.slotIds[3]) return this.monsterSlots[3] = card;
    if (id === this.slotIds[4]) return this.spellSlots[0] = card;
    if (id === this.slotIds[5]) return this.spellSlots[1] = card;
    if (id === this.slotIds[6]) return this.spellSlots[2] = card;
    if (id === this.slotIds[7]) return this.spellSlots[3] = card;
    if (id === this.slotIds[8]) return this.environmentSlot = card;
  }

  /**
   * Get slot
   * @param {String} id
   * @return {Card}
   */
  getSlot(id) {
    if (id === this.slotIds[0]) return this.monsterSlots[0];
    if (id === this.slotIds[1]) return this.monsterSlots[1];
    if (id === this.slotIds[2]) return this.monsterSlots[2];
    if (id === this.slotIds[3]) return this.monsterSlots[3];
    if (id === this.slotIds[4]) return this.spellSlots[0];
    if (id === this.slotIds[5]) return this.spellSlots[1];
    if (id === this.slotIds[6]) return this.spellSlots[2];
    if (id === this.slotIds[7]) return this.spellSlots[3];
    if (id === this.slotIds[8]) return this.environmentSlot;
    return null;
  }

  /**
   * Get monster slot ID
   * @param {Number} slotIndex
   * @return {String}
   */
  getMonsterSlotId(slotIndex) {
    return this.slotIds[slotIndex];
  }

  /**
   * Get spell slot id
   * @param {Number} slotIndex
   * @return {String}
   */
  getSpellSlotId(slotIndex) {
    return this.slotIds[4 + slotIndex];
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

  /**
   * end turn
   */
  endTurn() {
    if (this.monsterSlots[0]) this.monsterSlots[0].endTurn();
    if (this.monsterSlots[1]) this.monsterSlots[1].endTurn();
    if (this.monsterSlots[2]) this.monsterSlots[2].endTurn();
    if (this.monsterSlots[3]) this.monsterSlots[3].endTurn();
    if (this.spellSlots[0]) this.spellSlots[0].endTurn();
    if (this.spellSlots[1]) this.spellSlots[1].endTurn();
    if (this.spellSlots[2]) this.spellSlots[2].endTurn();
    if (this.spellSlots[3]) this.spellSlots[3].endTurn();
    if (this.environmentSlot) this.environmentSlot.endTurn();
  }

  /**
   * Check if has monster
   * @return {Boolean}
   */
  hasMonster() {
    for (let i = 0; i < this.monsterSlots.length; i += 1) {
      if (this.monsterSlots[i] !== null) return true;
    }
    return false;
  }

  /**
   * @param {String} id
   * @return {SpellCard|null}
   */
  findSpellById(id) {
    for (let i = 0; i < this.spellSlots.length; i += 1) {
      if (this.spellSlots[i] && this.spellSlots[i].id === id) return this.spellSlots[i];
    }
    return null;
  }

  /**
   * @param {String} id
   * @return {MonsterCard|null}
   */
  findMonsterById(id) {
    for (let i = 0; i < this.monsterSlots.length; i += 1) {
      if (this.monsterSlots[i] && this.monsterSlots[i].id === id) return this.monsterSlots[i];
    }
    return null;
  }

  /**
   * Find card by id
   * @param {String} id
   * @return {Card}
   */
  findCardById(id) {
    if (this.monsterSlots[0] && this.monsterSlots[0].id === id) return this.monsterSlots[0];
    if (this.monsterSlots[1] && this.monsterSlots[1].id === id) return this.monsterSlots[1];
    if (this.monsterSlots[2] && this.monsterSlots[2].id === id) return this.monsterSlots[2];
    if (this.monsterSlots[3] && this.monsterSlots[3].id === id) return this.monsterSlots[3];
    if (this.spellSlots[0] && this.spellSlots[0].id === id) return this.spellSlots[0];
    if (this.spellSlots[1] && this.spellSlots[1].id === id) return this.spellSlots[1];
    if (this.spellSlots[2] && this.spellSlots[2].id === id) return this.spellSlots[2];
    if (this.spellSlots[3] && this.spellSlots[3].id === id) return this.spellSlots[3];
    if (this.environmentSlot && this.environmentSlot.id === id) return this.environmentSlot;
    return null;
  }

  /**
   * Remove card by id
   * @param {String} id
   * @return {Object}
   */
  removeCardById(id) {
    if (this.monsterSlots[0] && this.monsterSlots[0].id === id) return this.monsterSlots[0] = null;
    if (this.monsterSlots[1] && this.monsterSlots[1].id === id) return this.monsterSlots[1] = null;
    if (this.monsterSlots[2] && this.monsterSlots[2].id === id) return this.monsterSlots[2] = null;
    if (this.monsterSlots[3] && this.monsterSlots[3].id === id) return this.monsterSlots[3] = null;
    if (this.spellSlots[0] && this.spellSlots[0].id === id) return this.spellSlots[0] = null;
    if (this.spellSlots[1] && this.spellSlots[1].id === id) return this.spellSlots[1] = null;
    if (this.spellSlots[2] && this.spellSlots[2].id === id) return this.spellSlots[2] = null;
    if (this.spellSlots[3] && this.spellSlots[3].id === id) return this.spellSlots[3] = null;
    if (this.environmentSlot && this.environmentSlot.id === id) return this.environmentSlot = null;
    return null;
  }

  /**
   * Kill monster by id
   * @param {String} id
   */
  killMonsterById(id) {
    for (let i = 0; i < this.monsterSlots.length; i += 1) {
      if (this.monsterSlots[i] && this.monsterSlots[i].id === id) {
        this.graveyard.push(this.monsterSlots[i]);
        this.monsterSlots[i] = null;
        return;
      }
    }
  }

  /**
   * Kill spell by id
   * @param {String} id
   */
  killSpellById(id) {
    for (let i = 0; i < this.spellSlots.length; i += 1) {
      if (this.spellSlots[i] && this.spellSlots[i].id === id) {
        this.graveyard.push(this.spellSlots[i]);
        this.spellSlots[i] = null;
        return;
      }
    }
  }
}

module.exports = Field;

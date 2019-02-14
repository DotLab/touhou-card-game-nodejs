const Card = require('./cards/Card');
const Kaibaman = require('./cards/KaibamanCard');
const MonsterCard = require('./cards/MonsterCard');
const Field = require('./Field');

/**
 * Player class
 */
class Player {
  /**
   * @constructor
   * @param {User} user the user
   */
  constructor(user) {
    this.userId = user.id;
    this.userName = user.name;
    /** @type {Card[]} */
    this.deck = user.deck;
    /** @type {Card[]} */
    this.hand = [];
    this.field = new Field();

    this.life = 5000;
    this.hasDrawn = false;
    for (let i = 0; i < 5; i += 1) {
      this.hand.push(this.deck.pop());
    }
  }

  /**
   * Draw a card.
   * @return {undefined|String} message
   */
  draw() {
    if (this.hasDrawn) return 'already drawn';
    this.hasDrawn = true;
    this.hand.push(this.deck.pop());
    return undefined;
  }

  /**
   * End turn
   */
  endTurn() {
    this.hasDrawn = false;
    this.field.endTurn();
  }

  canBeDirectlyAttacked() {
    return !this.field.hasMonster();
  }

  directAttack(monster, targetUser) {
    monster.attack();
    targetUser.receiveDirectAttack(monster.atk);
  }

  receiveDirectAttack(attack) {
    this.life -= attack;
  }

  findCardInHandByName(name) {
    for (let i = 0; i < this.hand.length; i++) {
      if (this.hand[i].name === name) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Remove a card from hand
   * @param {Number} index card index in hand
   * @return {Card} card
   */
  removeCardInHand(index) {
    const removed = this.hand.splice(index, 1);
    return removed[0];
  }

  findCardOnFieldById(id) {
    for (let i = 0; i < this.field.length; i++) {
      if (this.field.monsterSlots[i].id === id) {
        return i;
      }
    }
    return -1; // not likely to happen
  }

  killMonsterCardOnField(index) {
    const removed = this.field.monsterSlots.splice(index, 1);
    this.field.graveyard.push(removed);
  }

  placeCardOnField(index, card) {
    this.field.monsterSlots[index] = card;
  }
}

module.exports = Player;

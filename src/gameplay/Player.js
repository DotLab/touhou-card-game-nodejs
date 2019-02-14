const Field = require('./Field');
const Card = require('./cards/Card');

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
    targetUser.receiveDamage(monster.atk);
  }

  attack(monster, monsterIdx, targetUser, targetMonster, targetMonsterIdx) {
    if (targetMonster.pose === Card.ATTACK) {
      if (monster.atk > targetMonster.atk) {
        const damage = monster.atk - targetMonster.atk;
        targetUser.killMonsterOnField(targetMonsterIdx);
        targetUser.receiveDamage(damage);
      } else if (monster.atk < targetMonster.atk) {
        const damage = targetMonster.atk - monster.atk;
        this.killMonsterOnField(monsterIdx);
        this.receiveDamage(damage);
      } else {
        this.killMonsterOnField(monsterIdx);
        targetUser.killMonsterOnField(targetMonsterIdx);
      }
    }
  }

  receiveDamage(attack) {
    this.life -= attack;
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

  killMonsterOnField(index) {
    const card = this.field.monsterSlots[index];
    this.field.monsterSlots[index] = null;
    this.field.graveyard.push(card);
  }
}

module.exports = Player;

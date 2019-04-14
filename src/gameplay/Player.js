const Field = require('./Field');
const Card = require('./cards/Card');

/** @typedef {import('./cards/MonsterCard')} MonsterCard */

/**
 * Player class
 */
class Player {
  /**
   * @constructor
   * @param {any} user the user
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
    this.isSuspended = false;
    /** @type {Object.<string, boolean>}*/
    this.hasActivated = {};
  }

  canDraw() {
    if (this.hasDrawn) return false;
    return true;
  }

  /**
   * Draw a card.
   */
  draw() {
    this.hasDrawn = true;
    this.hand.push(this.deck.pop());
  }

  // shouldSuspend(game, actor, action, actionParams, phase) {
  //   return this.field.canActivate(game, this, actor, action, actionParams, phase);
  // }

  // suspend() {
  //   this.isSuspended = true;
  // }

  // resume() {
  //   this.isSuspended = false;
  // }

  /**
   * End turn
   */
  endTurn() {
    this.hasDrawn = false;
    this.hasActivated = {};
    this.field.endTurn();
  }

  /**
   * @param {string} name
   * @return {Number} index
   */
  findCardInDeckByName(name) {
    let index = -1;
    for ( let i = 0; i < this.deck.length; i++) {
      if (this.deck[i].name === name) {
        index = i;
        break;
      }
    }
    return index;
  }

  /**
   * @param {Number} index of card in Deck
   * @return the card
   */

  removeCardFromDeck(index) {
    const card = this.deck.splice(index, 1);
    return card[0];
  }

  canBeDirectlyAttacked() {
    return !this.field.hasMonster();
  }

  directAttack(monster, targetUser) {
    monster.attack();
    targetUser.receiveDamage(monster.atk);
  }

  /**
   * @param {MonsterCard} monster
   * @param {Player} targetUser
   * @param {MonsterCard} targetMonster
   */
  attack(monster, targetUser, targetMonster) {
    if (targetMonster.pose === Card.ATTACK) {
      if (monster.atk > targetMonster.atk) {
        const damage = monster.atk - targetMonster.atk;
        targetUser.field.killMonsterById(targetMonster.id);
        targetUser.receiveDamage(damage);
      } else if (monster.atk < targetMonster.atk) {
        const damage = targetMonster.atk - monster.atk;
        this.field.killMonsterById(monster.id);
        this.receiveDamage(damage);
      } else {
        this.field.killMonsterById(monster.id);
        targetUser.field.killMonsterById(targetMonster.id);
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

  /**
   * @param {String} id card id
   * @return {Card|null}
   */
  findCardInHandById(id) {
    for (let i = 0; i < this.hand.length; i += 1) {
      if (this.hand[i] && this.hand[i].id === id) return this.hand[i];
    }
    return null;
  }

  /**
   * @param {String} id card id
   */
  removeCardInHandById(id) {
    for (let i = 0; i < this.hand.length; i += 1) {
      if (this.hand[i] && this.hand[i].id === id) {
        this.hand.splice(i, 1);
        return;
      }
    }
  }
}

Player.InitialCardCount = 5;

module.exports = Player;
